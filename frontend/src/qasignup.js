import './App.css';
import React, {useState} from "react";
import axios from "axios";
import {useNavigate, useLocation} from "react-router-dom"

function SecondFactor(){
    const [ques1,SetQues1]=useState("");
    const [ques2,SetQues2]=useState("");
    const kommuniccate = ((d, m) => {
      var kommunicateSettings =
        { "appId": "365423f5538062fede68e6d8d5cd92f1f", "popupWidget": true, "automaticChatOpenOnNavigation": true };
      var s = document.createElement("script"); s.type = "text/javascript"; s.async = true;
      s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
      var h = document.getElementsByTagName("head")[0]; h.appendChild(s);
      window.kommunicate = m; m._globals = kommunicateSettings;
    })(document, window.kommunicate || {});
    let navigate=useNavigate();
    let incomingData = useLocation();
    const email=incomingData.state.email;
    
    const firestore =async(event)=>{
      event.preventDefault();
        axios.post(
          "https://us-central1-csci5410-project-370006.cloudfunctions.net/storeSecondAuth",
          {
            "key1":ques1,
            "key2": ques2,
            "key3": email
          }).then((res)=>{
            console.log(res);
          console.log(res.data);
            navigate('/signup-cipher',{ state : {
              email: email}});

        }).catch((error)=>{
          console.log(error);
        })
      } 
      // const submit = (event)=>{
      //   firestore();
      // }

//     const cipherlambda = async(e)=> {
//       e.preventDefault();
//       // alert("in cipher lambda");
      
//       const api = 'https://us-central1-csci5410-a2-925a6.cloudfunctions.net/function-1';
//       const data = { key1:ques1, key2:ques2};
//       // setCipher("");
//       console.log(data);
//       await axios
//         .post(api, data)
//         .then((response) => {
//           console.log(response)
// console.log(response.data)
//           // setCipher(response.data)
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//     } 

    return (
      
<div>
  
<h1>Welcome to HalifaxFoodie!!</h1>
<br></br>
<form onSubmit={firestore}>
    <br></br>
    <h2>Please provide answer to this security questions</h2>
<div className="form">
<p className='question'> Where is your Birthplace?</p>
<input type="text" style={{width: 500, padding: 12, margin:8}} placeholder='Enter your Birthplace'
onChange={(event)=> SetQues1(event.target.value)}></input>

<p className='question'> What is your favourite dish?</p>
<input type="text" style={{width: 500, padding: 12, margin:8}} placeholder='Enter your favourite dish'
onChange={(event)=> SetQues2(event.target.value)}></input><br></br>
<br></br>
<button type="submit">Next</button>
</div>

</form>
<p>Step 2 of 3</p>
</div>
    );
}
export default SecondFactor;