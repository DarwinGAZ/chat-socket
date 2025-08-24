import express from "express";
import path from "path";
import http from "http";
import { Server as socketIO } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new socketIO(server);

server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});

app.use(express.static(path.join(__dirname, "../public")));

io.on("connection", (socket) => {
    console.log("New client connected...");

    socket.on("disconnect", () => {
        console.log("Client disconnected...");
    });
});
