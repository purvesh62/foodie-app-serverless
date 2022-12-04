from google.cloud import storage
import base64
import json
import os
from scipy import spatial
import numpy as np

FILE_PATH = "matching_engine/initial/data_embedding.json"
BUCKET_NAME = "recipe_similarity"

result = {}

def getRecipes(request):

    headers= {
        'Access-Control-Allow-Origin': '*'
    }

    client = storage.Client()
    bucket = client.get_bucket(BUCKET_NAME)
    file_blob = bucket.blob(FILE_PATH)

    download_data = file_blob.download_as_string().decode()
    jsondata = json.loads(download_data)

    for id, index in enumerate([5,10,15,25,35]):
        temp_data = jsondata[str(index)]
        result[id] = {"id": str(index), "name":temp_data["name"], "recipe":temp_data["recipe"]}
    
    return (result, 200, headers)