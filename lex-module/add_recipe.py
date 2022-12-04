import json
import boto3
import logging
import requests
from common_validation import CommonValidation
from dynamo_db_operations import Dynamo

logger = logging.getLogger()
logger.setLevel(logging.INFO)


class AddRecipe:
    def __init__(self, event) -> None:
        self.event = event
        self.intent = event["sessionState"]["intent"]["name"]
        self.slots = self.event["sessionState"]["intent"]["slots"]

    def validate_slots(self):
        print("Validating AddRecipe slots")
        input_email = ""

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

        if not self.slots["RecipeName"]:
            logger.info("RecipeName is empty. Ask RecipeName value")
            return {
                "is_valid": False,
                "violatedSlot": "RecipeName",
            }
        else:
            if not (
                self.slots.get("RecipeName", {})
                .get("value", {})
                .get("interpretedValue")
            ):
                return {
                    "is_valid": False,
                    "violatedSlot": "RecipeName",
                    "message": "Please make sure that you provide correct recipe name.",
                }
            else:
                input_recipe = (
                    self.slots.get("RecipeName", {})
                    .get("value", {})
                    .get("interpretedValue")
                )

        if not self.slots["RecipePrice"]:
            logger.info("RecipePrice is empty. Ask RecipePrice value")
            return {
                "is_valid": False,
                "violatedSlot": "RecipePrice",
            }
        else:
            if (
                self.slots.get("RecipePrice", {})
                .get("value", {})
                .get("interpretedValue")
            ):
                input_price = (
                    self.slots.get("RecipePrice", {})
                    .get("value", {})
                    .get("interpretedValue")
                )
                if int(input_price) > 0:
                    print(f"Price: {input_price}")
                    self.add_order(input_recipe, input_price)
                else:
                    return {
                        "is_valid": False,
                        "violatedSlot": "RecipePrice",
                        "message": "Please make sure that price shouldn't be less than $1",
                    }
        return {
            "is_valid": True,
            "sessionAttributes": {"email": input_email},
        }

    def add_order(self, recipe, price):
        data = {"dish": recipe, "cost": price}
        return Dynamo("menu").insert_into_table(data)
