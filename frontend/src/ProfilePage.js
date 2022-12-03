import React, { useEffect, useState } from 'react'
import { collection, getDocs, doc, getDoc, setDoc, query, onSnapshot} from "firebase/firestore";
import db from "./firebaseDB";
import { Card, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NavigationBar from "./Navbar";

function ProfilePage() {
    const kommuniccate = ((d, m) => {
        var kommunicateSettings =
          { "appId": "365423f5538062fede68e6d8d5cd92f1f", "popupWidget": true, "automaticChatOpenOnNavigation": true };
        var s = document.createElement("script"); s.type = "text/javascript"; s.async = true;
        s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
        var h = document.getElementsByTagName("head")[0]; h.appendChild(s);
        window.kommunicate = m; m._globals = kommunicateSettings;
      })(document, window.kommunicate || {});
      
    const [previousChat,setPreviousChat] = useState([])
    const userEmail = localStorage.getItem("email");
    console.log(userEmail)
    const navigate = useNavigate()
    useEffect(() => {
        getDocs(collection(db,userEmail)).then(data => {
            console.log(data.docs)
            setPreviousChat(data.docs)
        }).catch(error => {
            console.log(error)
        })
    },[])
    return (
        <div style={{background:"linear-gradient(rgba(250,0,0,0.5),transparent)", overflow:"hidden"}} >
        <NavigationBar />
        <Grid container direction="row" justifyContent ="center" >
            <Grid container direction="row" justifyContent ="center" ><Typography variant="h3" sx={{m:2}}>User Profile </Typography></Grid>
            <Grid item xs={12}><Typography variant="h3" sx={{m:2}}>Previous Chats</Typography></Grid>
            {previousChat.map(chat => {
                console.log(chat.data())
                return(
                    <Grid item xs={12}>
                        <Card sx={{m:2}} onClick={() => {navigate("/oldChat",{state:{chatHistory:chat.data().chat, query: chat.data().chat[0].message}})}}>
                            <Typography variant="h5" sx={{m:2}}>{chat.data().chat[0].message}</Typography>
                        </Card>
                    </Grid>
                    
                )
                
            })}
            
        </Grid>
       </div>
    )
}

export default ProfilePage
