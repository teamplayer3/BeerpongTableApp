import React, { ReactNode } from "react";
import { Animated, View } from "react-native";
import { Color } from "../model/Color";
import PotComponent from "./Pot";
import PotRow from "./PotRow";

const GAP = 5
const POT_SIZE = 60

const potLayout = [
    [0, 4],
    [4, 3],
    [7, 2],
    [9, 1]
]

export enum Orientation {
    Horizontal,
    Vertical
}

export interface StyledPot {
    potId: number,
    pressable: boolean,
    style: PotStyle
}

export interface PotStyle {
    bordered: boolean,
    color: string,
    overlay: any,
}

export function PotLayout(props: {
    horizontalFlip?: boolean,
    onPress: (potId: number) => void,
    pots: StyledPot[]
    orientation: Orientation
    scale?: Animated.Value
}) {

    const { horizontalFlip, onPress } = props
    const scale = props.scale ? props.scale : new Animated.Value(1)

    const styledPotComp = (idx: number) => {
        const pot = props.pots.find((pot) => pot.potId === idx)!
        return (
            <PotComponent key={idx} pressable={pot.pressable} bordered={pot.style.bordered} color={pot.style.color} overlay={pot.style.overlay} potId={idx} size={Animated.multiply(POT_SIZE, scale) as Animated.Value} onPress={() => onPress(idx)} />
        )
    }

    const row = (startId: number, potCount: number) => {
        let pots = Array.from({ length: potCount }, (_, i) => startId + i).map((idx, _) => styledPotComp(idx))
        return (
            <PotRow gap={Animated.multiply(GAP, scale) as Animated.Value}>
                {pots}
            </PotRow>
        )
    }

    const col = (startId: number, potCount: number) => {
        let pots = Array.from({ length: potCount }, (_, i) => startId + i).map((idx, _) => styledPotComp(idx))
        return (
            <PotCol gap={Animated.multiply(GAP, scale) as Animated.Value}>
                {pots}
            </PotCol>
        )
    }

    const mapLayoutToRow = (layout: number[]) => {
        return props.orientation === Orientation.Vertical ? row(layout[0], layout[1]) : col(layout[0], layout[1])
    }

    return (
        <View style={{
            flexDirection: props.orientation === Orientation.Vertical ? 'column' : 'row',
            alignItems: 'center',
        }}>
            {mapLayoutToRow(horizontalFlip ? potLayout[0] : potLayout[3])}
            {mapLayoutToRow(horizontalFlip ? potLayout[1] : potLayout[2])}
            {mapLayoutToRow(horizontalFlip ? potLayout[2] : potLayout[1])}
            {mapLayoutToRow(horizontalFlip ? potLayout[3] : potLayout[0])}
        </View>
    )
}

function PotCol(props: {
    children: ReactNode[] | ReactNode,
    gap: Animated.Value
}) {
    const { children, gap } = props

    return (
        <View style={{
            flexDirection: 'column',
        }}>
            {React.Children.map(children, child => <Animated.View style={{ marginVertical: Animated.divide(gap, 2) }}>{child}</Animated.View>)}
        </View>
    )
}