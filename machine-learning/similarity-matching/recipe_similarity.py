from google.cloud import storage
import base64
import json
import os
from scipy import spatial
import numpy as np

FILE_PATH = "matching_engine/initial/data_embedding.json"
BUCKET_NAME = "recipe_similarity"
similarity_score = []
result = {}

def cosineSimilarity(data1, data2):
    return 1 - spatial.distance.cosine(data1, data2)

def getEmbeddings(request):

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

    # Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Origin': '*'
    }

    # END CORS


    content_type = request.headers['Content-Type']
    if content_type == 'application/json':
        request_json = request.get_json(silent=True)
        if request_json and 'recipe_id' in request_json:
            recipe_id = str(request_json['recipe_id'])
            neighbour_count = request_json["neighbours"]
        else:
            raise ValueError("JSON is invalid, or missing a 'recipe_id' property")

    client = storage.Client()
    bucket = client.get_bucket(BUCKET_NAME)
    file_blob = bucket.blob(FILE_PATH)

    download_data = file_blob.download_as_string().decode()
    jsondata = json.loads(download_data)

    for key in jsondata.keys():
        if key != recipe_id:
            similarity_score.append(cosineSimilarity(jsondata[recipe_id]["embedding"], jsondata[key]["embedding"]))

    top_ten_index = np.argsort(similarity_score)[::-1][:neighbour_count]

    for id, index in enumerate(top_ten_index):
        temp_data = jsondata[str(index)]
        result[id] = {"id": str(index), "name":temp_data["name"], "recipe":temp_data["recipe"], "similarity": str(similarity_score[index])}
    
    
    return  (json.dumps(result), 200, {
        'Access-Control-Allow-Origin': '*'
    })