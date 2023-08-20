export class Coord {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static sized = (size: number) => {
        return new Coord(size, size);
    };

    add = (coord: Coord) => {
        return new Coord(this.x + coord.x, this.y + coord.y);
    };

    sub = (coord: Coord) => {
        return new Coord(this.x - coord.x, this.y - coord.y);
    };

    toString = () => {
        return `[ ${this.x} ; ${this.y} ]`;
    };
}
