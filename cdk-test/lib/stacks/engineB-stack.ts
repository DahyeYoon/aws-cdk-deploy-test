import * as cdk from '@aws-cdk/core';
// import * as sqs from '@aws-cdk/aws-sqs';
import * as lambda from '@aws-cdk/aws-lambda';
import { Duration } from '@aws-cdk/core'; 
import * as apigw from '@aws-cdk/aws-apigateway';
import * as path from 'path';
import { App } from '../Props/config'


interface Props extends cdk.StackProps {
    layers: {
      PythonModuleLayer: lambda.ILayerVersion,
    },
  }


export class EngineBStack extends cdk.Stack {
    public readonly PythonModuleLayerDep: lambda.ILayerVersion;
    public readonly layerVersionArn: string;


//   constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
  constructor(scope: cdk.Construct, id: string, props:Props) {

    super(scope, id, props);
    // The code that defines your stack goes here
    this.PythonModuleLayerDep = new lambda.LayerVersion(this, 'PythonModuleLayerDep', {
        code: lambda.Code.fromAsset(path.resolve(
          __dirname, '..', 'layers', 'python-module-layer', 'layer_dep.zip'
        )),
        compatibleRuntimes: [lambda.Runtime.PYTHON_3_7, lambda.Runtime.PYTHON_3_8,lambda.Runtime.PYTHON_3_9],
        removalPolicy: cdk.RemovalPolicy.RETAIN,
        description: 'The Lambda Layer update',
      });
      
      // lambda define
      const func = new lambda.Function(this, 'engineB_Lambda', {
        functionName: `${App.Context.ns}EngineB`, 
        code: lambda.Code.fromAsset('./lib/src'), 
        handler: 'engineB_lambda_function.lambda_handler', 
        runtime: lambda.Runtime.PYTHON_3_9,
        timeout: Duration.seconds(60),
        // layers: [props.layers.PythonModuleLayer],
        layers: [this.PythonModuleLayerDep]
        
    });

    const restASPi=new apigw.LambdaRestApi(this, 'Endpoint-B',{
      handler:func
    });

}
}
