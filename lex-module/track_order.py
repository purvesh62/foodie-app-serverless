"""
==========================================
Author: Purvesh Rathod
This file content the business logic to 
perform operations related to the track 
order intent. 
==========================================
"""
import logging
from common_validation import CommonValidation

logger = logging.getLogger()
logger.setLevel(logging.INFO)


class TrackOrder:
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
                order_status = response.get("status")
                print(f"Order status: {order_status}")
            else:
                return response

        return {
            "is_valid": True,
            "sessionAttributes": {"email": input_email},
            "message": f"Your order is {order_status}",
        }
