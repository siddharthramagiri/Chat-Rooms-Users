const express = require("express");
const url = require("url");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const formatMessages = require("./utils/messages");
const {
    userJoin,
    getCurrentUser, 
    userleaves, 
    getRoomUsers 
} = require("./utils/users");


const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static('./public'));

const botname = "Jacob";

io.on('connection',socket => {
    console.log("Connection to Client");
    socket.on('joinroom',({ username, room})=> {
        
        const user = userJoin(socket.id,username,room);
        socket.join(user.room);

        socket.emit('message',formatMessages(botname,"Welcome to Chat Box"));

        //broadcast
        socket.broadcast
            .to(user.room)
            .emit('message',formatMessages(botname,`${username} has joined chat`));

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users :getRoomUsers(user.room),
        })
    });
    
    socket.on(`chatMsg`,msg => {
        const user = getCurrentUser(socket.id);

        io.to(user.room) .emit(`message`, formatMessages(user.username,msg) );
    })

    //when client Dissconnects
    socket.on('disconnect', ()=>{
        const user = userleaves(socket.id);
        if (user) {
            io.to(user.room).emit(
                'message',
                formatMessages(botname,`${user.username} has disconnected`)
            );

            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users :getRoomUsers(user.room),
            })
        }
    });
})

const PORT = 8000;

server.listen(PORT, ()=> console.log(`Server Started at port ${PORT}`));