import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import FirstFactor from "./register"
import SecondFactor from "./qasignup"
import LoginFirst from './login';
import LoginSecond from './qalogin';
import ThirdFactor from './cipherRegister';
import LoginThird from './cipherLogin';
import Visualize from './visualize';
import SimilarRecipes from "./SimilarRecipes";
import DataProcessing from "./DataProcessing";
import Polarity from "./Polarity";
import AgentChat from "./AgentChat";
import Chat from "./Chat";
import ProtectedRoute from "./Protected";
import ProfilePage from "./ProfilePage"
import OldChat from "./OldChatPage"

function App() {
  return (
    <Routes>
      <Route path="/register" element={<FirstFactor />} />
      <Route path="/qa-signup" element={<SecondFactor />} />
      <Route path="/signup-cipher" element={<ThirdFactor />} />

      <Route path="/login" element={<LoginFirst />} />
      <Route
        path="/qa-login"
        element={
          <ProtectedRoute>
            {" "}
            <LoginSecond />{" "}
          </ProtectedRoute>
        }
      />
      <Route
        path="/login-cipher"
        element={
          <ProtectedRoute>
            {" "}
            <LoginThird />{" "}
          </ProtectedRoute>
        }
      />

      <Route
        path="/visual"
        element={
          <ProtectedRoute>
            {" "}
            <Visualize />{" "}
          </ProtectedRoute>
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            {" "}
            <SimilarRecipes />{" "}
          </ProtectedRoute>
        }
      />
      <Route
        path="/similar-recipes"
        element={
          <ProtectedRoute>
            {" "}
            <SimilarRecipes />{" "}
          </ProtectedRoute>
        }
      />

      <Route
        path="/polarity"
        element={
          <ProtectedRoute>
            {" "}
            <Polarity />{" "}
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            {" "}
            <ProfilePage />{" "}
          </ProtectedRoute>
        }
      />

      <Route
        path="/oldChat"
        element={
          <ProtectedRoute>
            {" "}
            <OldChat />{" "}
          </ProtectedRoute>
        }
      />

      <Route
        path="/data-processing"
        element={
          <ProtectedRoute>
            {" "}
            <DataProcessing />{" "}
          </ProtectedRoute>
        }
      />

      {localStorage.getItem("type") === "user" ? (
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              {" "}
              <Chat />{" "}
            </ProtectedRoute>
          }
        />
      ) : (
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              {" "}
              <AgentChat />{" "}
            </ProtectedRoute>
          }
        />
      )}
    </Routes>
  );
}

export default App;
