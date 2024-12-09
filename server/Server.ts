import express from "express"
import http from "http"
import {Server} from "socket.io"
import Snake from "../common/Snake.js";
import Coordinate from "../common/Coordinate.js";
import randomRGB from "./RandomRGB.js"
import {snakesToJsonSnakes} from "./SnakeType.js"
import Direction, {keyDirectionMapping} from "./Direction.js";

//id, snake
const snakes = new Map<string, Snake>()



const app = express()
const httpServer = http.createServer(app)
const socketioServer = new Server(httpServer, {
    cors: { origin: "*"}
})


socketioServer.on("connection", (socket)=> {

    console.log("client connected.")

    const row = Math.floor(Math.random() * 25) + 1
    snakes.set(socket.id, new Snake(
        [new Coordinate(1,row), new Coordinate(2,row), new Coordinate(3,row)],
        randomRGB(),
        Direction.East
    ))




    socket.emit("initialMapState", snakesToJsonSnakes(Array.from(snakes.values())))

    socket.on("newDirection", (key: string)=>{
        const snake = snakes.get(socket.id)
        const direction = keyDirectionMapping.get(key)
        if(snake && direction){
            snake.heading = direction
        }
    })

    socket.on("disconnect", ()=>{
        snakes.delete(socket.id)
    })

})

socketioServer.listen(4000)

let executor = setInterval(moveSnakes, 500)

function moveSnakes(){

    for (const snake of snakes.values()){

        const currentHead = snake.body[0]
        let newHead: Coordinate

        let yDelta = 0
        let xDelta = 0

        switch(snake.heading){
            case Direction.North: { yDelta-- } break;
            case Direction.South: { yDelta++ } break;
            case Direction.East: { xDelta++ } break;
            case Direction.West: { xDelta-- } break;
        }
        newHead = new Coordinate(currentHead.x + xDelta, currentHead.y + yDelta)

        snake.body.unshift(newHead)

        //remove tail
        snake.body.pop()

        //send updated map state to all clients
        socketioServer.emit("newMapState", snakesToJsonSnakes(Array.from(snakes.values())))
    }
}