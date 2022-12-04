"""
==========================================
Author: Purvesh Rathod
This file is triggered when a message is 
published in the "customer_complaints" 
pub/sub.
This function creates a document in the 
firebase for the user and agent where
their messages will be stored while the
session is active.
==========================================
"""
import json
import base64
import firebase_admin
from datetime import datetime
from firebase_admin import firestore
from firebase_admin import credentials


cred = credentials.Certificate("chatmodule-feabd-49080a9eed55.json")
app = firebase_admin.initialize_app(cred)
db = firestore.client()
chat_module_ref = db.collection("ChatModule")


def hello_pubsub(event, context):
    """Triggered from a message on a Cloud Pub/Sub topic.
    Args:
        event (dict): Event payload.
        context (google.cloud.functions.Context): Metadata for the event.
    """
    print("Incoming request_json: ", event)
    pubsub_message = base64.b64decode(event["data"]).decode("utf-8")
    print("PubSub message: ", pubsub_message)
    return create_collection(json.loads(pubsub_message))


def create_collection(request_json):
    print(f"Creating document in FireStore")
    user_email = request_json.get("user_email")
    user_query = request_json.get("user_query")
    timestamp = datetime.timestamp(datetime.now())
    agent_email = request_json.get("agent_email")
    user_name = request_json.get("user_name")
    agent_name = request_json.get("agent_name")

    order_no = request_json.get("order_no")
    doc = {
        "chatHistory": [
            {
                "message": user_query,
                "timestamp": timestamp,
                "type": "user",
            }
        ],
        "agent_email": agent_email,
        "user_name": user_name,
        "agent_name": agent_name,
        "query": user_query,
        "order": order_no,
    }
    print("Document: ", doc)

    res = chat_module_ref.document(user_email).set(doc)
    print("Firebase response: ", res)

    return {"status": 200, "message": "Document created", "data": doc}
