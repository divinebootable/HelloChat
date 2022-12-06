const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userExit, getRoomUsers } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Static folder

app.use(express.static(path.join(__dirname, "public")));
const botName = 'HelloChat Bot';

// Run When Client connects

io.on("connection", (socket) => {
  socket.on('joinRoom', ({ username, room})=>{
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    socket.emit("message", formatMessage(botName, "Welcome to HelloChat!"));

  //BroadCast when a user connects
  socket.broadcast.to(user.room).emit("message", formatMessage(botName, `${user.username} has join the chat!`));

   // Send users and room info
  io.to(user.room).emit('roomUsers', {
    room: user.room,
    users: getRoomUsers(user.room)
  })

  });

 

  //listen for chat message
  socket.on("chatMessage", (msg) => {
     const user = getCurrentUser(socket.id);
    io.emit("message", formatMessage("USER", msg));
  });

  socket.on("disconnect", () => {
    const user = userExit(socket.id);
    if(user){
       io.to(user.room).emit("message", formatMessage(botName, `${user.username} has left Chat`));
    }

    // Send users and room info
  io.to(user.room).emit('roomUsers', {
    room: user.room,
    users: getRoomUsers(user.room)
  })
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
