import { Observer } from "mobx-react";
import React, { Fragment } from "react";
import { GestureResponderEvent, TouchableOpacity, View, ViewStyle } from "react-native";
import { Color } from "../model/Color";
import { Pot } from "../model/Pot";


const borderWidth = 3
const divideBorder = 1

export default function TabelPotView(props: {
    pot: Pot
    size: number
    onPress: (pot: Pot) => void
}) {
    const {pot, size, onPress} = props
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
        borderColor: 'red'
    }

    const touchableStyle: ViewStyle = {
        position: 'relative',
        width: size,
        height: size,
        borderRadius: size / 2
    }

    const onPressInner = (event: GestureResponderEvent) => {
        event.persist()
        onPress(pot)
    }

    return (
        <TouchableOpacity style={touchableStyle} onPress={onPressInner}>
            <Observer>
                {() => pot.observer_selected.get() === true ? <View style={borderStyle}/> : <Fragment/>}
            </Observer>
            <Observer>
                {() => <View style={innerStyle(pot.observer_color.get())}/>}
            </Observer>
        </TouchableOpacity>
    )

}