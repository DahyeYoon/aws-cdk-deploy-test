#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AttrStack } from '../lib/stacks/attr-stack';
import { EngineAStack } from '../lib/stacks/engineA-stack';
import { EngineBStack } from '../lib/stacks/engineB-stack';
import { EngineCStack } from '../lib/stacks/engineC-stack';


const app = new cdk.App();
const attrStack = new AttrStack(app, 'AttrStack', {
  // ...Stack.Props
})
const engineAStack = new EngineAStack(app, 'EngineAStack', {
  // ...Stack.Props
})
const engineBStack = new EngineBStack(app, 'EngineBStack', {
  layers: {
    PythonModuleLayer: attrStack.PythonModuleLayer,
  },
})
const engineCStack = new EngineCStack(app, 'EngineCStack', {
  layers: {
    PythonModuleLayer: attrStack.PythonModuleLayer,
  },
})


// import { CdkTestStack } from '../lib/cdk-test-stack';

// const app = new cdk.App();
// new CdkTestStack(app, 'CdkTestStack', {
//   /* If you don't specify 'env', this stack will be environment-agnostic.
//    * Account/Region-dependent features and context lookups will not work,
//    * but a single synthesized template can be deployed anywhere. */

//   /* Uncomment the next line to specialize this stack for the AWS Account
//    * and Region that are implied by the current CLI configuration. */
//   // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

//   /* Uncomment the next line if you know exactly what Account and Region you
//    * want to deploy the stack to. */
//   // env: { account: '123456789012', region: 'us-east-1' },

//   /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
// });