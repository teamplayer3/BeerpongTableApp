import { Byte, checkByteBounds, checkU16Bounds, NBytes, numberToByte, u16ToBytes } from "../util/Utils"
import { Pot } from "./Pot"
import { TextEncoder } from "text-encoder"

enum PackageId {
    SET_POT_COLORS = 1
}

const START_BYTE = 0x02
const END_BYTE = 0x03

export default class Package {
    payloadLen: Byte
    payload: NBytes

    constructor(
        payload: NBytes,
    ) {
        checkU16Bounds(payload.length)

        this.payloadLen = payload.length
        this.payload = payload
    }

    pack = () => {
        const startOffset = 3

        const payload = new Uint8Array(startOffset + this.payloadLen + 1)
        let u16Bytes = u16ToBytes(this.payloadLen);
        payload.set([START_BYTE, u16Bytes[0], u16Bytes[1]], 0)
        payload.set(this.payload, startOffset)
        payload.set([END_BYTE], startOffset + this.payloadLen)

        console.log(payload)

        return payload
    }

    static setPotColors = (pots: Pot[]) => {
        // const serializedPots = pots.map((pot) => pot.serialize())
        // const byteAmount = serializedPots.reduce((byteAmount, potBytes, _) => byteAmount += potBytes.length, 0);
        // const bytesPerPot = byteAmount / pots.length

        // const emptyPayload = new Uint8Array(byteAmount)

        // const payload = serializedPots.reduce((arr, b, i, a) => {
        //     arr.set(b, i * bytesPerPot)
        //     return arr
        // }, emptyPayload)

        const jsonPayload = JSON.stringify({
            "cmd": "SetColor",
            "pots": pots.map(p => {
                return {
                    id: p.id,
                    color: {
                        r: Math.floor(p.color.r),
                        g: Math.floor(p.color.g),
                        b: Math.floor(p.color.b),
                    },
                }
            })
        })
        const encoder = new TextEncoder('utf8')
        let payload = encoder.encode(jsonPayload)

        return new Package(payload)
    }

}