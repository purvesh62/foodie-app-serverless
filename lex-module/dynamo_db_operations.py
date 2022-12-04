import boto3
import uuid
from botocore.exceptions import ClientError

dynamodb = boto3.resource("dynamodb")

client = boto3.client("dynamodb")


class Dynamo:
    def __init__(self, table_name):
        self.table_name = table_name
        self.table = self.check_table_exists()

    def check_table_exists(self):
        """sumary_line

        Keyword arguments:
        argument -- description
        Return: return_description
        """
        try:
            client = boto3.client("dynamodb")
            client.describe_table(TableName=self.table_name)
        except ClientError as exception:
            if exception.response["Error"]["Code"] == "ResourceNotFoundException":
                print(f"{self.table_name} does not exists.")
                return None
            print(f"Exception occurred. {exception}")
        print(f"{self.table_name} exists.")
        return dynamodb.Table(self.table_name)

    def get_all_data(self):
        """sumary_line

        Keyword arguments:
        argument -- description
        Return: return_description
        """
        try:
            if self.table:
                body = self.table.scan()
                return body["Items"]
            else:
                print("Table does not exists.")
        except Exception as exception:
            return []

    def get_item(self, key, value):
        """sumary_line

        Keyword arguments:
        argument -- description
        Return: return_description
        """
        try:
            if self.table:
                response = self.table.get_item(Key={key: value})
                print(response)
                if "Item" in response:
                    return response["Item"]
                else:
                    return {}
        except Exception as exception:
            print(exception)
            raise exception

    def insert_into_table(self, event):
        """sumary_line

        Keyword arguments:
        argument -- description
        Return: return_description
        """
        try:
            if self.table:
                # del event["table_name"]
                response = self.table.put_item(
                    Item={
                        "id": str(uuid.uuid4()),
                        **event
                        # 'first_name': event.get('first_name'),
                        # 'last_name': event.get('last_name'),
                        # 'email': event.get('email')
                    }
                )
                return response
            else:
                print("Table does not exists.")
        except Exception as exception:
            print(exception)
        return False

    def update_item(self, primary_key, primary_key_value, update_key, update_key_value):
        response = self.table.update_item(
            Key={primary_key: primary_key_value},
            UpdateExpression=f"set {update_key}=:g",
            ExpressionAttributeValues={":g": update_key_value},
            ReturnValues="UPDATED_NEW",
        )
        return response

    """ 
    """

    def get_order(self, order_no):
        response = self.get_item("order_no", order_no)
        return response

    def get_user(self, email):
        response = self.get_item("email", email)
        return response

    def get_agent(self):
        users = self.get_all_data()
        print(users)
        if users:
            agents = []
            available = False
            for user in users:
                if user.get('type') == "restaurant" and user.get('is_available') == True:
                    agents.append(user)
                    available = True
            
            if available:
                return {'status': True, 'agents': agents, 'available': available}
            
            return {'status': True, 'available': False, 'agents': agents}
        
        return {
            'status': False,
            'available': False,
            'agents': []
        }