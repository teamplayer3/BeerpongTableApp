import { Button, StyleProp, Text, TextStyle, View } from "react-native"
import React from "react"
import { GameStatistics } from "../model/GameStatistics"

export const GameStatsView = (props: {
    gameStatistics: GameStatistics,
    onQuitStatistics: () => void
}) => {


    const teamWonLine = () => {
        const textStyle: StyleProp<TextStyle> = {
            fontSize: 20,
        }
        return (
            <View style={{ display: "flex", flexDirection: "row" }}>
                <Text style={textStyle}>Team </Text>
                <Text style={{ fontWeight: "bold", ...textStyle }}>{props.gameStatistics.teamWonName}</Text>
                <Text style={textStyle}> has won</Text>
            </View>
        )
    }

    return (
        <View>
            {teamWonLine()}
            <Button title="Fertig" onPress={props.onQuitStatistics}></Button>
        </View>
    )
}