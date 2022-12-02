import { Avatar, Card, Grid, Typography } from '@mui/material'
import React from 'react'

function UserChatBubble(props) {
    console.log(props)
    return (
        <Card variant="outlined" sx={{m:1,maxWidth:"400px",borderRadius: '20px',backgroundColor:"#7b1fa2"}}>
                <Grid container justifyContent="center" align="center" direction="row">
                    <Grid container justifyContent="flex-start" align="center" direction="row">
                        <Avatar sx={{m:1}}/>
                        <Typography sx={{mt:2,color:"white"}} >{props.user_name}</Typography>
                    </Grid>
                    <Grid container>
                        <Typography sx={{m:1, color:"white"}} >
                            {props.message}
                        </Typography>
                    </Grid>
                </Grid>
            </Card>
    )
}

export default UserChatBubble

