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

export interface PotStyle {
    bordered: boolean,
    color: Color,
    overlay: any
}

export function PotLayout(props: {
    horizontalFlip?: boolean,
    potStyleMapping: (potId: number) => PotStyle,
    onPress: (potId: number) => void
}) {

    const { horizontalFlip, onPress, potStyleMapping } = props

    const styledPotComp = (idx: number) => {
        const styled = potStyleMapping(idx);
        return (
            <PotComponent key={idx} bordered={styled.bordered} color={styled.color} overlay={styled.overlay} potId={idx} size={potSize} onPress={() => onPress(idx)} />
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