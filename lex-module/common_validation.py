from dynamo_db_operations import Dynamo


class CommonValidation:
    @staticmethod
    def email_validation(event):
        input_email = ""
        # Validate the provided email
        if event.get("sessionState", {}).get("sessionAttributes", {}).get(
            "email", None
        ) or event["sessionState"]["intent"]["slots"].get("CustomerEmail", {}).get(
            "value", {}
        ).get(
            "interpretedValue"
        ):
            input_email = (
                event.get("sessionState", {}).get("sessionAttributes", {}).get("email")
                if event.get("sessionState", {})
                .get("sessionAttributes", {})
                .get("email", None)
                else event["sessionState"]["intent"]["slots"]
                .get("CustomerEmail", {})
                .get("value", {})
                .get("interpretedValue")
            )
            response = Dynamo("users").get_user(input_email)
            print("User DB response: ", response)
            if not response:
                return {
                    "is_valid": False,
                    "violatedSlot": "CustomerEmail",
                    "message": "Please make sure that email is correct.",
                }
            elif response.get("is_active") != True:
                return {
                    "is_valid": False,
                    "violatedSlot": "CustomerEmail",
                    "message": "Please make sure that you've logged-in.",
                }

        return {"is_valid": True, "email": input_email, "db_response": response}

    @staticmethod
    def order_validation(event, input_email):
        if event.get("sessionState", {}).get("sessionAttributes", {}).get(
            "order_no", None
        ) or event["sessionState"]["intent"]["slots"].get("OrderNumber", {}).get(
            "value", {}
        ).get(
            "interpretedValue"
        ):
            input_order_no = (
                event.get("sessionState").get("sessionAttributes").get("order_no")
                if event.get("sessionState").get("sessionAttributes").get("order_no")
                else event["sessionState"]["intent"]["slots"]
                .get("OrderNumber", {})
                .get("value", {})
                .get("interpretedValue")
            )

            response = Dynamo("orders").get_order(input_order_no)
            print("Order DB response: ", response)
            print("User email: ", input_email)
            if not response or response.get("email", "") != input_email:
                return {
                    "is_valid": False,
                    "violatedSlot": "OrderNumber",
                    "message": "Please make sure that the order number is correct.",
                }

        return {
            "is_valid": True,
            "order_no": input_order_no,
            "status": response.get("status"),
        }
