import { serialize } from "../../local_modules/bl-packet-bindings";
import { Color } from "../model/Color";

export class PacketPayloadBuilder {

    static setPotColor(potId: number, tableSide: number, color: Color): Uint8Array {
        return new Uint8Array(serialize("Packet", {
            operation: {
                tag: "set_part_color",
                value: {
                    part: {
                        tag: "Pot",
                        value: {
                            color: {
                                tag: "Color",
                                value: color
                            },
                            index: {
                                tag: "Index",
                                value: potId
                            },
                            module: {
                                tag: tableSide === 0 ? "Main" : "Secondary"
                            }
                        }
                    }
                }
            }
        }))
    }

}