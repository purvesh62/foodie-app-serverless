'use strict';
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

var chars = "abcdefghijklmnopqrstuvwxyz";
function Encrypt(plaintext, key, pc) {
    var klen = undefined;
    if (key) {
    klen = key.length;
    }
    if (pc == "") pc = "_";
    while (plaintext.length % klen != 0) {
        plaintext += pc.charAt(0);
    } 
    var colLength = plaintext.length / klen;
    var ciphertext = "";
    var k = 0;
    var i,j,t,arrkw;
    for (i = 0; i < klen; i++) {
        while (k < 26) {
            t = key.indexOf(chars.charAt(k));
            arrkw = key.split("");
            arrkw[t] = "_";
            key = arrkw.join("");
            if (t >= 0) break;
            else k++;
        }
        for (j = 0; j < colLength; j++) {
            ciphertext += plaintext.charAt(j * klen + t);
        }
    }
    
    var response={
        statusCode: 200,
        body: ciphertext,
    };
    return response;
    
}

exports.handler = async (event, context, callback) => {
    
    
  
async function handleEncrypt() {
    console.log(event);
    if(event.body){
        console.log("------------------------------------------");
    }
    var body = JSON.parse(event.body);
    console.log(body);
    var plaintext = body.key2;
    console.log(plaintext);
    var key = body.key3;
    console.log(key);
    var pc = "";
    
    const params = {
        Item: {
            userID:body.key1,
            plainText: plaintext,
            key: key
        },
        TableName: "cipherTest"
    };  
  console.log(params)

     await docClient.put(params, function(err, data) {
        if(err){
            console.log("inside put error",err);
        } else {
            console.log("inside put",data);
        }
    }).promise();
    console.log(Encrypt(plaintext, key, pc));
    return Encrypt(plaintext, key, pc);
}

    // TODO implement
    // const response = {
    //     statusCode: 200,
    //     body: JSON.stringify(handleEncrypt()),
    // };
    
    return handleEncrypt();
    
  
};
