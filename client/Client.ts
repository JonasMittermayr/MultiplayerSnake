import {SnakeJSON} from "../server/SnakeType.js";

const size: number = 25;
const grid: number[][] = new Array(size); // 0=space, 1=border, 2=snake, 3=food

let oldSnakes: Array<SnakeJSON> = []





//todo

document.getElementById("field")!.style.width = `${size * 30}px`;
document.getElementById("sizeDisplay")!.innerText = `Size: ${size}`;

createGrid();

document.addEventListener("keydown", changeDirection);

const socket = io("ws://10.0.0.38:4000")



socket.on("newMapState", (snakes: SnakeJSON[]) =>{

    for (const snake of oldSnakes){
        for (const coord of snake.body){

            getPixelFromDom(coord.y, coord.x).style.backgroundColor = "lightgray"
        }
    }

    for (const snake of snakes) {
        for (const coord of snake.body) {

            getPixelFromDom(coord.y, coord.x).style.backgroundColor = snake.color
        }
    }

    oldSnakes = snakes
})

socket.on("death", () => {
    document.getElementById("heading")!.innerText = "Game Over";
    document.getElementById("subheading")!.innerText = "Press F5 to restart.";
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

function changeDirection(ev: KeyboardEvent) {

    socket.emit("newDirection", ev.key)

    /*if(!gameStarted){
        document.getElementById("start_end").style.opacity="0";
        document.getElementById("start_end").style.animationName="vanish";
        document.getElementById("start_end").style.animationDuration="2s";

        executor = setInterval(moveSnake, 1000/speed);
        gameStarted = true;
        return;
    }*/




    //todo serverside
    //the direction can only be changed, if the pressed arrow key is not opposite to the direction that was set on the last interval
    //if(!(evt.key === directions[(directions.indexOf(currentDirection)+2)%4])) {
    //         newDirection = evt.key;
    //     }
}

function getPixelFromDom(y: number, x: number): HTMLElement{
    const pixel = document.getElementById(y + "-" + x)

    if(pixel) return pixel
    else throw new Error(`Pixel not found for ID ${y}-${x}`)
}
