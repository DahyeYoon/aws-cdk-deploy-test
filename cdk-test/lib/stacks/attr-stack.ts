import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';

export class AttrStack extends cdk.Stack {
  public readonly PythonModuleLayer: lambda.ILayerVersion;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // TODO: remove when aws-sdk is updated
 
    this.PythonModuleLayer = new lambda.LayerVersion(this, 'PythonModuleLayer', {
      code: lambda.Code.fromAsset(path.resolve(
        __dirname, '..', 'layers', 'python-module-layer', 'layer_root.zip'
      )),
      compatibleRuntimes: [lambda.Runtime.PYTHON_3_7, lambda.Runtime.PYTHON_3_8,lambda.Runtime.PYTHON_3_9],
    });
 }
}
