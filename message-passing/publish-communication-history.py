import json
import functions_framework
from google.api_core.exceptions import NotFound
from google.cloud.pubsub import PublisherClient


@functions_framework.http
def publish_customer_complaint(request):
    """HTTP Cloud Function.
    Args:
        request (flask.Request): The request object.
        <https://flask.palletsprojects.com/en/1.1.x/api/#incoming-request-data>
    Returns:
        The response text, or any set of values that can be turned into a
        Response object using `make_response`
        <https://flask.palletsprojects.com/en/1.1.x/api/#flask.make_response>.
    """
    # Set CORS headers for the preflight request
    if request.method == "OPTIONS":
        # Allows GET requests from any origin with the Content-Type
        # header and caches preflight response for an 3600s
        headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Max-Age": "3600",
        }
        return ("", 204, headers)

    headers = {"Content-Type": "application/json", "Accept": "text/plain"}

    # Allows GET requests from any origin with the Content-Type
    # header and caches preflight response for an 3600s
    # headers = {
    #     'Access-Control-Allow-Methods': '*',
    #     'Access-Control-Allow-Headers': 'Content-Type'
    # }
    print(request.method)
    request_json = request.get_json(silent=True)
    # request.headers.set('Access-Control-Allow-Origin', '*')
    # request.headers.set('Access-Control-Allow-Methods', 'POST')
    print("Incoming request_json: ", request_json)
    response = publish(request_json)
    return (response, 200, {"Access-Control-Allow-Origin": "*"})


def publish(request_json):
    project_id = "csci5410-project-370006"
    topic_id = "communication_history"
    publisher_client = PublisherClient()
    topic_path = publisher_client.topic_path(project_id, topic_id)
    try:
        # Get the topic encoding type.
        data_str = json.dumps(request_json)
        print(f"Preparing a JSON-encoded message:\n{data_str}")
        data = data_str.encode("utf-8")
        future = publisher_client.publish(topic_path, data)
        print(f"Published message ID: {future.result()}")
    except NotFound:
        print(f"{topic_id} not found.")
        return {"message": f"Topic ID {topic_path} not found.", "status": 404}

    print(f"Published messages with custom attributes to {topic_path}.")
    return {"message": f"Message published to the {topic_path}", "status": 200}
