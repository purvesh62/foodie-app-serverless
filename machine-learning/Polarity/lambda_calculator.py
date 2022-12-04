import json
import boto3

def lambda_handler(event, context):
    body = json.loads(event['body'])
    client = boto3.client('comprehend')
    response = client.batch_detect_sentiment(TextList=body["data"], LanguageCode='en')
    
    return {
        "statusCode":200,
        "body": response,
        "headers": {'Content-Type': 'application/json'}
    }
