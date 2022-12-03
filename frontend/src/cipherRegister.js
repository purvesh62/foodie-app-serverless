import React, {useState} from "react";
import './App.css';
import axios from "axios";
import { useLocation} from "react-router-dom"
import { useNavigate } from "react-router-dom"

function ThirdFactor(){
  let incomingData = useLocation();
  let navigate = useNavigate();

    const [text,SetText]=useState("");
    const [key,SetKey]=useState("");
    const [cipher, setCipher] = useState("");
    const kommuniccate = ((d, m) => {
      var kommunicateSettings =
        { "appId": "365423f5538062fede68e6d8d5cd92f1f", "popupWidget": true, "automaticChatOpenOnNavigation": true };
      var s = document.createElement("script"); s.type = "text/javascript"; s.async = true;
      s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
      var h = document.getElementsByTagName("head")[0]; h.appendChild(s);
      window.kommunicate = m; m._globals = kommunicateSettings;
    })(document, window.kommunicate || {});
    const cipherlambda = async(e)=> {
        e.preventDefault();
        // alert("in cipher lambda");
        
        const api = 'https://j5rtydouff2kervbp7ynhmjyg40hueyq.lambda-url.us-east-1.on.aws/';
        const data = { key1:incomingData.state.email, key2:text, key3:key};
        setCipher("");
        await axios
          .post(api, data)
          .then((response) => {

            setCipher(response.data)
          })
          .catch((error) => {
            alert("Something went wrong, please try again");
            console.log(error);
          });
      } 

    return (
<div style={{background:"linear-gradient(rgba(250,0,0,0.5),transparent)", overflow:"hidden"}} >
<h1>Welcome to HalifaxFoodie!!</h1>
<br></br>
<form>
    <br></br>
    <h2>Please provide details to generate a cipher text</h2>
<div className="form">
<p className='question'> Please enter a plain text</p>
<input type="text" id="ptext" style={{width: 500, padding: 12, margin:8}} placeholder='Enter plain text'
onChange={(event)=> SetText(event.target.value)} required></input>

<p className='question'> Please enter a key of 4 characters</p>
<input type="text" style={{width: 500, padding: 12, margin:8}} placeholder='Enter key (max. 4 characters)'
onChange={(event)=> SetKey(event.target.value)} maxLength={4} required></input><br></br>

<button className='cipher' onClick={cipherlambda}>Generate Cipher Text</button>
<p className="ctext">{cipher}</p>
<br></br>
<p className="error">Note!! Please note down your cipher text as it will be required during login</p>
<br></br>
<button type="submit" onClick={() => {navigate("/login")}}>Register</button>
</div>

</form>
<p>Step 3 of 3</p>
</div>
    );
}
export default ThirdFactor;