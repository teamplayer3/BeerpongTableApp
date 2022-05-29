import React, { Fragment } from "react";
import { GestureResponderEvent, TouchableOpacity, View, ViewStyle } from "react-native";
import { Color } from "../model/Color";

const borderWidth = 3
const divideBorder = 1
const borderColor = 'red'

export default function PotComponent(props: {
    potId: number,
    size: number,
    bordered: boolean,
    color: Color,
    overlay: any,
    onPress: () => void,
    pressable?: boolean
}) {
    const { potId, size, onPress } = props
    const innerSize = size - 2 * borderWidth - 2 * divideBorder

    const innerStyle: (color: Color) => ViewStyle = (color: Color) => ({
        position: 'absolute',
        left: borderWidth + divideBorder,
        top: borderWidth + divideBorder,
        backgroundColor: color.toHexString(),
        width: innerSize,
        height: innerSize,
        borderRadius: innerSize / 2,
    })

    const borderStyle: ViewStyle = {
        width: size,
        height: size,
        position: 'absolute',
        borderRadius: size / 2,
        left: 0,
        top: 0,
        borderStyle: "solid",
        borderWidth: borderWidth,
        borderColor: borderColor
    }

    const touchableStyle: ViewStyle = {
        position: 'relative',
        width: size,
        height: size,
        borderRadius: size / 2
    }

    const onPressInner = (event: GestureResponderEvent) => {
        event.persist()
        onPress()
    }

    return (
        <TouchableOpacity style={touchableStyle} onPress={onPressInner} disabled={!props.pressable}>
            {props.bordered ? <View style={borderStyle} /> : <Fragment />}
            <View style={innerStyle(props.color)} />
        </TouchableOpacity>
    )

}