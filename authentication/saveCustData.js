const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const docClient = new AWS.DynamoDB.DocumentClient();
const axios=require('axios')

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
    "type": "user"
    }
});
console.log(user);
    const params = {
        Item: {
            CustomerPhone: number,
            CustomerName: event.queryStringParameters.message
        },
        TableName: "customer"
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
    }).promise();
    return response;
};
// const AWS = require('aws-sdk');
// AWS.config.update({region: 'us-east-1'});
// const docClient = new AWS.DynamoDB.DocumentClient();


// exports.handler = (event, context, callback) => {
//     console.log("Processing...",event);
//     const params = {
//         Item: {
//             CustomerPhone: event.key1,
//             CustomerName: event.key2
//         },
//         TableName: "customer"
//     };
//     const response = {
//     statusCode: 200,

//     body: JSON.stringify(event.querryStringParameters),
//   };
    
//     docClient.put(params, function(err, data) {
//         if(err){
//             console.log("inside put error",err);
            
//             callback(err, null);
//         } else {
//             console.log("inside put",data);
//             callback(null, data);
//         }
//     })
    
//     console.log(event+"he")
// };
