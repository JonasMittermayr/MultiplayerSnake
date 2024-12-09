import Snake from "../common/Snake.js"

export type SnakeJSON = {
    color: string,
    body: {x: number, y: number}[]
}

export function snakesToJsonSnakes(snakes: Snake[]) : SnakeJSON[]{
    const snakesAsJson: SnakeJSON[] = []

    for (const snake of snakes.values()){
        const jsonCoords:  {x: number, y: number}[] = []
        for(const coord of snake.body){
            jsonCoords.push({x: coord.x, y:coord.y})
        }

        snakesAsJson.push({
            color: snake.color,
            body: jsonCoords
        })
    }

    return snakesAsJson
}
