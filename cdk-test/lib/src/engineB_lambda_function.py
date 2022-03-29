# import numpy as np
import json
# from module.func import run


def lambda_handler(event, context):
    # print(np.__version__)
    # output=run("input_data")
    return {
        'statusCode': 200, 
        'body': "layer test"
    }