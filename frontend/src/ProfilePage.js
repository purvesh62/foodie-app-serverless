import React, { useEffect, useState } from 'react'
import { collection, getDocs, doc, getDoc, setDoc, query, onSnapshot} from "firebase/firestore";
import db from "./firebaseDB";
import { Card, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
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
        <>
        <Grid container direction="row" justifyContent ="center" >
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
        </>
    )
}

export default ProfilePage
