import { Byte, byteToHex, MAX_BYTE_VAL, numberToByte } from "../util/Utils"

export class Color {
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

    serialize = () => {
        return new Uint8Array([numberToByte(this.r), 
                                numberToByte(this.g), 
                                numberToByte(this.b)])
    }

    toHexString = () => {
        return `#${byteToHex(this.r)}${byteToHex(this.g)}${byteToHex(this.b)}`
    }
}