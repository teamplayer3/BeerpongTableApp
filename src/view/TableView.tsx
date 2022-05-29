import React, { useEffect } from 'react'
import { Text, View } from "react-native";
import { PotLayout } from '../components/PotLayout';
import { Color } from '../model/Color';
import { useGameState } from '../provider/GameStateProvider';
import { logObjStruct } from '../util/Utils';



export default function TableView() {

    const [gameState, setGameState] = useGameState();

    const onPress = (idx: number, tableIdx: number) => {
        const pot = {
            id: idx,
            teamId: tableIdx
        }
        const newGameState = gameState
        const actions = newGameState.clickPot(pot)
        newGameState.selectedClickPotAction(pot, actions[0])
        logObjStruct(newGameState.teams[pot.teamId])
        setGameState({
            ...newGameState
        })
    }

    return (
        <View style={{
            height: "100%",
            flexDirection: 'column',
            justifyContent: 'space-between'
        }}>
            <View style={{
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                <PotLayout onPress={(idx) => onPress(idx, 0)} potStyleMapping={(idx) => { return { bordered: false, color: Color.red(), overlay: undefined } }} horizontalFlip />
            </View>
            <View style={{
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                <PotLayout onPress={(idx) => onPress(idx, 0)} potStyleMapping={(idx) => { return { bordered: false, color: Color.red(), overlay: undefined } }} />
            </View>
        </View>
    )
}