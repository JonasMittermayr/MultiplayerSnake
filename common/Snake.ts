import Coordinate from "./Coordinate.js";
import colors from "./Colors.js";
import Direction from "../server/Direction.js";

class Snake{

    body: Coordinate[]
    color: string
    heading: Direction


    public removeTail(document: Document){
        const tail = this.body.pop();

        if (!tail) {
            throw new Error("Cannot remove tail: Snake body is empty.");
        }

        const element = document.getElementById(tail.y + "-" + tail.x);
        if (!element) {
            throw new Error(`Element with ID "${tail.y}-${tail.x}" not found.`);
        }

        element.style.backgroundColor = colors.get(0)!.background
        element.style.border = colors.get(0)!.border
    }


    public constructor(body: Coordinate[], color: string, heading: Direction) {
        this.body = body
        this.color = color
        this.heading = heading
    }
}

export default Snake