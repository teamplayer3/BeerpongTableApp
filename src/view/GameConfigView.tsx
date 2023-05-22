import { BackHandler, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
import React, { ReactNode, useEffect, useState } from "react";
import { Divider, IconButton, useTheme } from "react-native-paper";
import InputSpinner from "react-native-input-spinner";
import GameConfig, { GameMode, gameModeAsString } from "../model/GameConfig";
import { Picker } from "@react-native-picker/picker";
import { HeaderBar } from "../components/HeaderBar";
import { Button } from "../components/Button";

import Row from "../components/Row";
import { Player } from "../model/PlayerStore";
import { PlayerSelector } from "./PlayerSelect";
import { GameConfigProvider, useGameConfig } from "../provider/GameConfigProvider";
import { Portal } from "@gorhom/portal";
import FullScreenOverlay from "../components/FullScreenOverlay";
import Collapsable, { Body, Header } from "../components/Collapsable";
import Fullscreen from "../components/FullScreen";


export default function GameConfigView(props: {
    onCloseConfig: () => void,
    onStartGame: (gameConfig: GameConfig) => void
}) {
    useEffect(() => {
        let sub = BackHandler.addEventListener("hardwareBackPress", () => {
            props.onCloseConfig()
            return true
        })
        return () => {
            sub.remove()
        }
    })

    return (
        <GameConfigProvider>
            <GameConfigViewInner {...props} />
        </GameConfigProvider>
    )
}

function GameConfigViewInner(props: {
    onCloseConfig: () => void,
    onStartGame: (gameConfig: GameConfig) => void
}) {

    const theme = useTheme()
    const [gameConfig, setGameConfig] = useGameConfig()

    const availableGameModes = (): ReactNode[] => {
        return Object.values(GameMode).filter(mode => typeof mode === "number").map(mode => (
            <Picker.Item label={gameModeAsString(mode as GameMode)} value={mode} key={mode} />
        ))
    }

    return (
        <Fullscreen backgroundColor={theme.colors.background}>
            <HeaderBar headerLabel="Spiel Config" onClose={props.onCloseConfig} />


            <SafeAreaView style={{
                marginVertical: 20
            }}>
                <ScrollView>
                    <View style={{
                        display: "flex",
                        flexDirection: "column",
                        paddingHorizontal: 30,
                    }}>


                        <TeamsConfig />
                        <View style={{ height: 20 }} />

                        <ConfigRow text="Spielmodus" fixedWidth={200}>
                            <Picker placeholder="Modus" selectedValue={gameConfig.gameMode} onValueChange={(itemValue, itemIndex) => setGameConfig((config) => {
                                config.gameMode = itemValue
                                return config
                            })}>
                                {availableGameModes()}
                            </Picker>
                        </ConfigRow>
                        <ConfigRow text="Maximale Zeit">
                            <InputSpinner textColor="white" min={1} step={5} value={gameConfig.maxPlayTime} onChange={(num: number) => setGameConfig((config) => {
                                config.maxPlayTime = num
                                return config
                            })} />
                        </ConfigRow>
                        <ConfigRow text="Bälle pro Team">
                            <InputSpinner textColor="white" min={1} step={1} value={gameConfig.ballsPerTeam} onChange={(num: number) => setGameConfig((config) => {
                                config.ballsPerTeam = num
                                return config
                            })} />
                        </ConfigRow>



                    </View>

                    <View style={{ height: 150 }}></View>
                </ScrollView>
            </SafeAreaView>


            <View style={{
                position: "absolute",
                bottom: 30,
                width: "100%",
                elevation: 5,
                shadowColor: "white"
            }}>
                <Button title="Starten" onPress={() => props.onStartGame(gameConfig)} horizontalCentered />
            </View>
        </Fullscreen>
    )
}

const ConfigRow = (props: {
    children: ReactNode,
    text: string,
    fixedWidth?: number | string
}) => {
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

const TeamsConfig = (props: {}) => {

    return (
        <View>
            <TeamConfig team={"teamA"} />
            <View style={{ height: 20 }} />
            <TeamConfig team={"teamB"} />
        </View>

    )
}

const TeamConfig = (props: {
    team: "teamA" | "teamB",
}) => {

    const [gameConfig, setGameConfig] = useGameConfig();
    const [teamName, setTeamName] = useState(gameConfig.getTeamName(props.team))
    const [selectPlayer, setSelectPlayer] = useState(false)
    const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([])

    const renderedPlayer = (player: Player, onDelete: (player: Player) => void) => {
        return (
            <Row stretch verticalCentered key={player.id}>
                <Text>{player.name}</Text>
                <IconButton color="white" icon={"close"} onPress={() => onDelete(player)} />
            </Row>
        )
    }

    const renderedPlayers = (players: Player[]) => {
        return players.map((player) => renderedPlayer(player, onRemovePlayer))
    }

    const onRemovePlayer = (player: Player) => {
        setGameConfig((config) => {
            config.removeTeamPlayer(props.team, player)
            return config
        })
        setSelectedPlayers((players) => players.filter((p) => p.id !== player.id))
    }

    const onChangeName = (name: string) => {
        setGameConfig((config) => {
            config.updateTeamName(props.team, name)
            return config
        })
        setTeamName(name)
    }

    const onSelectPlayer = (player: Player) => {
        setSelectPlayer(false)
        setGameConfig((config) => {
            config.addTeamPlayer(props.team, player)
            return config
        })
        setSelectedPlayers((players) => players.concat(player))
    }

    return (
        <Collapsable backgroundColor="gray">
            {{
                header: (
                    <Header>
                        <Text>Team <Text style={{ fontWeight: "bold" }}>{gameConfig.getTeamName(props.team)}</Text></Text>
                    </Header>
                ),
                body: (
                    <Body>
                        <Row verticalCentered>
                            <Text>Team Name: </Text>
                            <TextInput style={{
                                flex: 1,
                                borderColor: "white",
                                borderBottomWidth: 1,
                                padding: 0
                            }} value={teamName} onChangeText={onChangeName} />
                        </Row>

                        <View style={{ height: 20 }}></View>

                        <Text>Team Mitglieder:</Text>

                        <Divider />

                        {renderedPlayers(selectedPlayers)}

                        <Button title="Auswählen" horizontalCentered onPress={() => setSelectPlayer(true)} />

                        {
                            selectPlayer &&
                            <Portal>
                                <FullScreenOverlay backgroundColor="black">
                                    <PlayerSelector
                                        filteredPlayers={gameConfig.getAllSelectedPlayers()}
                                        onClosePlayerSelection={() => setSelectPlayer(false)}
                                        onSelectPlayer={onSelectPlayer}
                                    />
                                </FullScreenOverlay>
                            </Portal>
                        }
                    </Body>
                )
            }}
        </Collapsable>
    )
}


