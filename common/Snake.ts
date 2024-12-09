import Coordinate from "./Coordinate.js";
import ColorPair from "./ColorPair.js";
import colors from "./Colors.js";

class Snake{

    private _body: Coordinate[]
    private _color: ColorPair


    public removeTail(document: Document){
        const tail = this._body.pop();

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


    public constructor(body: Coordinate[], color: ColorPair) {
        this._body = body
        this._color = color
    }


    get body(): Coordinate[] {
        return this._body;
    }

    set body(value: Coordinate[]) {
        this._body = value;
    }

    get color(): ColorPair {
        return this._color;
    }

    set color(value: ColorPair) {
        this._color = value;
    }
}

export default Snake