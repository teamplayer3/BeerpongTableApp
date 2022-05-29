import React from "react";
import { View } from "react-native";
import { Color } from "../model/Color";
import PotComponent from "./Pot";
import PotRow from "./PotRow";

const gap = 5
const potSize = 60

const potLayout = [
    [0, 4],
    [4, 3],
    [7, 2],
    [9, 1]
]

export interface StyledPot {
    potId: number,
    pressable: boolean,
    style: PotStyle
}

export interface PotStyle {
    bordered: boolean,
    color: Color,
    overlay: any
}

export function PotLayout(props: {
    horizontalFlip?: boolean,
    onPress: (potId: number) => void,
    pots: StyledPot[]
}) {

    const { horizontalFlip, onPress } = props

    const styledPotComp = (idx: number) => {
        const pot = props.pots.find((pot) => pot.potId === idx)!
        return (
            <PotComponent key={idx} pressable={pot.pressable} bordered={pot.style.bordered} color={pot.style.color} overlay={pot.style.overlay} potId={idx} size={potSize} onPress={() => onPress(idx)} />
        )
    }

    const row = (startId: number, potCount: number) => {
        return (
            <PotRow gap={gap}>
                {Array.from({ length: potCount }, (_, i) => startId + i).map((idx, _) => styledPotComp(idx))}
            </PotRow>
        )
    }

    const mapLayoutToRow = (layout: number[]) => {
        return row(layout[0], layout[1])
    }

    return (
        <View style={{
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            {mapLayoutToRow(horizontalFlip ? potLayout[0] : potLayout[3])}
            {mapLayoutToRow(horizontalFlip ? potLayout[1] : potLayout[2])}
            {mapLayoutToRow(horizontalFlip ? potLayout[2] : potLayout[1])}
            {mapLayoutToRow(horizontalFlip ? potLayout[3] : potLayout[0])}
        </View>
    )
}