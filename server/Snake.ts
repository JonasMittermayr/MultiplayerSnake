import Coordinate from "./Coordinate.js";
import Direction from "./Direction.js";

class Snake{

    body: Coordinate[]
    color: string
    nextIntervalDirection: Direction
    lastIntervalDirection: Direction
    turboActive: boolean = false

    public constructor(
        body: Coordinate[],
        color: string,
        nextIntervalDirection: Direction,
        lastIntervalDirection: Direction
    ) {
        this.body = body
        this.color = color
        this.nextIntervalDirection = nextIntervalDirection
        this.lastIntervalDirection = lastIntervalDirection
    }
}

export default Snake