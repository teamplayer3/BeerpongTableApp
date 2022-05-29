import { Button, FlexStyle, SafeAreaView, ScrollView, Text, View } from "react-native";
import React, { createContext, Dispatch, ReactNode, useContext, useReducer, useState } from "react";
import { IconButton } from "react-native-paper";
import InputSpinner from "react-native-input-spinner";
import GameConfig, { GameMode, gameModeAsString } from "../model/GameConfig";
import { Picker } from "@react-native-picker/picker";

const GameConfigContext = createContext<{
    gameConfig: GameConfig,
    setGameConfig: Dispatch<Partial<GameConfig>>
}>({
    gameConfig: new GameConfig(),
    setGameConfig: () => null
});

function gameConfigReducer(state: GameConfig, newState: Partial<GameConfig>) {
    return { ...state, ...newState }
}

export default function GameConfigView(props: {
    onCloseConfig: () => void,
    onStartGame: (gameConfig: GameConfig) => void
}) {

    const [gameConfig, setGameConfig] = useReducer(gameConfigReducer, new GameConfig())

    const availableGameModes = (): ReactNode[] => {
        return Object.values(GameMode).filter(mode => typeof mode === "number").map(mode => (
            <Picker.Item label={gameModeAsString(mode as GameMode)} value={mode} key={mode} />
        ))
    }

    return (
        <View>
            <View style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                height: 70,
                backgroundColor: "grey"
            }}>
                <IconButton style={{
                    position: "absolute",
                    left: 10,
                }} icon="close" size={30} onPress={props.onCloseConfig}></IconButton>
                <Text style={{
                    fontSize: 30,
                }}>Game Config</Text>
            </View>

            <GameConfigContext.Provider value={{ gameConfig, setGameConfig }}>
                <SafeAreaView style={{
                    marginHorizontal: 30,
                    marginTop: 20
                }}>
                    <ScrollView>
                        <View style={{
                            display: "flex",
                            flexDirection: "column",
                        }}>
                            <ConfigRow text="Spieler pro Team">
                                <InputSpinner textColor="white" min={1} step={1} value={gameConfig.playersPerGame} onChange={(num: number) => setGameConfig({
                                    ...gameConfig,
                                    playersPerGame: num
                                })} />
                            </ConfigRow>
                            <ConfigRow text="Maximale Zeit">
                                <InputSpinner textColor="white" min={1} step={5} value={gameConfig.maxPlayTime} onChange={(num: number) => setGameConfig({
                                    ...gameConfig,
                                    maxPlayTime: num
                                })} />
                            </ConfigRow>
                            <ConfigRow text="Spielmodus" fixedWidth={200}>
                                <Picker placeholder="Modus" selectedValue={gameConfig.gameMode} onValueChange={(itemValue, itemIndex) => setGameConfig({
                                    gameMode: itemValue
                                })}>
                                    {availableGameModes()}
                                </Picker>
                            </ConfigRow>


                        </View>
                    </ScrollView>
                </SafeAreaView>
            </GameConfigContext.Provider>
            <Button title="Starten" onPress={() => props.onStartGame(gameConfig)}>Starten</Button>
        </View >
    )
}

const ConfigRow = (props: {
    children: ReactNode,
    text: string,
    fixedWidth?: number | string
}) => {
    const { gameConfig, setGameConfig } = useContext(GameConfigContext);

    return (
        <View style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 5,
            height: 50,
            justifyContent: "space-between"
        }}>
            <Text style={{
                flexGrow: 1,
                fontSize: 20
            }}>{props.text}</Text>
            <View style={{
                width: props.fixedWidth
            }}>
                {props.children}
            </View>
        </View>
    )
}