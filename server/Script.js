
// Original single player game below

const speed = 10;
const directions = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"];
const size = 25;
const middle = Math.floor(size/2);
const grid = new Array(size);      //0=space, 1=border, 2=snake, 3=food

let newDirection = "ArrowRight";
let currentDirection = "ArrowRight";

let gameStarted = false;
let score = 0;

let currentHeadX = 4;
let currentHeadY = middle;
let snake = [middle + "-2", middle + "-3", middle + "-4"];



createGrid();
generateFood();

let executor;

document.addEventListener("keydown", changeDirection);

function createGrid(){

    //initialize 2D array
    for (let i = 0; i < size; i++) {
        grid[i] = new Array(size);

        for (let j = 0; j < size; j++) {
            //if border pixel, set 1
            if(i===size-1 || i===0 || j===size-1 || j===0) {
                grid[i][j] = 1;
            }
            else{ grid[i][j]=0; }
        }
    }

    //initialize snake
    grid[middle][2] = 2;
    grid[middle][3] = 2;
    grid[middle][4] = 2;

    //print pixels from 2D array
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {

            document.write("<span id='"+i+"-"+j+"' class='myPix' style='background-color: ");

            //print white pixel
            if(grid[i][j] === 0) document.write("lightgray; border: lightgray solid 2px'></span>");

            //print border pixel
            if(grid[i][j] === 1) {document.write("aquamarine; border: cadetblue solid 2px'></span>")}

            //print snake
            if(grid[i][j] === 2) {document.write("green; border: lightgrey 2px solid'></span>")}
        }
    }
}

function changeDirection(evt) {
    if(!gameStarted){
        document.getElementById("start_end").style.opacity="0";
        document.getElementById("start_end").style.animationName="vanish";
        document.getElementById("start_end").style.animationDuration="2s";

        executor = setInterval(moveSnake, 1000/speed);
        gameStarted = true;
        return;
    }

    //the direction can only be changed, if the pressed arrow key is not opposite to the direction that was set on the last interval
    if(!(evt.key === directions[(directions.indexOf(currentDirection)+2)%4])) {
        newDirection = evt.key;
    }
}

function moveSnake()
{
    //set new direction for this interval depending on the key that was last pressed
    currentDirection = newDirection;

    //set next square depending on the direction
    switch (currentDirection){
        case "ArrowRight": currentHeadX +=1; break;
        case "ArrowDown": currentHeadY +=1; break;
        case "ArrowLeft": currentHeadX -=1; break;
        case "ArrowUp": currentHeadY -=1; break;
    }

    //if the next square is either a border or a snake square, end game
    if(currentHeadX <= 0 || currentHeadX >= size-1 || currentHeadY <= 0 || currentHeadY >= size-1 || grid[currentHeadY][currentHeadX]===2) {
        document.getElementById("start_end").style.opacity = "1";
        document.getElementById("heading").innerText = "Game Over";
        document.getElementById("subheading").innerText = "Press F5 to restart.";
        clearInterval(executor);
        return;
    }

    //update snake array
    snake.push(currentHeadY + "-" + currentHeadX);

    //if next square is food
    if(grid[currentHeadY][currentHeadX] === 3) {
        generateFood();
        score++;
        //update score display
        document.getElementById("scoreDisplay").innerText = "Score: " + score;

        //light up effect for the duration of the intervall
        snake.forEach((square) => {
            document.getElementById(square).style.animationName="lightUp";
            document.getElementById(square).style.animationDuration=1/speed+"s";
        });
    }
    else{
        //remove snake tail from gui, from background array, and from snake array
        document.getElementById(snake[0]).style.backgroundColor = "lightgray";
        grid[snake[0].split("-")[0]][snake[0].split("-")[1]] = 0;
        snake.shift();
    }

    //set new square as snake, both in gui and background array
    document.getElementById(currentHeadY + "-" + (currentHeadX)).style.backgroundColor = "green";
    grid[currentHeadY][currentHeadX] = 2;
}

function generateFood(){
    let posX = Math.floor(Math.random()*(size-1)+1);
    let posY = Math.floor(Math.random()*(size-1)+1);

    if(grid[posY][posX] !== 0) {
        generateFood();
    }

    else{
        grid[posY][posX] = 3;
        document.getElementById(posY + "-" + posX).style.backgroundColor= "red";
    }
}