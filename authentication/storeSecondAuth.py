import json
import base64
import firebase_admin
from datetime import datetime
from firebase_admin import firestore
from firebase_admin import credentials


cred = credentials.Certificate("chatmodule-feabd-49080a9eed55.json")
app = firebase_admin.initialize_app(cred)
db = firestore.client()
second_factor_ref = db.collection("secondFactor")


def hello_world(request):
    """Responds to any HTTP request.
    Args:
        request (flask.Request): HTTP request object.
    Returns:
        The response text or any set of values that can be turned into a
        Response object using
        `make_response <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>`.
    """
    if request.method == "OPTIONS":
        # Allows GET requests from any origin with the Content-Type
        # header and caches preflight response for an 3600s
        headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Max-Age": "3600",
        }
        return ("", 204, headers)

    request_json = request.get_json(silent=True)
    headers = {"Content-Type": "application/json", "Accept": "text/plain"}

    print("request_json", request_json)

    return (create_collection(request_json), 200, {"Access-Control-Allow-Origin": "*"})


def create_collection(request_json):
    print(f"Creating document in FireStore")
    key1 = request_json.get("key1")
    key2 = request_json.get("key2")
    timestamp = datetime.timestamp(datetime.now())
    email = request_json.get("key3")

    doc = {
        "email": email,
        "Answer1": key1,
        "Answer2": key2,
        "question1": "Where is your Birthplace?",
        "question2": "What is your favourite dish?",
        "timestamp": timestamp,
    }
    print("Document: ", doc)

    res = second_factor_ref.document().set(doc)
    print("Firebase response: ", res)

    return {"status": 200, "message": "Document created", "data": doc}
