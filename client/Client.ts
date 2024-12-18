import {CoordinateJSON, SnakeJSON} from "../common/JSONTypes.js";
import PixelType from "./PixelType.js";
import colors from "../common/Colors.js";

const serverIP = "172.17.74.198"
const mapSize= 25;
const grid: PixelType[][] = new Array(mapSize)

/** Array used for erasing the outdated snakes (from last interval) from the map */
let oldSnakes: Array<SnakeJSON> = []

document.getElementById("field")!.style.width = `${mapSize * 30}px`
document.getElementById("sizeDisplay")!.innerText = `Size: ${mapSize}`

createGrid()


const socket = io(`ws://${serverIP}:4000`)

document.addEventListener("keydown", (ev) => {
    socket.emit("newDirection", ev.key)
})


socket.on("newMapState", (snakes: SnakeJSON[], food: CoordinateJSON[]) => {

    for (const snake of oldSnakes){
        for (const coord of snake.body){

            getPixelFromDom(coord.y, coord.x).style.backgroundColor = colors.get(PixelType.Space)!.background
        }
    }

    for (const snake of snakes) {
        for (const coord of snake.body) {

            getPixelFromDom(coord.y, coord.x).style.backgroundColor = snake.color
        }
    }

    oldSnakes = snakes

    console.log(`received food location: ${JSON.stringify(food)}`)

    for (const coord of food){
        getPixelFromDom(coord.y, coord.x).style.backgroundColor = colors.get(PixelType.Food)!.background
    }
})

socket.on("death", () => {
    document.getElementById("heading")!.innerText = "Game Over";
    document.getElementById("subheading")!.innerText = "Press F5 to restart.";
})


function createGrid() {
    // Initialize 2D array
    for (let i = 0; i < mapSize; i++) {
        grid[i] = new Array(mapSize);

        for (let j = 0; j < mapSize; j++) {
            const pixelId: string = `${i}-${j}`;
            const pixelElement: HTMLSpanElement = document.createElement("span");
            pixelElement.id = pixelId;
            pixelElement.classList.add("myPix");


            const color = colors.get(
                (i === mapSize - 1 || i === 0 || j === mapSize - 1 || j === 0) ? PixelType.Border : PixelType.Space
            )!

            pixelElement.style.backgroundColor = color.background;
            pixelElement.style.border = color.border

            document.getElementById("field")!.appendChild(pixelElement);
        }
    }
}



function getPixelFromDom(y: number, x: number): HTMLElement{
    const pixel = document.getElementById(y + "-" + x)

    if(pixel) return pixel
    else throw new Error(`Pixel not found for ID ${y}-${x}`)
}
