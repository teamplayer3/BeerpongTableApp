import React, { ReactNode } from "react"
import { View } from "react-native"


export default function PotRow(props: {
    children: ReactNode[] | ReactNode,
    gap: number
}) {
    const { children, gap } = props

    return (
        <View style={{
            flexDirection: 'row',
        }}>
            {React.Children.map(children, child => <View style={{ marginHorizontal: gap / 2 }}>{child}</View>)}
        </View>
    )
}