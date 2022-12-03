import './App.css';
import React, {useState} from "react";
import axios from "axios";
// import {db} from './config'
import db from "./firebaseDB";
import{collection, where, getDocs, query} from "firebase/firestore"
import {useNavigate} from "react-router-dom"

function LoginSecond(){
    let navigate=useNavigate();
    const userCollectionRef=collection(db,"secondFactor");
    const [answerone, setAOne]=useState("");
  const [answertwo, setATwo]=useState("");
  
  const verify = async(e)=>{
    e.preventDefault();
    let q;
    q = query(userCollectionRef, where("Answer1","==",answerone), 
    where("Answer2","==",answertwo));
    
    const result= await getDocs(q);
    if(result.docs.length > 0){
        navigate('/login-cipher');
    }
    else{
    console.log('No Users Found');
    alert("Incorrect details provided, please try again!");
    }
  }
//     const firestore =async(event)=>{
//     axios.post("https://us-central1-csci5410-a2-925a6.cloudfunctions.net/function-1/?message="+name+"&"+"message2="+phone).then((res)=>{
//         console.log(res.data);
//     }).catch((error)=>{
//       console.log(error);
//     })
//   }
    return (
<div style={{background:"linear-gradient(rgba(250,0,0,0.5),transparent)", overflow:"hidden"}} >
<h1>Welcome to HalifaxFoodie!!</h1>
<br></br>
<form onSubmit={verify}>
    <br></br>
    <h2>Verify your security questions</h2>
<div className="form">
<p className='question'> Enter your Birthplace:</p>
<input type="text" style={{width: 500, padding: 12, margin:8}} 
onChange={(event)=> setAOne(event.target.value)} placeholder='Birthplace'></input>

<p className='question'> Your favourite dish:</p>
<input type="text" style={{width: 500, padding: 12, margin:8}} 
onChange={(event)=> setATwo(event.target.value)} placeholder='Favourite dish'></input><br></br>
<br></br>
<button type="submit">Next</button>
</div>
</form>
<p>Step 2 of 3</p>
</div>
    );
}
export default LoginSecond;