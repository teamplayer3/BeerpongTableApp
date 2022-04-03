import { Byte, checkByteBounds, NBytes, numberToByte } from "../util/Utils"
import { Pot } from "./Pot"
import { TextEncoder } from "text-encoder"

enum PackageId {
    SET_POT_COLORS = 1
}

const START_BYTE = 0x02
const END_BYTE = 0x0A

export default class Package {
    payloadLen: Byte
    payload: NBytes

    constructor(
        payload: NBytes,
    ) {
        checkByteBounds(payload.length)

        this.payloadLen = payload.length
        this.payload = payload
    }

    pack = () => {
        const startOffset = 2

        const payload = new Uint8Array(startOffset + this.payloadLen + 1)
        payload.set([START_BYTE, numberToByte(this.payloadLen)], 0)
        payload.set(this.payload, startOffset)
        payload.set([END_BYTE], startOffset + this.payloadLen)

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
            "cmd": "SET_COLOR",
            "pots": pots
        })
        const encoder = new TextEncoder('utf8')
        let payload = encoder.encode(jsonPayload)

        console.log(payload)

        return new Package(payload)
    }

}