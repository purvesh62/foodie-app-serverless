import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Grid, TextField } from "@mui/material";
import UserChatBubble from "./UserChatBubble";
import AgentChatBubble from "./AgentChatBubble";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  query,
  onSnapshot,
} from "firebase/firestore";
import db from "./firebaseDB";
function Chat() {
  const userEmail = localStorage.getItem("email");

  const [chatDocument, setChatHistory] = useState([]);
  const [chatDataDocument, setChatModuleDoc] = useState({ query: "" });
  const [message, setMessage] = useState("");

  function AddChatDocument() {
    const updatedChatDocument = {
      ...chatDataDocument,
      chatHistory: [
        ...chatDocument,
        { type: "user", timestamp: Date.now().toString(), message: message },
      ],
    };

    console.log(updatedChatDocument);
    setDoc(doc(db, "ChatModule", userEmail), {
      ...updatedChatDocument,
    })
      .then((data) => {
        setMessage("");
        setChatModuleDoc({ ...chatDataDocument });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function getChatSession() {
    const docRef = doc(db, "ChatModule", userEmail);
    getDoc(docRef).then((data) => {
      console.log(data.data());
      setChatModuleDoc(data.data());
      setChatHistory([...data.data().chatHistory]);
    });
  }

  useEffect(() => {
    getChatSession();
    const q = query(collection(db, "ChatModule"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      getChatSession();
    });
  }, []);

  return (
    <Grid
      container
      justifyContent="center"
      align="center"
      direction="row"
      sx={{
        ml: 12,
        minHeight: "100%",
        backgroundColor: "#212121",
        maxWidth: "80%",
        borderRadius: "25px",
      }}
    >
      <Grid item>
        <Typography variant="h4" color="white" sx={{ p: 2 }}>
          {chatDataDocument.query}
        </Typography>
      </Grid>
      {chatDocument.map((chat) => {
        return chat.type === "user" ? (
          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
          >
            <UserChatBubble {...{
                "message": chat.message,
                'agent_name': chatDocument.agent_name,
                'user_name': localStorage.getItem("name")
              }
              } />
          </Grid>
        ) : (
          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="flex-start"
          >
            <AgentChatBubble {...{
                "message": chat.message,
                'agent_name': chatDocument.agent_name,
                'user_name': localStorage.getItem("name")
              }} />
          </Grid>
        );
      })}
      <Grid
        container
        direction="row"
        alignItems="flex-end"
        justifyContent="center"
      >
        <TextField
          sx={{
            borderRadius: "25px",
            width: "100%",
            m: 2,
            backgroundColor: "#616161",
            input: { color: "white" },
          }}
          InputLabelProps={{
            style: { color: "#fff" },
          }}
          id="outlined-basic"
          label="Type your message here"
          variant="outlined"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          InputProps={{
            endAdornment: (
              <Button variant="contained" onClick={AddChatDocument} 
              sx={{
                width: "10%",
                borderRadius: "5px",
                color: "#fff" 
              }}>
                Send
              </Button>
            ),
          }}
        ></TextField>
      </Grid>
      <Grid
        container
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={2}
      ></Grid>
    </Grid>
  );
}

export default Chat;
