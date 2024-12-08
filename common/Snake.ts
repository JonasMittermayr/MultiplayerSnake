import Coordinate from "./Coordinate";

class Snake{

    private _body: Coordinate[]
    private _color: String

    get color(): String {
        return this._color;
    }

    set color(value: String) {
        this._color = value;
    }


    public constructor(body: Coordinate[], color: String) {
        this._body = body
        this._color = color
    }


    get body(): Coordinate[] {
        return this._body;
    }

    set body(value: Coordinate[]) {
        this._body = value;
    }
}

export default Snake