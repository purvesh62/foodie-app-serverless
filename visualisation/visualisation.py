from google.cloud import firestore
import math
import pandas as pd
from google.cloud import storage
import firebase_admin
from datetime import datetime
from firebase_admin import firestore
from firebase_admin import credentials


cred = credentials.Certificate("chatmodule-feabd-49080a9eed55.json")
app = firebase_admin.initialize_app(cred)
db = firestore.client()
chat_module_ref = db.collection("secondFactor")


def visualizeData():
    # client = firestore.Client("chatmodule-feabd")
    client1 = chat_module_ref.get()
    print(client1)
    list_login_user = []
    for i in range(len(client1)):
        dict_login = client1[i].to_dict()
        list_login_user.append(dict_login)
    print(list_login_user)
    if len(list_login_user) > 1:
        x = pd.DataFrame(list_login_user)
        print(x)
        clientstorage = storage.Client()
        exportbucket = clientstorage.get_bucket("visualbucket1")
        exportbucket.blob("visual_data.csv").upload_from_string(x.to_csv(), "text/csv")
        return "success"
    else:
        return "Error"


def hello_world(request):
    """Responds to any HTTP request.
    Args:
        request (flask.Request): HTTP request object.
    Returns:
        The response text or any set of values that can be turned into a
        Response object using
        `make_response <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>`.
    """
    headers = {"Access-Control-Allow-Origin": "*"}
    val = visualizeData()
    return (val, 200, headers)
    request_json = request.get_json()
    if request.args and "message" in request.args:
        x = request.args.get("message")
        print(x)

    elif request_json and "message" in request_json:
        return request_json["message"]
    else:
        return f"Hello World!"
