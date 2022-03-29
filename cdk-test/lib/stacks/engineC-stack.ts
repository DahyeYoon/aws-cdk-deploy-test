import * as cdk from '@aws-cdk/core'
import * as s3 from '@aws-cdk/aws-s3'
import * as sfn from '@aws-cdk/aws-stepfunctions'
// npm install @aws-cdk/aws-dynamodb
import * as dynamodb from '@aws-cdk/aws-dynamodb' 
import * as lambda from '@aws-cdk/aws-lambda'

import { EngineCSFN } from "../src/engineC/engineC-sfn"
import { EngineCLambda } from "../src/engineC/engineC-lambda"
import { Tables } from '../Props/config'
import * as apigw from '@aws-cdk/aws-apigateway';

interface Props extends cdk.StackProps {
  layers: {
    PythonModuleLayer: lambda.ILayerVersion,
  }
}

export class EngineCStack extends  cdk.Stack {
  public readonly stateMachine: sfn.IStateMachine
  public readonly testDDB: dynamodb.ITable

  constructor(scope: cdk.Construct, id: string, props: Props) {
    super(scope, id, props)

    this.testDDB = this.createTestDDB()
    // ---- engineC-sfn.ts 
    const engineC_sfn = new EngineCSFN(this, 'EngineCSFN', {
      layers: props.layers,
    })
    this.stateMachine = engineC_sfn.stateMachine
    // ---- engineC-lambda.ts
    const engineC_lambda = new EngineCLambda(this, 'EngineCLambda', {
      layers: props.layers,
    })

    const restASPic=new apigw.LambdaRestApi(this, 'Endpoint-C',{
      handler:engineC_lambda.engineCFunction
    });

    const restASPi_fsn=new apigw.LambdaRestApi(this, 'Endpoint-C-sfn',{
      handler:engineC_sfn.startFunction
    });

  }
  
  private createTestDDB() {
    return new dynamodb.Table(this, `testDDB`, {
      tableName: Tables.Name.testDDB,
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      // TODO: set RETAIN on production
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    })
  }

}
