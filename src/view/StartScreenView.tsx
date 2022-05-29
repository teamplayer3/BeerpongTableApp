import { Button, Text, View } from "react-native";
import React from "react";




export default function StartScreenView(props: {
    onStart: () => void
}) {



    return (
        <View>
            <View style={{
                display: "flex",
                height: "100%",
                flexDirection: "column",
                alignItems: "center",
            }}>
                <Text style={{
                    marginVertical: 40,
                    fontSize: 40,
                    fontWeight: "bold"
                }}>Beer Pong</Text>
                <View style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    flexGrow: 1
                }}>
                    <Button onPress={props.onStart} title="Start">Start</Button>
                </View>
            </View>

        </View>
    )
}