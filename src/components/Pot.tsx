import React, { Fragment } from "react";
import { Animated, GestureResponderEvent, TouchableOpacity, View, ViewStyle } from "react-native";
import { Color } from "../model/Color";

const borderWidth = 3
const divideBorder = 1
const borderColor = 'red'

export default function PotComponent(props: {
    potId: number,
    size: Animated.Value,
    bordered: boolean,
    color: Color,
    overlay: any,
    onPress: () => void,
    pressable?: boolean
}) {
    const { potId, size, onPress } = props
    const innerSize = Animated.subtract(size, 2 * borderWidth - 2 * divideBorder)
    const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity)

    const halfSize = Animated.divide(size, 2)

    const onPressInner = (event: GestureResponderEvent) => {
        event.persist()
        onPress()
    }

    return (
        <AnimatedTouchable style={{
            position: 'relative',
            width: size,
            height: size,
            borderRadius: halfSize
        }} onPress={onPressInner} disabled={!props.pressable}>
            {props.bordered ? <Animated.View style={{
                width: size,
                height: size,
                position: 'absolute',
                borderRadius: halfSize,
                left: 0,
                top: 0,
                borderStyle: "solid",
                borderWidth: borderWidth,
                borderColor: borderColor
            }} /> : <Fragment />}
            <Animated.View style={{
                position: 'absolute',
                left: borderWidth + divideBorder,
                top: borderWidth + divideBorder,
                backgroundColor: props.color.toHexString(),
                width: innerSize,
                height: innerSize,
                borderRadius: Animated.divide(innerSize, 2),
            }} />
        </AnimatedTouchable>

    )

}