enum Direction{
    North=0,
    East=1,
    South=2,
    West=3
}

export default Direction

export const keyDirectionMapping = new Map<string, Direction>([
    ["w", Direction.North],
    ["a", Direction.West],
    ["s", Direction.South],
    ["d", Direction.East]
])