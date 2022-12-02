import React, { useEffect, useState } from 'react'
import { collection, getDocs,doc,getDoc,setDoc,query,onSnapshot} from "firebase/firestore";
import db from '../../utils/firebaseDBChat'
import { Card, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
    const [previousChat,setPreviousChat] = useState([])
    const userEmail = JSON.parse(localStorage.getItem('user')).email
    console.log(userEmail)
    const navigate = useNavigate()
    useEffect(() => {
        getDocs(collection(db,userEmail+"_history")).then(data => {
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
                        <Card sx={{m:2}} onClick={() => {navigate("/oldChat",{state:{chatHistory:chat.data().chatHistory,query: chat.data().query}})}}>
                            <Typography variant="h4" sx={{m:2}}>{chat.data().query}</Typography>
                        </Card>
                    </Grid>
                    
                )
                
            })}
            
        </Grid>
        </>
    )
}

export default ProfilePage
