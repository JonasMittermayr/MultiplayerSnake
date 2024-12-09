import express from "express"
import http from "http"
import {Server} from "socket.io"
import Snake from "../common/Snake.js";
import Coordinate from "../common/Coordinate.js";
import randomRGB from "./RandomRGB.js"
import {snakesToJsonSnakes} from "./SnakeType.js"
import Direction, {keyDirectionMapping} from "./Direction.js";
import path from "path";

//id, snake
const snakes = new Map<string, Snake>()
const __dirname = import.meta.dirname



const app = express()
const httpServer = http.createServer(app)
const socketioServer = new Server(httpServer, {
    cors: { origin: "*"}
})

//irgendwie damit die css und js files, die die landing_page.html verlinkt richtig geladen werden

console.log(path.join(__dirname, "../client"))

app.use(express.static(path.join(__dirname, "../client")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "landing_page.html"));
});


socketioServer.on("connection", (socket)=> {

    console.log("client connected.")

    const row = Math.floor(Math.random() * 25) + 1
    snakes.set(socket.id, new Snake(
        [new Coordinate(1,row), new Coordinate(2,row), new Coordinate(3,row)],
        randomRGB(),
        Direction.East
    ))




    socket.emit("newMapState", snakesToJsonSnakes(Array.from(snakes.values())))

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
app.listen(3000)




let executor = setInterval(moveSnakes, 500)

function moveSnakes(){

    for (const [id, snake] of snakes.entries()){

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

        if(newHead.x >= 24 || newHead.x <= 0 || newHead.y >= 24 || newHead.y <= 0){

            const deadSnakeSocket = socketioServer.sockets.sockets.get(id)

            if(deadSnakeSocket){
                deadSnakeSocket.emit("death")
                console.log(`Emitting death to client ${id}`)
                snakes.delete(id)
            } else{
                throw new Error(`Snake died but Socket with id ${id} was not found, so death message was not sent.`)
            }



        } else {
            snake.body.unshift(newHead)

            //remove tail
            snake.body.pop()

            //send updated map state to all clients
            socketioServer.emit("newMapState", snakesToJsonSnakes(Array.from(snakes.values())))
        }
    }
}