import json
import boto3

REGION = "us-east-1"

def lambda_handler(event, context):
    body = json.loads(event['body'])
    s3 = boto3.client("s3", region_name="us-east-1")
    bucket = "serverlessresturantsbucket"
    data = ""
    response = []
    
    
    s3 = boto3.client('s3')
    
    result = s3.list_objects(Bucket = bucket, Prefix=body["resturantId"]+"/recepies/"+body["fileId"]+".txt")
    
        
    data = s3.get_object(Bucket=bucket, Key=result.get('Contents')[0].get('Key'))
    contents = data['Body'].read()
    comprehend = boto3.client('comprehend', region_name=REGION)
    entities = comprehend.detect_entities(Text=contents.decode("utf-8"), LanguageCode="en")
    
    for entity in entities["Entities"]:
        response.append(entity["Text"])
        
    return {
            'statusCode': 200,
            'body': response
        }
