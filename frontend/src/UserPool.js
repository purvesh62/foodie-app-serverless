import {CognitoUserPool} from "amazon-cognito-identity-js";

const poolData={
    UserPoolId:"us-east-1_4nh7HPrhe",
    ClientId:"28g5d91npl89544ht9215op6ad"
}

export default new CognitoUserPool(poolData);