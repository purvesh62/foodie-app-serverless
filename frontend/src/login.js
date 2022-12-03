import React, {useState} from "react";
import {CognitoUser, AuthenticationDetails} from "amazon-cognito-identity-js";
import './App.css';
import UserPool from "./UserPool";
import {useNavigate} from "react-router-dom"
import axios from "axios";
import NavigationBar from "./Navbar";

function LoginFirst() {
    const[email, setEmail]=useState("");
    const[password, setPassword]=useState("");
    const kommuniccate = ((d, m) => {
        var kommunicateSettings =
          { "appId": "365423f5538062fede68e6d8d5cd92f1f", "popupWidget": true, "automaticChatOpenOnNavigation": true };
        var s = document.createElement("script"); s.type = "text/javascript"; s.async = true;
        s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
        var h = document.getElementsByTagName("head")[0]; h.appendChild(s);
        window.kommunicate = m; m._globals = kommunicateSettings;
      })(document, window.kommunicate || {});
    let navigate=useNavigate();
    const onSubmit = (event)=>{
        event.preventDefault();
        const user = new CognitoUser({
            Username: email,
            Pool:UserPool
        });
        const authenticate = new AuthenticationDetails({
            Username:email,
            Password: password,
        });
        user.authenticateUser(authenticate,{
            onSuccess:(data)=>{
                axios.post("https://ak2nvhm6hpyyzkj3dcdxd6hgxa0hztxc.lambda-url.us-east-1.on.aws",
                {
                    "table_name": "users",
                    "type": "update",
                    "data": {
                      "primary_key": "email",
                      "primary_key_value": email,
                      "update_key": "is_active",
                      "update_key_value": true
                    }
                  }).then((res)=>{
                    // Get user type
                    axios.post("https://ak2nvhm6hpyyzkj3dcdxd6hgxa0hztxc.lambda-url.us-east-1.on.aws",
                    {
                        "table_name": "users",
                        "type": "select",
                        "data": {
                          "key": "email",
                          "value": email
                        }
                      }).then(function (response) {
                        localStorage.setItem("type", response.data.type);
                        localStorage.setItem("is_active", response.data.is_active);
                        localStorage.setItem("email", response.data.email);
                        localStorage.setItem("name", response.data.name)
                        console.log("Logged in user details: ", response.data);
                      })
                      .catch(function (error) {
                        console.log(error);
                      });
                    // localStorage.setItem({"type": "user"});
                    console.log(res.data);
                }).catch((error)=>{
                    console.log(error);
                })
                navigate('/qa-login');
                console.log("onSuccess: ",data);
            },
            onFailure:(err)=>{
                alert("Incorrect Username or password, please check and try again. or please check if you have verified your mail")
                console.error("onFailure: ", err);
            }
            // newPasswordRequired: (data)=>{
            //     console.log("newPasswordRequired: ", data);
            // }
        })
      };

      return (
        <div style={{background:"linear-gradient(rgba(250,0,0,0.5),transparent)", overflow:"hidden"}} >
            <h1>Welcome to HalifaxFoodie!!</h1>
            <p>New to the application? <a href="/register">Register here</a></p>
        <form onSubmit={onSubmit} className="formLogin">
        <br></br>
        <h2>Please enter your login details</h2>
            <div className="form">
        <input type="email" value={email} onChange={(event)=>setEmail(event.target.value)} style={{width: 500, padding: 12, margin:8}} 
          placeholder="Enter your Email Address"  /><br></br>
          <input type="password" value={password} 
          onChange={(event)=>setPassword(event.target.value)}
          style={{width: 500, padding: 12, margin:8}} placeholder="Enter Password" /><br></br>
          <br></br>
       <button type="submit">Next</button>
       </div>
        </form>
        <p>Step 1 of 3</p>
        </div>
      );
}

export default LoginFirst;