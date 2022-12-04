const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const axios=require('axios')
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event,context,callback) => {
    // TODO implement
    console.log("Processing...",event);
    console.log(event.queryStringParameters.message2);
    var number=Number(event.queryStringParameters.message2);
    console.log(number);
     const user=await axios.post("https://ak2nvhm6hpyyzkj3dcdxd6hgxa0hztxc.lambda-url.us-east-1.on.aws/",
    {
  "table_name": "users",
  "type": "insert",
  "data": {
    "email": event.queryStringParameters.email,
    "name": event.queryStringParameters.message,
    "is_active": false,
    "is_available":true,
    "type": "restaurant"
    }
});
console.log(user);
    const params = {
        Item: {
            'RestaurantPhone': number,
            'RestaurantName': event.queryStringParameters.message,
            'RestaurantAddress': event.queryStringParameters.message3
        },
        TableName: "restaurant"
    };
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    
    await docClient.put(params, function(err, data) {
        if(err){
            console.log("inside put error",err);
            
            callback(err, null);
        } else {
            console.log("inside put",data);
            callback(null, data);
        }
    })
    
    return response;
};