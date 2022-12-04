import json
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import requests
from google.cloud import storage
import csv
import os


result = []
final_result = []

cred = credentials.ApplicationDefault()
firebase_admin.initialize_app(cred)

url="https://jr6lllewpnm5stanzq42fipyxi0zplsl.lambda-url.us-east-1.on.aws/"

def polarity_check(request):

    # Set CORS headers for the preflight request
    if request.method == 'OPTIONS':
        # Allows GET requests from any origin with the Content-Type
        # header and caches preflight response for an 3600s
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Max-Age': '3600'
        }

        return ('', 204, headers)

    content_type = request.headers['Content-Type']
    if content_type == 'application/json':
        request_json = request.get_json(silent=True)
        if request_json and 'resturant_id' in request_json:
            resturant_id = str(request_json['resturant_id'])
        else:
            raise ValueErrorr("JSON is invalid, or missing a 'resturant_id' property")
    
    db = firestore.client()

    docs = db.collection(u'ResturantData').where(u'resturentID', u'==',resturant_id).stream()

    for doc in docs:
        result.append(doc.to_dict())

    headers = {'Content-Type': 'application/json', 'Accept': 'text/plain'}

    response = requests.post(url, data=json.dumps({"data": result[0]["Feedbacks"]}), headers=headers).json()
    
    for index, data in enumerate(response["ResultList"]):
        temp = {}
        temp["id"] = index
        temp["Sentiment"] = data["Sentiment"]
        temp["Neutral"]=data["SentimentScore"]["Neutral"]
        temp["Negative"]=data["SentimentScore"]["Negative"]
        temp["Positive"]=data["SentimentScore"]["Positive"]

        final_result.append(temp)
        
    storage_client = storage.Client()
    bucket = storage_client.get_bucket("polaritybucket")
    blob = bucket.blob("data/data.csv")

    with blob.open('w') as csvfile:
        writer=csv.DictWriter(csvfile,fieldnames=["id","Sentiment","Neutral", "Negative", "Positive"])
        writer.writeheader()
        for d in final_result:
            writer.writerow(d)

    return (blob.public_url, 200, {"Access-Control-Allow-Origin":"*"})

