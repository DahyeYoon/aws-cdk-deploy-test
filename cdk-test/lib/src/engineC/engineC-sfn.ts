import * as path from 'path'
import * as cdk from '@aws-cdk/core'
import * as s3 from '@aws-cdk/aws-s3';
import * as iam from '@aws-cdk/aws-iam'
import * as sfn from '@aws-cdk/aws-stepfunctions'
// npm install @aws-cdk/aws-stepfunctions-tasks
import * as tasks from '@aws-cdk/aws-stepfunctions-tasks'
import * as lambda from '@aws-cdk/aws-lambda'
// npm install @aws-cdk/aws-lambda-nodejs
// import * as lambdaNodejs from '@aws-cdk/aws-lambda-nodejs'
import { App } from '../../Props/config'

interface Props {
  layers: {
    PythonModuleLayer: lambda.ILayerVersion,
  }
}

interface StateMachineProps {
  initFunction: lambda.IFunction
  runFunction: lambda.IFunction
  closeFunction: lambda.IFunction
  role: iam.IRole,
}

export class EngineCSFN extends cdk.Construct {
  public readonly stateMachine: sfn.IStateMachine
  public readonly startFunction: lambda.IFunction

  constructor(scope: cdk.Construct, id: string, props: Props) {
    super(scope, id)

    const role = new iam.Role(this, `EngineCSFNExecutionRole`, {
      assumedBy: new iam.ServicePrincipal('states.amazonaws.com'),
      managedPolicies: [
        { managedPolicyArn: 'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole' },
        { managedPolicyArn: 'arn:aws:iam::aws:policy/service-role/AWSLambdaRole' },
      ],
    })
    const initFunction = this.createInitFunction()
    const runFunction = this.createRunFunction()
    const closeFunction = this.createCloseFunction()

    this.stateMachine = this.createStateMachine({
      initFunction,
      runFunction,
      closeFunction,
      role,
    })
    this.startFunction = this.createStartFunction(this.stateMachine, props.layers.PythonModuleLayer)
    
  }



  // ===== ts handler ======
  // private createInitFunction(): lambda.IFunction {
  //   const fn = new lambdaNodejs.NodejsFunction(this, 'InitFunction', {
  //     functionName: `${App.Context.ns}Init`,
  //     entry: path.resolve(__dirname, '.', 'init.ts'),
  //     handler: 'handler',
  //     runtime: lambda.Runtime.NODEJS_14_X,
  //     timeout: cdk.Duration.seconds(5),
  //     memorySize: 256,
  //     currentVersionOptions: {
  //       removalPolicy: cdk.RemovalPolicy.RETAIN,
  //     },
  //   })
  //   return fn.currentVersion
  // }
  //==== python handler =============
  private createInitFunction(): lambda.IFunction {
    const fn = new lambda.Function(this, 'InitFunction', {
      functionName: `${App.Context.ns}Init`,
      code: lambda.Code.fromAsset('./lib/src/engineC'),
      handler: 'init.lambda_handler',
      runtime: lambda.Runtime.PYTHON_3_9,
      timeout: cdk.Duration.seconds(5),
      memorySize: 256,
      currentVersionOptions: {
        removalPolicy: cdk.RemovalPolicy.RETAIN,
      },
      environment: {
      },
    })
    return fn.currentVersion
  }
  //==========================================


  // private createRunFunction(): lambda.IFunction {
  //   const fn = new lambdaNodejs.NodejsFunction(this, 'RunFunction', {
  //     functionName: `${App.Context.ns}Run`,
  //     entry: path.resolve(__dirname, '.', 'run.ts'),
  //     handler: 'handler',
  //     runtime: lambda.Runtime.NODEJS_14_X,
  //     timeout: cdk.Duration.seconds(25),
  //     memorySize: 256,
  //     currentVersionOptions: {
  //       removalPolicy: cdk.RemovalPolicy.RETAIN,
  //     },
  //   })

  //   return fn.currentVersion
  // }
  //====  python handler =============
  private createRunFunction(): lambda.IFunction {
    const fn = new lambda.Function(this, 'RunFunction', {
      functionName: `${App.Context.ns}Run`,
      code: lambda.Code.fromAsset('./lib/src/engineC'),
      handler: 'run.lambda_handler',
      runtime: lambda.Runtime.PYTHON_3_9,
      timeout: cdk.Duration.seconds(5),
      memorySize: 256,
      currentVersionOptions: {
        removalPolicy: cdk.RemovalPolicy.RETAIN,
      },
      environment: {
      },
    })
    return fn.currentVersion
  }
  //==========================================
  // private createCloseFunction(): lambda.IFunction {
  //   const fn = new lambdaNodejs.NodejsFunction(this, 'CloseFunction', {
  //     functionName: `${App.Context.ns}Close`,
  //     entry: path.resolve(__dirname, '.', 'close.ts'),
  //     handler: 'handler',
  //     runtime: lambda.Runtime.NODEJS_14_X,
  //     timeout: cdk.Duration.seconds(5),
  //     memorySize: 128,
  //     currentVersionOptions: {
  //       removalPolicy: cdk.RemovalPolicy.RETAIN,
  //     },
  //   })
  //   return fn.currentVersion
  // }
  //==== python handler =============
  private createCloseFunction(): lambda.IFunction {
    const fn = new lambda.Function(this, 'CloseFunction', {
      functionName: `${App.Context.ns}Close`,
      code: lambda.Code.fromAsset('./lib/src/engineC'),
      handler: 'close.lambda_handler',
      runtime: lambda.Runtime.PYTHON_3_9,
      timeout: cdk.Duration.seconds(5),
      memorySize: 256,
      currentVersionOptions: {
        removalPolicy: cdk.RemovalPolicy.RETAIN,
      },
      environment: {
      },
    })
    return fn.currentVersion
  }

   //==== python handler =============
  private createStartFunction(stateMachine: sfn.IStateMachine, PythonModuleLayer: lambda.ILayerVersion): lambda.IFunction {
    const fn = new lambda.Function(this, 'StartFunction', {
      functionName: `${App.Context.ns}Start`,
      code: lambda.Code.fromAsset('./lib/src/engineC'),
      handler: 'sfn_start.lambda_handler',
      runtime: lambda.Runtime.PYTHON_3_9,
      timeout: cdk.Duration.seconds(5),
      memorySize: 256,
      layers: [PythonModuleLayer],
      currentVersionOptions: {
        removalPolicy: cdk.RemovalPolicy.RETAIN,
      },
      environment: {
        STATE_MACHINE_ARN: stateMachine.stateMachineArn,
      },
    })
    fn.addToRolePolicy(new iam.PolicyStatement({
      actions: [        
        'states:StartSyncExecution',
        "states:StartExecution"],
      resources: ['*'],
    }))
    return fn.currentVersion
  }
  //==========================================

  private createStateMachine(props: StateMachineProps): sfn.StateMachine {
    const Init = new tasks.LambdaInvoke(this, 'Init', {
      lambdaFunction: props.initFunction,
      outputPath: '$.Payload',
    })
    Init.addRetry({
      interval: cdk.Duration.seconds(1),
      maxAttempts: 3,
      backoffRate: 1.3,
    })

    const Run = new tasks.LambdaInvoke(this, 'Run', {
      lambdaFunction: props.runFunction,
      outputPath: '$.Payload',
    })
    Run.addRetry({
      interval: cdk.Duration.seconds(1),
      maxAttempts: 3,
      backoffRate: 1.3,
    })
 
    const Close = new tasks.LambdaInvoke(this, 'Close', {
      lambdaFunction: props.closeFunction,
      outputPath: '$.Payload',
    })
    Close.addRetry({
      interval: cdk.Duration.seconds(1),
      maxAttempts: 3,
      backoffRate: 1.3,
    })

    Init.next(Run).next(Close)

    const definition = sfn.Chain.start(Init)
    return new sfn.StateMachine(this, `EngineCSFN`, {
      stateMachineName: `${App.Context.ns}EngineCSFN`,
      stateMachineType: sfn.StateMachineType.EXPRESS,
      definition,
      // role: props.role,
      tracingEnabled: true,
    })
  }
}