import { Byte, byteToHex, MAX_BYTE_VAL, numberToByte } from "../util/Utils"
import { Color as SerializableColor } from "../../local_modules/bl-packet-bindings"

export class Color implements SerializableColor {
    r: Byte
    g: Byte
    b: Byte

    constructor(r: Byte, g: Byte, b: Byte) {
        this.r = r
        this.g = g
        this.b = b
    }

    static default = () => {
        return new Color(0, 0, 0)
    }

    static red = () => new Color(MAX_BYTE_VAL, 0, 0)
    static green = () => new Color(0, MAX_BYTE_VAL, 0)
    static blue = () => new Color(0, 0, MAX_BYTE_VAL)
    static white = () => new Color(MAX_BYTE_VAL, MAX_BYTE_VAL, MAX_BYTE_VAL)
    static purple = () => new Color(160, 32, 240)
    static yellow = () => new Color(MAX_BYTE_VAL, MAX_BYTE_VAL, 0)

    static fromString = (colorString: string) => {
        switch (colorString) {
            case "red": return Color.red()
            case "green": return Color.green()
            case "blue": return Color.blue()
            case "white": return Color.white()
            case "purple": return Color.purple()
            case "yellow": return Color.yellow()
        }
    }

    toHexString = () => {
        return `#${byteToHex(this.r)}${byteToHex(this.g)}${byteToHex(this.b)}`
    }
}