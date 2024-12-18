import express from "express"
import http from "http"
import {Server} from "socket.io"
import Snake from "./Snake.js";
import Coordinate from "./Coordinate.js";
import randomRGB from "./RandomRGB.js"
import {coordsToJsonCoords, snakesToJsonSnakes} from "./JSONConversion.js"
import Direction, {keyDirectionMapping} from "./Direction.js";
import path from "path";

const speed = 5
const mapSize = 25
const grid : string[][] = []
createGrid()

//id, snake
const snakes = new Map<string, Snake>()
let food = new Array<Coordinate>()
generateFood()
generateFood()

function generateFood(){
    let x = Math.floor(Math.random()*(mapSize-2)+1);
    let y = Math.floor(Math.random()*(mapSize-2)+1);

    if( grid[y][x] == "space") {
        food.push(new Coordinate(x,y))
        grid[y][x] = "food"
    } else{
        //todo essen kann noch in schlangen drinnen generiert werden
        generateFood()
    }
}


const __dirname = import.meta.dirname



const app = express()
const httpServer = http.createServer(app)
const socketioServer = new Server(httpServer, {
    cors: { origin: "*" }
})

//irgendwie damit die css und js files, die die landing_page.html verlinkt richtig geladen werden

console.log(path.join(__dirname, "../client"))

app.use(express.static(path.join(__dirname, "../client")));



app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "landing_page.html"));
});


socketioServer.on("connection", (socket)=> {

    console.log("client connected.")

    const row = Math.floor(Math.random() * (mapSize-2)) +1
    snakes.set(socket.id, new Snake(
        [new Coordinate(1, row), new Coordinate(2, row), new Coordinate(3, row)],
        randomRGB(),
        Direction.East,
        Direction.East
    ))
    grid[row][1] = socket.id

    console.log(coordsToJsonCoords(food))
    socket.emit("newMapState",
        snakesToJsonSnakes(Array.from(snakes.values())),
        coordsToJsonCoords(food)
    )



    socket.on("newDirection", (key: string)=>{
        const snake = snakes.get(socket.id)
        const newDirection = keyDirectionMapping.get(key)
        if(snake && newDirection != null){

            console.log(`heading: ${snake.nextIntervalDirection} new direction: ${newDirection}`)
            if(newDirection != (snake.lastIntervalDirection+2)%4){
                snake.nextIntervalDirection = newDirection
            }

        } else{
            console.log(`Either Snake was not found or there was no direction associated with key ${key}`)
        }
    })

    socket.on("disconnect", ()=>{
        snakes.delete(socket.id)
    })

})

socketioServer.listen(4000)
app.listen(3000)
console.log("Server listening on port 3000.")


let executor = setInterval(moveSnakes, 1000/speed)

function moveSnakes(){

    //console.log("grid at beginning of movesnakes():")

    for (const [id, snake] of snakes.entries()){

        const currentHead = snake.body[0]
        let newHead: Coordinate

        let yDelta = 0
        let xDelta = 0

        switch(snake.nextIntervalDirection){
            case Direction.North: { yDelta-- } break;
            case Direction.South: { yDelta++ } break;
            case Direction.East: { xDelta++ } break;
            case Direction.West: { xDelta-- } break;
        }
        newHead = new Coordinate(currentHead.x + xDelta, currentHead.y + yDelta)
        const fieldType = grid[newHead.y][newHead.x]


        if(
            //newHead.x >= mapSize-1 || newHead.x <= 0 || newHead.y >= mapSize-1 || newHead.y <= 0
            fieldType != "food" &&  fieldType != "space"
        ){
            //prepare death

            const deadSnakeSocket = socketioServer.sockets.sockets.get(id)

            if(deadSnakeSocket){
                deadSnakeSocket.emit("death")
                console.log(`Emitting death to client ${id}`)

                for(const carcassPixel of snakes.get(id)!.body){
                    grid[carcassPixel.y][carcassPixel.x] = "space"
                }
                console.log(`died on coordinates y=${newHead.y} x=${newHead.x} because of ${fieldType}`)

                snakes.delete(id)
            } else{
                throw new Error(`Snake died but Socket with id ${id} was not found, so death message was not sent.`)
            }
        } else {

            //if the grid at the coordinates of the new head is not "food", pop the tail of the snake
            if(grid[newHead.y][newHead.x] == "food"){

                //filter out the item where the foods coordinate match the head coords
                food = food.filter( it =>  !(it.y == newHead.y && it.x == newHead.x) )
                generateFood()
            } else {
                const tailcoords = snake.body.pop()!
                grid[tailcoords.y][tailcoords.x] = "space"
            }


            snake.body.unshift(newHead)
            grid[newHead.y][newHead.x] = id

            snake.lastIntervalDirection = snake.nextIntervalDirection


            //send updated map state to all clients
            socketioServer.emit("newMapState",
                snakesToJsonSnakes(Array.from(snakes.values())),
                coordsToJsonCoords(food)
            )
        }
    }
}

function createGrid() {

    //initialize 2D array
    for (let i = 0; i < mapSize; i++) {
        grid[i] = new Array(mapSize);

        for (let j = 0; j < mapSize; j++) {
            //if border pixel, set 1
            if (i === mapSize - 1 || i === 0 || j === mapSize - 1 || j === 0) {
                grid[i][j] = "border";
            } else {
                grid[i][j] = "space";
            }
        }
    }
}