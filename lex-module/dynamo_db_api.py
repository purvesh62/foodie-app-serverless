import json
from dynamo_db_operations import Dynamo


def lambda_handler(event, context):
    """
    This function interacts with DynamoDB and based on the incoming request
    it performs the respective operation.
    """

    print(event)
    request_data = json.loads(event.get("body"))
    print("Request data: ", request_data)
    if request_data:
        print("Request data: ", request_data)
        obj = Dynamo(request_data.get("table_name"))

        op_type = request_data.get("type")

        if op_type == "insert":
            return obj.insert_into_table(request_data.get("data"))
        elif op_type == "select":
            return obj.get_item(
                request_data.get("data").get("key"),
                request_data.get("data").get("value"),
            )
        elif op_type == "update":
            return obj.update_item(
                request_data.get("data").get("primary_key"),
                request_data.get("data").get("primary_key_value"),
                request_data.get("data").get("update_key"),
                request_data.get("data").get("update_key_value"),
            )
        elif op_type == "all":
            data = obj.get_all_data()
            print(data)
            return data
        else:
            pass
