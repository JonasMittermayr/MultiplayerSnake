enum Direction{
    North="w",
    East="d",
    South="s",
    West="a"
}

export default Direction

export const keyDirectionMapping = new Map<string, Direction>([
    ["w", Direction.North],
    ["a", Direction.West],
    ["s", Direction.South],
    ["d", Direction.East]
])