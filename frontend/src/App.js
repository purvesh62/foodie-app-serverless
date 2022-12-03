import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import FirstFactor from "./register"
import SecondFactor from "./qasignup"
import LoginFirst from './login';
import LoginSecond from './qalogin';
import ThirdFactor from './cipherRegister';
import LoginThird from './cipherLogin';
import Visualize from './visualize';
import AgentChat from "./AgentPortal/AgentChat";
import Chat from "./Chat";
// import LexBot from "./lex-bot";
import ProfilePage from "./Profile.js/ProfilePage"

function App() {
  return (
    <Routes>
        <Route path="/" element={<FirstFactor />}/>
        <Route path="/qa-signup" element={<SecondFactor />}/>
        <Route path='/login' element={<LoginFirst />}/>
        <Route path='/qa-login' element={<LoginSecond />}/>
        <Route path='/signup-cipher' element={<ThirdFactor />}/>
        <Route path='/login-cipher' element={<LoginThird />}/>
        <Route path='/visual' element={<Visualize />}/>
        <Route path="/profile" element={<ProfilePage/>}></Route>
        {
          localStorage.getItem("type") === "user" ? <Route path='/chat' element={<Chat />}/> : <Route path='/chat' element={<AgentChat />}/>
        }
        {/* <Route path='/user-chat' element={<Chat />}/>
        <Route path='/agent-chat' element={<AgentChat />}/> */}
    </Routes>
      
  );
}

export default App;
