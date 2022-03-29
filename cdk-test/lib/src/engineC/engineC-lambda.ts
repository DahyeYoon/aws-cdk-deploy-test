import * as path from 'path'
import * as cdk from '@aws-cdk/core'
import * as iam from '@aws-cdk/aws-iam'
import * as lambda from '@aws-cdk/aws-lambda'
import { App } from '../../Props/config'
import * as ec2 from '@aws-cdk/aws-ec2'
import * as apigw from '@aws-cdk/aws-apigateway';



interface Props {
  layers: {
    PythonModuleLayer: lambda.ILayerVersion,
  }
}


export class EngineCLambda extends cdk.Construct {
  public readonly engineCFunction: lambda.IFunction


  constructor(scope: cdk.Construct, id: string, props:Props) {
    super(scope, id)


    this.engineCFunction = this.createEngineCFunction()
  }

  private createEngineCFunction(): lambda.IFunction {
    const func = new lambda.Function(this, 'EngineCFunction', {
        functionName: `${App.Context.ns}EngineC`,
        code: lambda.Code.fromAsset('./lib/src'),
        handler: 'engineC_lambda_function.lambda_handler',
        runtime: lambda.Runtime.PYTHON_3_9,
        timeout: cdk.Duration.seconds(5),
        memorySize: 512,
        tracing: lambda.Tracing.ACTIVE,
        currentVersionOptions: {
        removalPolicy: cdk.RemovalPolicy.RETAIN,
        },
    })
    return func.currentVersion
  }
}