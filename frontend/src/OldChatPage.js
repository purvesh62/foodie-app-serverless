import React, { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import { useLocation } from 'react-router-dom';
import UserChatBubble from './UserChatBubble';
import AgentChatBubble from './AgentChatBubble';
function OldChat() {
    const location = useLocation()
    const chatHistory = location.state.chatHistory
    const query = location.state.query

    return (
        <Grid container justifyContent="center" align="center" direction="row" sx= {{minHeight:"100%"}}>
            <Grid item>
                <Typography variant="h3">
                    {query}
                </Typography>
            </Grid>
            {chatHistory.map(chat => {
                return(
                    chat.type === "user"? 
                    <Grid container direction="row" alignItems="center" justifyContent="flex-end">
                    <UserChatBubble message={chat.message}/>
                    </Grid>
                    :
                    <Grid container direction="row" alignItems="center" justifyContent="flex-start">
                    <AgentChatBubble message={chat.message}/>
                    </Grid>
                )
            })}
        </Grid>
    )
}

export default OldChat
