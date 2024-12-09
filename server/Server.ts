import express from "express"
import http from "http"
import { Server } from "socket.io"
import Snake from "../common/Snake.js";
import Coordinate from "../common/Coordinate.js";
import ColorPair from "../common/ColorPair.js";

const app = express()
const httpServer = http.createServer(app)
const socketioServer = new Server(httpServer, {
    cors: { origin: "*"}
})


socketioServer.on("connection", (socket)=> {
    console.log("client connected.")

    const snake1 = {
        color : "red",
        border : "solid 1px black",
        body : [
            { x: 0, y: 1 },
            { x: 1, y: 1 },
            { x: 2, y: 1 }
        ]
    }

    const snake2 = {
        color : "blue",
        border : "solid 1px black",
        body : [
            { x: 0, y: 3 },
            { x: 0, y: 4 },
            { x: 0, y: 5 }
        ]
    }

    socket.emit("initialMapState", [snake1, snake2])
})

socketioServer.listen(4000)