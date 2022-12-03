import React, {useState} from "react";
import { useForm } from "react-hook-form";
import './App.css';
import UserPool from "./UserPool";
import axios from "axios";
import {useNavigate} from "react-router-dom"
import { Hidden } from "@mui/material";
  

function FirstFactor() {
  const kommuniccate = ((d, m) => {
    var kommunicateSettings =
      { "appId": "365423f5538062fede68e6d8d5cd92f1f", "popupWidget": true, "automaticChatOpenOnNavigation": true };
    var s = document.createElement("script"); s.type = "text/javascript"; s.async = true;
    s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
    var h = document.getElementsByTagName("head")[0]; h.appendChild(s);
    window.kommunicate = m; m._globals = kommunicateSettings;
  })(document, window.kommunicate || {});
  
  let navigate=useNavigate();
  const[email, setEmail]=useState("");
  const[password, setPassword]=useState("");
  const[userType, setuserType]=useState("");
  const [err, setErr] = useState("");
  const [selectedValue, setSelectedValue] = React.useState('a');

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    setuserType(event.target.value);
    console.log(userType);
  };

  const { register, handleSubmit  } = useForm();
  const [name,SetName]=useState("");
  const [restname,SetRestName]=useState("");
  const [restaddress,SetRestAddress]=useState("");
  const [restphone,SetRestPhone]=useState(0);
  const [phone,SetPhone]=useState(0);

  const validateDetails = () =>{
    setErr("");

    if(password.length<8)
    {
      setErr("Password should be minimum 8 characters long");
    }
  

    if(err.length>0)
      return false;
    else
      return true;
  }
  const lambda =async(event)=>{
    axios.post("https://46lekobzvuuuczxjbwtbfnc2rq0pryot.lambda-url.us-east-1.on.aws/?message="+name+"&"+"message2="+phone+"&email="+email).then((res)=>{
        console.log(res.data);
    }).catch((error)=>{
      console.log(error);
    })
  }
  const lambdaRest =async(event)=>{
    axios.post("https://lbcsip6mmtz3crfqxrdu36vyvi0eejcd.lambda-url.us-east-1.on.aws/?message="+restname+"&"+"message2="+restphone+"&"+"message3="+restaddress+"&email="+email).then((res)=>{
        console.log(res.data);
    }).catch((error)=>{
      console.log(error);
    })
  }

  const onSubmit = (event)=>{
    // event.preventDefault();
    validateDetails();
    UserPool.signUp(email, password, [], null, (err,data)=>{
      if (err){
        console.error(err);
        alert("Something went wromg, please try again")
      }
      navigate('/qa-signup',{ state : {
        email: email}});
      console.log(data);
    });
    if (userType === '' || userType === 'a') {
      lambda();
    }
    else {
      lambdaRest();
    }
  };

  return (
    <div style={{background:"linear-gradient(rgba(250,0,0,0.5),transparent)", overflow:"hidden"}} >
    <h1>Welcome to HalifaxFoodie!!</h1>
    <p>Already a user? Click here to <a href="/login">Login</a></p>
      <form onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', gap: 2 }}>
        <br></br>
        <h2>Select your account type for Registration</h2>
        
        <div className="roles">
        <input type="radio"
        checked={selectedValue === 'a'}
        onChange={handleChange}
        value="a"
        name="radio-buttons"
        id="option-1"
      />
      <input type="radio"
        checked={selectedValue === 'b'}
        onChange={handleChange}
        value="b"
        name="radio-buttons"
        id="option-2"
      />
      <label htmlFor="option-1" className="option option-1">
      <div className="dot"></div>
      <span>Customer</span>
      </label>
   <label htmlFor="option-2" className="option option-2">
     <div className="dot"></div>
      <span>Restaurant</span>
   </label>
      </div>
        {selectedValue==='a' && <div className="form">
          
          <input type="text" style={{width: 500, padding: 12, margin:8}} id="formfield" placeholder="Enter your Name" {...register("customer1")} 
          onChange={(event)=> SetName(event.target.value)} required/><br></br>
          
          <input type="email" value={email} onChange={(event)=>setEmail(event.target.value)} style={{width: 500, padding: 12, margin:8}} 
          placeholder="Enter your Email Address" required /><br></br>
          
          <input type="tel" style={{width: 500, padding: 12, margin:8}} placeholder="Enter your Contact Number" {...register("customer3")} 
          onChange={(event)=> SetPhone(event.target.value)} required/><br></br>
          
          <input type="password" value={password} 
          onChange={(event)=>setPassword(event.target.value)}
          style={{width: 500, padding: 12, margin:8}} placeholder="Create a Password" required/><br></br>
         
         <p className="error"> {err}</p>
         <br></br>
          <button type="submit">Next</button>
          
          </div>} 

        {selectedValue==='b' && <div className="form">
          <input type="text" style={{width: 500, padding: 12, margin:8}} placeholder="Enter Restaurant's Name" {...register("rest1")} 
          onChange={(event)=> SetRestName(event.target.value)} required/><br></br>
          
          <input type="email" value={email} onChange={(event)=>setEmail(event.target.value)} style={{width: 500, padding: 12, margin:8}} 
          placeholder="Enter Restaurant's Email Address" required/><br></br>
          
          <input type="tel" style={{width: 500, padding: 12, margin:8}} placeholder="Enter Restaurant's Contact Number" {...register("rest3")} 
          onChange={(event)=> SetRestPhone(event.target.value)} required/><br></br>
          
          <input type="text" style={{width: 500, padding: 12, margin:8}} placeholder="Enter Restaurant's Address" {...register("rest2")} 
          onChange={(event)=> SetRestAddress(event.target.value)} required/><br></br>
          
          <input type="password" value={password} onChange={(event)=>setPassword(event.target.value)} style={{width: 500, padding: 12, margin:8}} 
          placeholder="Create a Password" required/><br></br>
          
          <button type="submit">Next</button>
          </div>} 
          
      </form>
      <p>Step 1 of 3</p>
    </div>
  );
}

export default FirstFactor;
