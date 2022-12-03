import React, { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import { useLocation } from 'react-router-dom';
import UserChatBubble from './UserChatBubble';
import AgentChatBubble from './AgentChatBubble';
import NavigationBar from "./Navbar";

function OldChat() {
    const location = useLocation()
    const chatHistory = location.state.chatHistory
    const query = location.state.query
    const kommuniccate = ((d, m) => {
        var kommunicateSettings =
          { "appId": "365423f5538062fede68e6d8d5cd92f1f", "popupWidget": true, "automaticChatOpenOnNavigation": true };
        var s = document.createElement("script"); s.type = "text/javascript"; s.async = true;
        s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
        var h = document.getElementsByTagName("head")[0]; h.appendChild(s);
        window.kommunicate = m; m._globals = kommunicateSettings;
      })(document, window.kommunicate || {});
    return (
        <div style={{background:"linear-gradient(rgba(250,0,0,0.5),transparent)", overflow:"hidden"}} >
        <NavigationBar />
        <Grid container justifyContent="center" align="center" direction="row" sx= {{minHeight:"100%"}}>
            <Grid item>
                <Typography variant="h3">
                    User Query: {query}
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
        </Grid></div>
    )
}

export default OldChat
