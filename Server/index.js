  const express = require("express");
  const { createServer } = require("http");
  const { Server } = require("socket.io");
  const app = express();
  const httpServer = createServer(app);
  const cors = require("cors");
  const UserRoutes = require("./routes/UserRoutes");
  const { SendMessage } = require("./controller/SendMessage");
  const { Consumer } = require("./queue/consumer");
const { Conversation } = require("./controller/Conversation");
const { getUser_id } = require("./Global Variable/userId");
const id = getUser_id();

  require("dotenv").config();

  app.use(express.json());
  app.use(cors());
  app.use("/User", UserRoutes);

  const io = new Server(httpServer, {
      cors: {
        origin: "http://localhost:3000",
    },
  });
  

    
  io.on("connection", async(socket) => {
    const id = getUser_id(); // Get the updated id value
    console.log(id)
    if (id !== undefined) {
        Consumer(id);
    }
   
    socket.on("sendMessage", (data) => {      
      console.log(data);
      SendMessage(socket, data);
    });

    socket.on("joinRoom", (data) => {
      (`${socket.id} joined ${data}`);
      io.to(data).emit("joinedRoom", `${socket.id} joined ${data}`);
    });

    socket.on("disconnect", () => {
      console.log(`🔥:${socket.id} user disconnected`);
    });
  });

  httpServer.listen(4002);
