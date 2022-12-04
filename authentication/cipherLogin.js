const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

const params = {
  TableName : 'cipherTest'
}

async function listItems(){
  try {
    const data = await docClient.scan(params).promise()
    return data
  } catch (err) {
    return err
  }
}
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

exports.handler = async (event, context) => {
  try {
    const data = await listItems();
    const list_of_items=data.Items;
    console.log(list_of_items);
    console.log("line 57");
    var flag =0;
    if(event.body){
        console.log("------------------------------------------");
    }
    var body = JSON.parse(event.body);
    console.log("body is "+body)
    for (const item of list_of_items){
         const key=item.key;
         const plaintext=item.plainText;
         console.log("------"+plaintext)
         
         const response=Encrypt(plaintext,key,"");
         console.log("----------"+response)
         const cipher_text=response.body;
        
         console.log(cipher_text);
         console.log("event "+body.key1);
         if(cipher_text===body.key1){
           flag=1;
        break;
         }
    }
    return { body: flag }
  } catch (err) {
    return { error: err }
  }
}