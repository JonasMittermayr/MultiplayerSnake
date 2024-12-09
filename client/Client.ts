import Coordinate from "../common/Coordinate.js"
import Snake from "../common/Snake.js"
import colors from "../common/Colors.js";

const size: number = 25;
const grid: number[][] = new Array(size); // 0=space, 1=border, 2=snake, 3=food





//todo

document.getElementById("field")!.style.width = `${size * 30}px`;
document.getElementById("sizeDisplay")!.innerText = `Size: ${size}`;

createGrid();

const socket = io("ws://localhost:4000")

socket.on("initialMapState", (snakes: Snake[])=>{

    for (const snake of snakes) {
        for (const coord of snake.body) {

            //todo
            const pixel = document.getElementById(coord.y + "-" + coord.x)!
            pixel.style.border = colors.get(2)!.border
            pixel.style.backgroundColor = colors.get(2)!.background

        }
    }

})

socket.on("newMapState", (snakeHeads: Coordinate[]) =>{

})







function createGrid(): void {
    // Initialize 2D array
    for (let i = 0; i < size; i++) {
        grid[i] = new Array(size);

        for (let j = 0; j < size; j++) {
            // If border pixel, set 1
            if (i === size - 1 || i === 0 || j === size - 1 || j === 0) {
                grid[i][j] = 1;
            } else {
                grid[i][j] = 0;
            }
        }
    }

    // Print pixels from 2D array
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const pixelId: string = `${i}-${j}`;
            const pixelElement: HTMLSpanElement = document.createElement("span");
            pixelElement.id = pixelId;
            pixelElement.classList.add("myPix");

            switch (grid[i][j]) {
                case 0:
                    pixelElement.style.backgroundColor = "lightgray";
                    pixelElement.style.border = "lightgray solid 2px";
                    break;
                case 1:
                    pixelElement.style.backgroundColor = "aquamarine";
                    pixelElement.style.border = "cadetblue solid 2px";
                    break;
                case 2:
                    pixelElement.style.backgroundColor = "green";
                    pixelElement.style.border = "lightgrey 2px solid";
                    break;
            }

            document.getElementById("field")!.appendChild(pixelElement);
        }
    }
}
