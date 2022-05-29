import React, { ReactNode } from "react";
import { ColorValue, Pressable, View } from "react-native";



export default function CenterOverlay(props: {
    children: ReactNode[] | ReactNode,
    backgroundColor?: ColorValue | undefined,
    onPressAway?: () => void
}) {

    const borderRadius = 20;

    return (
        <View style={{
            position: "absolute",
            height: "100%",
            width: "100%",
        }}>
            <Pressable style={{
                position: "absolute",
                height: "100%",
                width: "100%",
                backgroundColor: "black",
                opacity: 0.5,
            }} onPress={props.onPressAway} />
            <View style={{
                position: "absolute",
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}>
                <View style={{
                    borderRadius: borderRadius,
                    backgroundColor: props.backgroundColor,
                    minHeight: 100,
                    minWidth: 100,
                }}>
                    {props.children}
                </View>
            </View>

        </View>

    )
}