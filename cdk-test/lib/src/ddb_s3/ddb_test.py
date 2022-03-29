import boto3
from boto3.dynamodb.conditions import Key, Attr

# Get the service resource.
AWS_ACCESS_KEY = ""
AWS_SECRET_ACCESS_KEY = ""
AWS_REGION = ""


dynamodb = boto3.resource('dynamodb',aws_access_key_id=AWS_ACCESS_KEY,
                          aws_secret_access_key=AWS_SECRET_ACCESS_KEY,region_name=AWS_REGION)


def CreateTable(table_name):

    schema = {
        'TableName': table_name,
        'KeySchema': [
            {
                'AttributeName': 'name',
                'KeyType': 'HASH'  # Partition key 
            },
            {
                'AttributeName': 'title',
                'KeyType': 'RANGE'  # Sort Key
            },
        ],
        'AttributeDefinitions': [
            {
                'AttributeName': 'name',
                'AttributeType': 'S'
            },
            {
                'AttributeName': 'title',
                'AttributeType': 'S'
            }
        ],

        'ProvisionedThroughput': {
            'ReadCapacityUnits': 10,
            'WriteCapacityUnits': 10
        }
    }
    table=dynamodb.create_table(**schema)
    print(table)

    return table

def InsertItem(item):
    return table.put_item(Item=item)
if __name__ == '__main__':

    query_mode='putD' #createT, delT, putD, scanD, searchD, delD, updateD
    table_name='TestTable'
    data = {
        'year': "123",
        'title': "aitle",
        'info': {
            'plot': "plot",
            'rating': "rating"
        },
        'info2':['a','b']
    }
    item = {'name': 'name1112', 'title':data['title'], 'info':data['info'],'info2':data['info2']}
    # ---load table----
    table = dynamodb.Table(table_name)
    if query_mode=='createT':
        # ---create table----
        table=CreateTable(table_name)
        print('Create table:', table_name)

    elif query_mode=='scanD':
        # ---table scan----
        resp = table.scan()
        print('Scan data')


    elif query_mode=='putD':
        # --- Insert Item----
        resp2 = InsertItem(item)
        print('Insert data')

    elif query_mode=='searchD':
        # ---Search Item ----
        # 1) 
        response1 = table.get_item(
            Key={
                'name':'name1112',
                'title': data['title']
            }
        )
        print(response1["Item"]) 

        # 2) 
        response2 = table.query(
            KeyConditionExpression=Key('name').eq("name11123")
            
        )
        print(response2["Items"])
        # 3) 
        response3 = table.scan(
            FilterExpression=Attr('title').begins_with('a') & Key('name').eq("name1112")
        )
        print(response3["Items"])
        #4) 
        response4 =table.scan(AttributesToGet=['name','title'])
        print(response4['Items'])
    elif query_mode == 'updateD':
        table.update_item(
            Key={
                'name': 'name1112',
                'title': data['title']
            },

            UpdateExpression='SET age = :val1',
            ExpressionAttributeValues={
                ':val1': 26
            }
        )
        print('Update data')

    elif query_mode == 'delD':
        # --- Delete Item
        resp3 = table.delete_item(
            Key={
                'name': 'name1112',
                'title': data['title']
            }
        )
        print('Delete data')

    elif query_mode=='delT':
        # ---delete table----
        table.delete()
        print('delete '+table_name+' table')
