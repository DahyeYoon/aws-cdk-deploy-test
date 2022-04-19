# AWS CDK App Deploy Practice
This repository contains practices of creating stacks, handling Lambda functions in various ways, and using DynamoDB.

#### Functions practiced
- Multi-stacks
- Lambda Function
    - Handler written in Python/ TypeScript
    - Lambda Layer
- Step Functions
- LambdaRestApi
- DynamoDB exmaples

## Table of Contents
1. [Getting started](#id-section1)
2. [Project files in a nutshell](#id-section2)
2. [Building own your project](#id-section3)

## Getting started<div id='id-section1'/>
<!-- > CDK version 1 is used. -->
1. Install node packages
    ``` shell
    $ npm install
    ```
2. Create the CDK stack
    ``` shell
    $ npx cdk deploy {stack_name} --profile {account_alias}
    ```

3. Cleanup
    ``` shell
    $ npx cdk destroy {stack_name} --profile {account_alias}
    ```


## Project files in a nutshell <div id='id-section2'/>
```
    └── cdk-test/                        
        ├── bin/ cdk-test.ts --> calling stacks              
        └── lib/      
            ├── layers/python-module-layer --> the package of libraries and other dependencies to be used in Lambda              
            ├── Props/config.ts --> configuration, such as an account ID, region, etc.
            ├── src/
            │   ├── ddb_s3/ ddb_test.py --> examples of using DynamoDB (create a table, put an item, etc.)
            │   ├── engineC/
            │   │   ├── close.py --> the 3rd state of Step Functions (a Lambda handler written in Python) 
            │   │   ├── close.ts --> the 3rd state of Step Functions (a Lambda handler written in TypeScript) 
            │   │   ├── engineC-Lambda.ts --> Lambda creation
            │   │   ├── engineC-sfn.ts --> Step Functions that combine Lambda functions
            │   │   ├── init.py --> the 1st state of Step Functions (a Lambda handler written in Python) 
            │   │   ├── init.ts --> the 1st state of Step Functions (a Lambda handler written in TypeScript) 
            │   │   ├── run.py --> the 2nd state of Step Functions (a Lambda handler written in Python) 
            │   │   └── sfn_start.py --> a Lambda handler that executes Step Functions
            │   ├── engineA_Lambda_function.py --> a basic Lambda handler
            │   ├── engineB_Lambda_function.py --> a Lambda handler to import external library and .py file 
            │   └── engineC_Lambda_function.py --> a basic Lambda handler
            │
            └── stacks/
                ├── attr-stack.ts --> stack that creates a Lambda layer
                ├── engineA-stack.ts --> stack that creates a Lambda function and LambdaRestApi
                ├── engineB-stack.ts --> stack that creates a Lambda function, LambdaRestApi, and Lambda layer
                └── engineC-stack.ts --> stack that creates a Lambda function, LambdaRestApi, Step Functions, and DynamoDB Table
```


---
## Building own your project <div id='id-section3'/>
1. Create an AWS account and then, get the key and password
2. Install AWS cli
    - For Ubuntu
        ``` shell
        $ apt-get install awscli
        ```
    - For MacOSX
        ``` shell
        $ brew install awscli
        ```
3. Set the AWS configure
    ``` shell
    $ aws configure --profile {account_alias}
    ```
4. Move to the project folder
5. Install Node.js
    - For Ubuntu
        ``` shell
        $ apt-get install nodejs
        ```
    - For MacOSX
        ``` shell
        $ brew install node
        ```
6. Create package.json to initialize the node program
    ``` shell
    $ npm init
    ```
7. Install aws-cdk
    ``` shell
    $ npm install aws-cdk -D
    ```
8. Check CDK version
    ``` shell
    $ npx cdk --version
    ```
9. Create a CDK project that uses TypeScript (it should be run into an empty folder)
    ``` shell
    $ npx cdk init --language typescript
    ```
10. Install libraries to use Lambda
    ``` shell
    $ npm install @aws-ckd/aws-Lambda @aws-cdk/core
    ```
11. Compile
    ``` shell
    $ npm run build
    ```
12. Install bootstrap stack (to deploy AWS CDK APP)
    ``` shell
    $ npx cdk bootstrap --profile {account_alias}
    ```
13. Deploy CDK App
    ``` shell
    $ npx cdk deploy {stack_name} --profile {account_alias}
    ```
---