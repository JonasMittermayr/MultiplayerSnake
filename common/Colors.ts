import ColorPair from "./ColorPair.js";

const colors = new Map<number, ColorPair>([
    [0, new ColorPair("lightgray solid 2px", "lightgray")],
    [1, new ColorPair("cadetblue solid 2px","aquamarine")],
    [2, new ColorPair("lightgrey 2px solid", "green")],
    [3, new ColorPair("","red")]
])

export default colors
