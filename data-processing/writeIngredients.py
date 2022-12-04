import json
import boto3

ingredients = []

def dynamo_list(element):
    return {"S":element}

def lambda_handler(event, context):
    body = json.loads(event['body'])
    
    data = map(dynamo_list, body["ingredients"])
    
    try:
        dynamodb = boto3.client('dynamodb')   
        dynamodb.put_item(TableName='Recipes', Item={'RecipeId':{"S":body["recipe_id"]},'Ingredients':{"L":list(data)}})
        
       
        return {
            'statusCode': 200,
            'body': "Recipe Ingredients Added!"
        }
    except ValueError:
        return {
            'statusCode': 403,
            'body': "Error in reading the request parameters"
        }