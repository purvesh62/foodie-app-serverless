import json
import boto3
import time

def lambda_handler(event, context):
    body = json.loads(event['body'])
    try:
        file_name = str(time.time()).replace(".","")
        lambda_path = "/tmp/data.txt"
        s3_path = body["resturantId"]+"/recepies/"+ file_name +".txt"
        
        with open(lambda_path, 'w+') as file:
            file.write(body["data"])
            file.close()
        
        s3 = boto3.resource('s3')
        s3.meta.client.upload_file(lambda_path, 'serverlessresturantsbucket', s3_path)
        
        return {
            'statusCode': 200,
            'data-id': file_name,
            'body': json.dumps({"message":"The recepie is uploaded!","data-id":file_name})
        }
    except Exception:
        return {
            'statusCode': 400,
            'body': json.dumps({"message":"Please Try Again"})
        }

    
