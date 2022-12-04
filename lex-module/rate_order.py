"""
==========================================
Author: Purvesh Rathod
This file content the business logic to 
perform operations related to the rate 
order intent. 
==========================================
"""
import logging
from dynamo_db_operations import Dynamo
from common_validation import CommonValidation

logger = logging.getLogger()
logger.setLevel(logging.INFO)


class RateOrder:
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
            if not response.get("is_valid"):
                return response
            else:
                input_email = response.get("email")

        if (
            not self.slots["OrderNumber"]
            and "order_no" not in self.event["sessionState"]["sessionAttributes"]
        ):
            logger.info("OrderNumber is empty. Ask OrderNumber value")
            return {
                "is_valid": False,
                "violatedSlot": "OrderNumber",
            }
        else:
            response = CommonValidation.order_validation(self.event, input_email)
            if response.get("is_valid"):
                input_order_no = response.get("order_no")
            else:
                return response

        if not self.slots["OrderRatings"]:
            logger.info("OrderRatings is empty. Ask OrderRatings value")
            return {
                "is_valid": False,
                "violatedSlot": "OrderRatings",
            }
        else:
            if (
                self.slots.get("OrderRatings", {})
                .get("value", {})
                .get("interpretedValue")
            ):
                input_ratings = (
                    self.slots.get("OrderRatings", {})
                    .get("value", {})
                    .get("interpretedValue")
                )
                if 1 <= int(input_ratings) <= 5:
                    print(f"Updated ratings of {input_order_no}")
                    self.update_order_rating(
                        "order_no", input_order_no, "rating", input_ratings
                    )
                else:
                    return {
                        "is_valid": False,
                        "violatedSlot": "OrderRatings",
                        "message": "Please make sure that you rate the order between 1-5",
                    }

        return {
            "is_valid": True,
            "sessionAttributes": {"email": input_email},
        }

    def update_order_rating(self, p_key, p_value, update_key, update_value):
        return Dynamo("orders").update_item(p_key, p_value, update_key, update_value)
