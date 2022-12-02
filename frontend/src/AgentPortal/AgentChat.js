import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Grid, TextField } from "@mui/material";
import axios from "axios";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  query,
  onSnapshot,
  where,
  deleteDoc,
} from "firebase/firestore";
import db from "../firebaseDB";
import UserChatBubble from "../UserChatBubble";
import AgentChatBubble from "../AgentChatBubble";

function AgentChat() {
  const [chatData, setChatHistory] = useState([]);
  const [chatDocument, setChatModuleDoc] = useState({ query: "" });
  const [message, setMessage] = useState("");
  const [documentID, setDocumentID] = useState("");

  function AddChatDocument() {
    const updatedChatDocument = {
      ...chatDocument,
      chatHistory: [
        ...chatData,
        { type: "agent", timestamp: Date.now().toString(), message: message },
      ],
    };
    console.log(updatedChatDocument);
    setDoc(doc(db, "ChatModule", documentID), {
      ...updatedChatDocument,
    })
      .then((data) => {
        setMessage("");
        setChatModuleDoc({ ...chatDocument });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function publishChatHistory() {
    let requestData = {
      "email": documentID
    };
    const res = await axios.post(
      "https://publish-communication-history-7vfph4kzpa-uc.a.run.app",
      requestData, {
      "headers": {
        'Content-Type': 'application/json'
      }}
    );
    console.log(res);
    const deleteRes = await deleteDoc(doc(db, "ChatModule", documentID));
    console.log(deleteRes);
  }

  async function getChatSession() {
    const qs = query(
      collection(db, "ChatModule"),
      where("agent_email", "==", "agent@dal.ca")
    );
    const snapshot = await getDocs(qs);
    console.log(snapshot.docs[0].id);
    setChatModuleDoc(snapshot.docs[0].data());
    setChatHistory([...snapshot.docs[0].data().chatHistory]);
    setDocumentID(snapshot.docs[0].id);
  }

  useEffect(() => {
    getChatSession();
    const q = query(
      collection(db, "ChatModule"),
      where("agent_email", "==", "agent@dal.ca")
    );
    const unsub = onSnapshot(q, (querySnapshot) => {
      getChatSession();
    });
  }, []);

  return (
    <Grid
      container
      justifyContent="center"
      direction="row"
      sx={{
        ml: 12,
        minHeight: "100%",
        backgroundColor: "#212121",
        maxWidth: "60%",
        borderRadius: "16px",
      }}
    >
      <Grid item xs={6}>
        <Typography variant="h4" color="white" sx={{ p: 2 }}>
          Query: {chatDocument.query}
        </Typography>
      </Grid>
        <Grid item xs={2}>
          <Button
              variant="outlined"
              onClick={publishChatHistory}
              size="large"
              color="warning"
              href="#contained-buttons"
              sx={{ m: 2, color: "white" }}
            >
              Resolved
            </Button>
        
      </Grid>
      {chatData.map((chat) => {
        return chat.type === "user" ? (
          <Grid
            item
            container
            direction="row"
            alignItems="center"
            justifyContent="flex-start"
          >
            <UserChatBubble {...{
              'message':chat.message,
              'agent_name': chatDocument.agent_name,
              'user_name': chatDocument.user_name
            }}  />
            
          </Grid>
        ) : (
          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
          >
            <AgentChatBubble {...{
              'message':chat.message,
              'agent_name': chatDocument.agent_name,
              'user_name': chatDocument.user_name
            }} />
          </Grid>
        );
      })}
      <Grid
        item
        container
        direction="row"
        alignItems="flex-end"
        justifyContent="center"
      >
        <TextField
          sx={{
            width: "100%",
            m: 2,
            backgroundColor: "#616161",
            input: { color: "white" },
          }}
          InputLabelProps={{
            style: { color: "#fff" },
          }}
          label="Type your message here"
          variant="filled"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          InputProps={{
            endAdornment: (
              <Button variant="contained" onClick={AddChatDocument}>
                Send
              </Button>
            ),
          }}
        ></TextField>
      </Grid>
      <Grid
        item
        container
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={2}
      ></Grid>
    </Grid>
  );
}

export default AgentChat;
