import Snake from "./Snake.js"
import Coordinate from "./Coordinate.js";
import {CoordinateJSON, SnakeJSON} from "../common/JSONTypes.js";



export function snakesToJsonSnakes(snakes: Snake[]) : SnakeJSON[]{
    const snakesAsJson: SnakeJSON[] = []

    for (const snake of snakes.values()){

       snakesAsJson.push({
            color: snake.color,
            body: coordsToJsonCoords(Array.from(snake.body))
        })
    }

    return snakesAsJson
}

export function coordsToJsonCoords(coords: Array<Coordinate>) : CoordinateJSON[]{

    const jsonCoords:  CoordinateJSON[] = []
    for(const coord of coords){
        jsonCoords.push({x: coord.x, y:coord.y})
    }

    return jsonCoords
}