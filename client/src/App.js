import "./Style/App.css";
import Chat from "./Page/Chat";
import Login from "./Page/Login";
import { Routes, Route } from "react-router-dom";
import io from 'socket.io-client'
import { Toaster } from "sonner";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
const socket = io.connect('http://localhost:4002');

function App() {
  return (
    <div className="App">
      <Toaster/>
      <Routes>
        <Route exact path="/login" element={<Login socket={socket}/>} />
        <Route exact path="/chat" element={<Chat socket={socket}/>} />
      </Routes>
    </div>
  );
}

export default App;
