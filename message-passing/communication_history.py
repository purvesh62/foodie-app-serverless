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
    message = (
        json.loads(pubsub_message)
        if isinstance(pubsub_message, str)
        else pubsub_message
    )
    store_chat_history(message)
    return {"status": 200, "message": "Document created"}


def get_chat_history(message):

    return chat_module_ref.document(message.get("email")).get().to_dict()


def store_chat_history(message):
    print("Email: ", message.get("email"))
    # Get chat history
    chat_module_history = chat_module_ref.document(message.get("email")).get().to_dict()
    print("Chat history: ", chat_module_history)

    # Get collection for storing chat history
    user_chat_history_ref = db.collection(message.get("email"))
    # chat_history = get_chat_history(message.get("email"))

    user_chat_history_ref.document().set({"chat": chat_module_history["chatHistory"]})

    # Delete document from ChatModule
    chat_module_ref.document(message.get("email")).delete()
    print("Saved chat history")
    return {}
