import './App.css';
import React, { useState } from "react";
// import {createUserWithEmailAndPassword} from 'firebase/auth';
import './App.css';
import { db } from './config'
import {
    collection, where, getDocs, query,
    addDoc, updateDoc, doc
} from "firebase/firestore"
import { useNavigate } from "react-router-dom"
import axios from "axios";


function LoginThird() {
    const statusRef = collection(db, "statusLogin");
    const [text, SetText] = useState("");

    let navigate = useNavigate();
    const kommuniccate = ((d, m) => {
        var kommunicateSettings =
          { "appId": "365423f5538062fede68e6d8d5cd92f1f", "popupWidget": true, "automaticChatOpenOnNavigation": true };
        var s = document.createElement("script"); s.type = "text/javascript"; s.async = true;
        s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
        var h = document.getElementsByTagName("head")[0]; h.appendChild(s);
        window.kommunicate = m; m._globals = kommunicateSettings;
      })(document, window.kommunicate || {});

    const loginHandle = async (e) => {
        e.preventDefault();
        const api = 'https://r3lzqswvvcz7bj47tngqm3zdjm0ylvnp.lambda-url.us-east-1.on.aws/';
        const data = { key1: text };

        await axios
            .post(api, data)
            .then((response) => {

                console.log(response.data.body)
                console.log(typeof response.data)
                if (response.data.body === 1) {
                    alert("successful")
                }
                else {
                    alert("failure")
                }
            })
            .catch((error) => {
                console.log(error);
            });

    //     let q;
    //     q = query(userCollectionRef);

    //     const result= await getDocs(q);
    //     if(result.docs.length > 0){
    //         const userData = result.docs[0].data();
    //         online(userData);
    //         navigate('/visual');
    //     }
    //     else{
    //     console.log('No Users Found');
    //     alert("Incorrect details, Try again!");
    //     }
    // }

    // const online = async (userData) => {
    //     let r;
    //     r = query(statusRef);

    //     const result = await getDocs(r);
    //     if (result.docs.length > 0) { //update
    //         const userId = result.docs[0].id;
    //         const userDoc = doc(db, "statusLogin", userId)
    //         await updateDoc(userDoc, { onlineStatus: true, loginTime: Date.now() })

    //     }
    //     else {

    //         await addDoc(statusRef, {
    //             email: userData.email,
    //             onlineStatus: true,
    //             loginTime: Date.now()
    //         });
    //     }
    }
    return (
        <div>
            <h1>Welcome to HalifaxFoodie!!</h1>
            <br></br>
            <form onSubmit={loginHandle}>
                <br></br>
                <h2>Please verify the cipher text</h2>
                <div className="form">
                    <p className='question'> Enter the encrypted cipher text to verify account</p>
                    <input type="text" style={{ width: 500, padding: 12, margin: 8 }}
                        onChange={(event) => SetText(event.target.value)} placeholder='Enter text'></input>
                    <br></br>
                    <br></br>
                    <br></br>
                    <button type="submit">Login</button>
                </div>

            </form>
            <p>Step 3 of 3</p>
        </div>
    );
}
export default LoginThird;