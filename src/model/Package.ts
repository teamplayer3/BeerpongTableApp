import { Byte, checkU16Bounds, NBytes, u16ToBytes } from '../util/Utils';
import { SpecificPot } from '../lib/GameState';
import { Color } from './Color';
import { serialize } from '../../local_modules/bl-packet-bindings';

const START_BYTE = 0x02;
const END_BYTE = 0x03;

export default class Package {
    payloadLen: Byte;
    payload: NBytes;

    constructor(payload: NBytes) {
        checkU16Bounds(payload.length);

        this.payloadLen = payload.length;
        this.payload = payload;
    }

    pack = () => {
        const startOffset = 3;

        const payload = new Uint8Array(startOffset + this.payloadLen + 1);
        let u16Bytes = u16ToBytes(this.payloadLen);
        payload.set([START_BYTE, u16Bytes[0], u16Bytes[1]], 0);
        payload.set(this.payload, startOffset);
        payload.set([END_BYTE], startOffset + this.payloadLen);

        console.log(payload);

        return payload;
    };

    static setPotColors = (_pots: SpecificPot[], _color: Color) => {
        // const serializedPots = pots.map((pot) => pot.serialize())
        // const byteAmount = serializedPots.reduce((byteAmount, potBytes, _) => byteAmount += potBytes.length, 0);
        // const bytesPerPot = byteAmount / pots.length

        // const emptyPayload = new Uint8Array(byteAmount)

        // const payload = serializedPots.reduce((arr, b, i, a) => {
        //     arr.set(b, i * bytesPerPot)
        //     return arr
        // }, emptyPayload)

        const bytes = serialize('Packet', {
            operation: {
                tag: 'set_part_color',
                value: {
                    part: {
                        tag: 'Pot',
                        value: {
                            color: {
                                tag: 'Color',
                                value: {
                                    r: 255,
                                    g: 0,
                                    b: 0,
                                },
                            },
                            index: {
                                tag: 'Index',
                                value: 0,
                            },
                            module: {
                                tag: 'Main',
                            },
                        },
                    },
                },
            },
        });

        // const jsonPayload = JSON.stringify({
        //     "cmd": "SetColor",
        //     "table_side": 0,
        //     "pots": pots.map(p => {
        //         return {
        //             id: p.id,
        //             color: {
        //                 r: Math.floor(color.r),
        //                 g: Math.floor(color.g),
        //                 b: Math.floor(color.b),
        //             },
        //         }
        //     })
        // })
        // const encoder = new TextEncoder('utf8')
        // let payload = encoder.encode(jsonPayload)

        return new Package(new Uint8Array(bytes));
    };
}
