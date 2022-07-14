import React, { ReactNode } from "react"
import { Animated, View } from "react-native"


export default function PotRow(props: {
    children: ReactNode[] | ReactNode,
    gap: Animated.Value
}) {
    const { children, gap } = props

    return (
        <View style={{
            flexDirection: 'row',
        }}>
            {React.Children.map(children, child => <Animated.View style={{ marginHorizontal: Animated.divide(gap, 2) }}>{child}</Animated.View>)}
        </View>
    )
}