import logging
import boto3
from rate_order import RateOrder
from track_order import TrackOrder
from connect_agent import ConnectAgent
from upload_recipe import UploadRecipe
from add_recipe import AddRecipe

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def process_intent(event):
    validation_result = {}
    slots = event["sessionState"]["intent"]["slots"]
    intent = event["sessionState"]["intent"]["name"]

    if intent == "Fn_RateOrder":
        validation_result = RateOrder(event).validate_slots()
    elif intent == "Fn_TrackOrder":
        validation_result = TrackOrder(event).validate_slots()
    elif intent == "Fn_ConnectCustomerService":
        validation_result = ConnectAgent(event).validate_slots()
    elif intent == "Fn_UploadRecipe":
        validation_result = UploadRecipe(event).validate_slots()
    elif intent == "Fn_AddMenuItem":
        validation_result = AddRecipe(event).validate_slots()
    print(f"Intent validation: {intent}")
    print(f"Validation result: {validation_result}")
    

    if event["invocationSource"] == "DialogCodeHook":
        # Respond back to Lex
        if not validation_result["is_valid"]:
            if "message" in validation_result:
                response = {
                    "sessionState": {
                        "dialogAction": {
                            "slotToElicit": validation_result["violatedSlot"],
                            "type": "ElicitSlot",
                        },
                        "intent": {"name": intent, "slots": slots},
                    },
                    "messages": [
                        {
                            "contentType": "PlainText",
                            "content": validation_result["message"],
                        }
                    ],
                }
            else:
                response = {
                    "sessionState": {
                        "dialogAction": {
                            "slotToElicit": validation_result["violatedSlot"],
                            "type": "ElicitSlot",
                        },
                        "intent": {"name": intent, "slots": slots},
                    }
                }
            return response
        else:
            response = {
                "sessionState": {
                    "dialogAction": {"type": "Close"},
                    "intent": {
                        "name": intent,
                        "slots": slots,
                        "state": "Fulfilled",
                    },
                }
            }
            
            if "sessionAttributes" in validation_result:
                response["sessionState"]["sessionAttributes"] = validation_result["sessionAttributes"]
                
            if "message" in validation_result:
                response['messages'] = [
                    {"contentType": "PlainText", "content": validation_result["message"]}
                ]
            return response


def lambda_handler(event, context):
    print("Intent: ", event["sessionState"]["intent"]["name"])
    print("Event: ", event)

    if event["sessionState"]["intent"]["name"].startswith("Fn_"):
        return process_intent(event)

    return
