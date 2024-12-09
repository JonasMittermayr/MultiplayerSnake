import Snake from "./Snake.js"
import Coordinate from "../common/Coordinate.js";

export type SnakeJSON = {
    color: string,
    body: {x: number, y: number}[]
}

export type JSONCoordinate = {
    x: number,
    y: number
}

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

export function coordsToJsonCoords(coords: Array<Coordinate>) : JSONCoordinate[]{

    const jsonCoords:  JSONCoordinate[] = []
    for(const coord of coords){
        jsonCoords.push({x: coord.x, y:coord.y})
    }

    return jsonCoords
}