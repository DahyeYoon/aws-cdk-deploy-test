import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import { Duration } from '@aws-cdk/core'; 
import * as apigw from '@aws-cdk/aws-apigateway';
import { App } from '../Props/config'


export class EngineAStack extends cdk.Stack {

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // The code that defines your stack goes here


      // lambda define
      const func = new lambda.Function(this, 'engineA_Lambda', {
        functionName: `${App.Context.ns}EngineA`, 
        code: lambda.Code.fromAsset('./lib/src'), 
        handler: 'engineA_lambda_function.lambda_handler', 
        runtime: lambda.Runtime.PYTHON_3_9, 
        timeout: Duration.seconds(60) 
    });

    const restASPi=new apigw.LambdaRestApi(this, 'Endpoint-A',{
      handler:func
    });

  }
  
}

