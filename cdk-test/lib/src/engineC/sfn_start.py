import boto3
import os
import json


stepfunction = boto3.client('stepfunctions')
stateMachineArn = os.environ['STATE_MACHINE_ARN']

def lambda_handler(event, context):
    print("event:",event)

    body = event["body"]

    print(body)
    response=stepfunction.start_execution(
        stateMachineArn=stateMachineArn,
        input=body)
    print("response:", response)


    return {
        'statusCode': 200, 
        'body': "hello,sfn-start"
    }