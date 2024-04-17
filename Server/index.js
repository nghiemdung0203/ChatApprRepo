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

require("dotenv").config();

app.use(express.json());
app.use(cors());
app.use("/User", UserRoutes);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

// Dùng một Map để lưu thông tin của từng user
const userSockets = new Map();

io.on("connection", async (socket) => {
  socket.on("join", (user_id) => {
    // Lưu thông tin của user vào Map
    socket.join(`${user_id}`);
    userSockets.set(user_id, socket);
    
    console.log(`${user_id} is user_id`);
    console.log(`joined ${user_id}`);
  });

  socket.on("sendMessage", (data) => {
    console.log(data);
    SendMessage(socket, data);
  });

  socket.on("disconnect", () => {
    // Xóa thông tin của user khi ngắt kết nối
    userSockets.forEach((value, key) => {
      if (value === socket) {
        userSockets.delete(key);
      }
    });
    console.log(`🔥:${socket.id} user disconnected`);
  });
});

const callConsumerRepeatedly = () => {
  // Gọi Consumer cho từng user trong Map
  userSockets.forEach(async (socket, user_id) => {
    await Consumer(socket, user_id);
  });
};

// Gọi hàm callConsumerRepeatedly mỗi giây
setInterval(callConsumerRepeatedly, 1000);

httpServer.listen(4002);
