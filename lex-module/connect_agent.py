"""
==========================================
Author: Purvesh Rathod
This file content the business logic to 
connect the user with the customer service
representative
==========================================
"""
import logging
from common_validation import CommonValidation
from dynamo_db_operations import Dynamo
import requests
import threading

logger = logging.getLogger()
logger.setLevel(logging.INFO)


class ConnectAgent:
    def __init__(self, event) -> None:
        self.event = event
        self.intent = event["sessionState"]["intent"]["name"]
        self.slots = self.event["sessionState"]["intent"]["slots"]

    def api_caller(self, url, data):
        print(url)
        print(data)
        print("Calling API")
        requests.post(
            url,
            json=data,
            headers={
                "Content-Type": "application/json",
            },
        )

    def get_agent(self, input_email, input_order_no, input_complaint):
        obj = Dynamo("users")
        agents = obj.get_agent()
        print("Agents: ", agents)
        if agents.get("status"):
            pass
            # API call
            agent_email = agents["agents"][0]["email"]
            agent_name = agents["agents"][0]["name"]
            user_data = obj.get_user(input_email)

            data = {
                "agent_email": agent_email,
                "agent_name": agent_name,
                "user_email": input_email,
                "user_query": input_complaint,
                "order_no": input_order_no,
                "user_name": user_data.get("name", "User"),
            }
            print("agent_data: ", data)
            try:
                # x = threading.Thread(target=self.api_caller, args=("https://publish-customer-complaint-7vfph4kzpa-uc.a.run.app", data))
                # print("Main    : before running thread")
                # x.start()
                # print("Main    : wait for the thread to finish")
                cloud_fn_response = requests.post(
                    "https://publish-customer-complaint-7vfph4kzpa-uc.a.run.app",
                    json=data,
                    headers={
                        "Content-Type": "application/json",
                    },
                    timeout=20,
                )
            except Exception as e:
                print(e)

            print(
                "Return agent_data: ",
                {"is_valid": True, "sessionAttributes": {"email": input_email}},
            )

            return {"is_valid": True, "sessionAttributes": {"email": input_email}}
        else:
            # No data available
            return {
                "is_valid": True,
                "sessionAttributes": {"email": input_email},
                "message": "Sorry, due to some error we are unable to connect you with the agent. You can reach out to purvesh.r@dal.ca for support.",
            }

    def validate_slots(self):
        input_email, input_order_no, input_complaint = "", "", ""

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
                if response.get("db_response").get("type") == "user":
                    input_email = response.get("email")
                else:
                    return {
                        "is_valid": False,
                        "violatedSlot": "CustomerEmail",
                        "message": "The email provided email is incorrect.",
                    }

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

        if not self.slots["CustomerComplaint"]:
            logger.info("CustomerComplaint is empty. Ask CustomerComplaint value")
            return {
                "is_valid": False,
                "violatedSlot": "CustomerComplaint",
            }
        input_complaint = (
            self.slots["CustomerComplaint"].get("value", {}).get("interpretedValue")
        )

        agent_response = self.get_agent(input_email, input_order_no, input_complaint)
        print("Agent response: ", agent_response)

        return agent_response
