import PixelType from "./PixelType.js";

export class ColorPair{

    border: string
    background: string

    public constructor(border: string, background: string){
        this.border = border
        this.background = background
    }
}

const colors = new Map<PixelType, ColorPair>([
    [PixelType.Space, new ColorPair("lightgray solid 2px", "lightgray")],
    [PixelType.Border, new ColorPair("cadetblue solid 2px","aquamarine")],
    [PixelType.Snake, new ColorPair("lightgrey 2px solid", "green")],
    [PixelType.Food, new ColorPair("","red")]
])

export default colors
