import { isUndefined } from "lodash";
import React, { useState } from "react";
import { LayoutChangeEvent, LayoutRectangle, Text, TextStyle, View } from "react-native";




export default function RotatedText(props: {
    counterClockWise?: boolean,
    style?: TextStyle,
    children: string
}) {
    const counterClockWise = isUndefined(props.counterClockWise) ? false : props.counterClockWise
    const [layout, setLayout] = useState<LayoutRectangle | undefined>(undefined)

    const onLayout = (event: LayoutChangeEvent) => {
        if (isUndefined(layout)) {
            setLayout(event.nativeEvent.layout)
        }
    }

    return (
        <Text onLayout={onLayout} style={{
            ...props.style,
            opacity: layout ? 1 : 0,
            transform: [
                { translateX: layout ? ((layout.width / 2) - (layout.height / 2)) * (counterClockWise ? 1 : -1) : 0 }, {
                    rotate: layout ? counterClockWise ? "90deg" : "-90deg" : "0deg",
                }],
        }}>
            {props.children}
        </Text>
    )
}