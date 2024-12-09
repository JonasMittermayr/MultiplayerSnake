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

    const snake1 = new Snake(
        [new Coordinate(0, 0), new Coordinate(0,1), new Coordinate(0,2)],
        new ColorPair("solid 1px black","red")
    )

    const snake2 = new Snake(
        [new Coordinate(3, 0), new Coordinate(3,1), new Coordinate(3,2)],
        new ColorPair("solid 1px black","blue")
    )

    socket.emit("initialMapState", [[snake1, snake2]])
})

socketioServer.listen(4000)