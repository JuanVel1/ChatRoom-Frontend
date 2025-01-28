import http from "http";
import { Server } from "socket.io";
import express from "express";
import { log } from "console";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin:process.env.CLIENT_ORIGIN,
    credentials: true,
  },
});

let users = {};

app.get("/", (req, res) => {
  res.send("Server chat is running and ready to accept connections");
});

io.on("connection", (socket) => {
  socket.on("join", ({ username, room }) => {
    users[socket.id] = { username, room };
    socket.join(room); // Unir al usuario a la sala específica 
    log(`The user ${username} has joined the chat`);
  });

  socket.on("messageFromClient", (message) => {
    const user = users ? users[socket.id] : "User";
    io.to(message.room).emit('messageFromServer', message);
  });

  socket.on(
    "privateMessageFromClient",
    (data) => {
      console.log(
        `Private message from ${users[socket.id]} to ${data.recipient}`
      );
      const user = users[socket.id] || "User";
      const recipientSocket = Object.keys(users).find(
        (socketId) => users[socketId] === data.recipient
      );
      if (recipientSocket) {
        io.to(recipientSocket).emit("privateMessageFromServer", {
          user,
          recipient: data.recipient,
          message: data.message,
        });
      }
    }
  );

  socket.on("disconnect", () => {
    console.log(users);

    console.log(`The user ${users[socket.id]} has left the chat.`);
    delete users[socket.id];
  });
});


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
