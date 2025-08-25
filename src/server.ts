import express from "express";
import path from "path";
import http from "http";
import { Server as socketIO, Socket } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new socketIO(server);

app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

let connectedUsers: string[] = [];

io.on("connection", (socket) => {
    console.log("New client connected...");

    socket.on("join-request", (username: string) => {
        socket.data.username = username;
        connectedUsers.push(username);
        console.log(connectedUsers);

        socket.emit("user-ok", connectedUsers);

        socket.broadcast.emit("list-update", {
            joined: username,
            list: connectedUsers,
        });

        socket.on("disconnect", () => {
            connectedUsers = connectedUsers.filter(
                (u) => u != socket.data.username
            );
            console.log(connectedUsers);

            socket.broadcast.emit("list-update", {
                left: socket.data.username,
                list: connectedUsers,
            });
        });
    });

    socket.on("send-msg", (txt: string) => {
        let obj = {
            username: socket.data.username,
            message: txt,
        };

        socket.broadcast.emit("show-msg", obj);
    });
});

server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
