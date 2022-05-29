import { View } from "react-native"
import React from "react"
import { GameStatistics } from "../model/GameStatistics"

export const GameStatsView = (props: {
    gameStatistics: GameStatistics
}) => {

    return (
        <View>
            {props.gameStatistics}
        </View>
    )
}