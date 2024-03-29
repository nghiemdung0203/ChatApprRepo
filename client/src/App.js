import "./Style/App.css";
import Chat from "./Page/Chat";
import Login from "./Page/Login";
import Register from "./Page/Register";
import { Routes, Route } from "react-router-dom";
import io from 'socket.io-client'

const socket = io.connect('http://localhost:4000');

function App() {
  
  return (
    <div className="App">
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/chat" element={<Chat socket={socket}/>} />
      </Routes>
    </div>
  );
}

export default App;
