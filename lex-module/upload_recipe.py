"""
==========================================
Author: Purvesh Rathod
This file content the business logic to 
perform operations related to the upload 
a recipe intent.
==========================================
"""
import json
import boto3
import logging
import requests
from common_validation import CommonValidation


logger = logging.getLogger()
logger.setLevel(logging.INFO)


class UploadRecipe:
    def __init__(self, event) -> None:
        self.event = event
        self.intent = event["sessionState"]["intent"]["name"]
        self.slots = self.event["sessionState"]["intent"]["slots"]

    def validate_slots(self):
        input_email, input_order_no = "", ""

        if (
            self.slots["CustomerEmail"] is None
            and "email" not in self.event["sessionState"]["sessionAttributes"]
        ):
            logger.info("CustomerEmail is empty. Ask CustomerEmail value")
            return {
                "is_valid": False,
                "violatedSlot": "CustomerEmail",
            }
        else:
            response = CommonValidation.email_validation(self.event)
            if response.get("is_valid"):
                if response.get("db_response").get("type") in ["admin", "restaurant"]:
                    input_email = response.get("email")
                else:
                    return {
                        "is_valid": False,
                        "violatedSlot": "CustomerEmail",
                        "message": "The given email address is incorrect. Make sure that it is a registered restaurant owner email address.",
                    }
            else:
                return response

        if not self.slots["RecipeAttachment"]:
            logger.info("RecipeAttachment is empty. Ask RecipeAttachment value")
            return {
                "is_valid": False,
                "violatedSlot": "RecipeAttachment",
            }
        else:
            if (
                self.slots.get("RecipeAttachment", {})
                .get("value", {})
                .get("interpretedValue")
                == "kommunicateMediaEvent"
            ):
                attachmentAttribute = self.event.get("requestAttributes")
                if (
                    json.loads(attachmentAttribute["attachments"])[0]["type"]
                    == "text/plain"
                ):
                    self.upload_file_to_s3(attachmentAttribute)
                else:
                    return {
                        "is_valid": False,
                        "violatedSlot": "RecipeAttachment",
                        "message": "Please make sure that you're uploading txt file.",
                    }

        return {
            "is_valid": True,
            "sessionAttributes": {"email": input_email},
        }

    def upload_file_to_s3(self, attachmentAttribute):
        bucket_name = "halifaxfoodie"
        file_data = json.loads(attachmentAttribute["attachments"])[0]
        url = file_data["payload"]["url"]
        key = url.split("/")[-1]

        s3_object = boto3.resource("s3").Object(bucket_name, key)

        with requests.get(url, stream=True) as r:
            s3_object.put(Body=r.content)
