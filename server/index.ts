import express from "express"
import http from "http"
import { Server } from "socket.io"

const app = express()
const httpServer = http.createServer(app)
const socketioServer = new Server(httpServer, {
    cors: { origin: "*"}
})


socketioServer.on("connection", ()=> {
    console.log("client connected.")
})

socketioServer.listen(4000)