import express from "express";
import path from "path";
import http from "http";
import { Server as socketIO, Socket } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new socketIO(server);

server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});

app.use(express.static(path.join(__dirname, "../public")));

let connectedUsers: string[] = [];

io.on("connection", (socket) => {
    console.log("New client connected...");

    socket.on("join-request", (username: string) => {
        socket.data.username = username;
        connectedUsers.push(username);
        console.log(connectedUsers);

        socket.emit("user-ok", connectedUsers);
    });
});
