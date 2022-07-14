import React, { useEffect, useRef, useState } from "react";
import { Animated, Text, View } from "react-native";
import { IconButton } from "react-native-paper";
import { Orientation, StyledPot } from "../components/PotLayout";
import { isPotFullyShot, ShotType, SpecificPot, Team } from "../lib/GameState";
import { Color } from "../model/Color";
import GameConfig from "../model/GameConfig";
import { GameStatistics } from "../model/GameStatistics";
import { GameStateProvider, useGameState } from "../provider/GameStateProvider";
import { useTableConnection } from "../provider/TableConnectionProvider";
import { TableView, ViewFocus } from "./TableView";
import Package from "../model/Package"
import CustomIcon from "../icons/CustomIcon";
import { GameReplayBufferProvider, useGameReplayBuffer } from "../provider/GameReplayBufferProvider";
import { cloneDeep } from "lodash";
import { logObjStruct } from "../util/Utils";


export function GameView(props: {
    gameConfig: GameConfig,
    teams: Team[],
    gameTime: number | undefined,
    startTeam: number,
    onGameEnd: (gameStats: GameStatistics) => void
}) {


    return (
        <GameReplayBufferProvider replayBufferLen={10}>
            <GameStateProvider gameConfig={props.gameConfig} teams={props.teams} gameTime={props.gameTime} startTeam={props.startTeam}>
                <GameTable onGameEnd={props.onGameEnd} />
            </GameStateProvider>
        </GameReplayBufferProvider>

    )
}

function GameTable(props: {
    onGameEnd: (gameStats: GameStatistics) => void
}) {

    const [gameState, setGameState] = useGameState();
    const [gameReplayBuffer, setGameReplayBuffer] = useGameReplayBuffer()
    const [viewFocus, setViewFocus] = useState(ViewFocus.FullTable);
    const tableConnection = useTableConnection();
    const [shotTypeSelected, setShotTypeSelected] = useState<ShotType>(ShotType.Normal)
    const [tableOrientation, setTableOrientation] = useState<Orientation>(Orientation.Horizontal)

    useEffect(() => {
        switchSideViewBasedOnTeamId(gameState.currentTeam().id)
    }, [gameState.currentTeam()])

    useEffect(() => {
        const teamLost = gameState.teamHasWon();
        if (teamLost !== undefined) {
            const stats = gameState.createGameStatistics()!
            props.onGameEnd(stats)
        }
    }, [gameState.teamHasWon()])

    const toggleFullScreen = () => {
        if (viewFocus === ViewFocus.FullTable) {
            switchSideViewBasedOnTeamId(gameState.currentTeam().id)
        } else {
            setViewFocus(ViewFocus.FullTable)
        }
    }

    const switchSideViewBasedOnTeamId = (id: number) => {
        switch (id) {
            case 0: setViewFocus(ViewFocus.TeamBottom);
                break;
            case 1: setViewFocus(ViewFocus.TeamTop);
                break
        }
    }

    const onPressPot = (pot: SpecificPot) => {
        tableConnection.send(Package.setPotColors([pot], Color.blue()).pack())
        let snapshot = gameState.createSnapShot()
        gameState.shotPot(pot, shotTypeSelected)
        setGameState({
            ...gameState
        })

        gameReplayBuffer.pushGameState(snapshot)
        setGameReplayBuffer({
            ...gameReplayBuffer
        })
    }

    const potStyleMapping = (tableSide: number): StyledPot[] => {
        return gameState.getTeam(tableSide)!.pots.map((pot) => {
            return {
                potId: pot.id,
                style: {
                    color: isPotFullyShot(pot) ? Color.green() : Color.red(),
                    bordered: false,
                    overlay: undefined
                },
                pressable: viewFocus !== ViewFocus.FullTable
            }
        })
    }

    const onNoHit = () => {
        let snapshot = gameState.createSnapShot()!
        gameState.notHitPot()
        setShotTypeSelected(ShotType.Normal)
        setGameState({
            ...gameState
        })

        gameReplayBuffer.pushGameState(snapshot)
        setGameReplayBuffer({
            ...gameReplayBuffer
        })
    }

    const toggleTableOrientation = () => {
        switch (tableOrientation) {
            case Orientation.Horizontal: setTableOrientation(Orientation.Vertical)
                break
            case Orientation.Vertical: setTableOrientation(Orientation.Horizontal)
                break
        }
    }

    const replayGameState = () => {
        let lastGameState = gameReplayBuffer.popGameState()!
        setGameReplayBuffer({
            ...gameReplayBuffer
        })
        gameState.setFromSnapShot(lastGameState)
        setGameState({
            ...gameState
        })

    }

    return (
        <View style={{
            height: "100%",
            paddingTop: 40,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative"
        }}>
            <View style={{ width: "100%", position: "absolute", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                <IconButton icon={"crop-rotate"} color="white" onPress={toggleTableOrientation}></IconButton>
                <IconButton icon={"undo"} disabled={gameReplayBuffer.length() === 0} color="white" onPress={replayGameState}></IconButton>
            </View>
            <View style={{
                flexDirection: "column",
                alignItems: "center"
            }}>
                <TableView labels={[gameState.getTeam(0)?.name, gameState.getTeam(1)?.name]} tableOrientation={tableOrientation} viewFocus={viewFocus} onPressPot={onPressPot} potsBottom={potStyleMapping(1)} potsTop={potStyleMapping(0)} />
            </View>

            <BottomInfoView selectedShotType={shotTypeSelected} onSelectShotType={(shotType) => setShotTypeSelected(shotType)} nthShot={gameState.getTeamShotCount()} maxShotsPerTeam={gameState.gameConfig.ballsPerTeam} onNoHit={onNoHit} onToggleFullScreen={toggleFullScreen} collapsed={viewFocus === ViewFocus.FullTable} currentTeam={gameState.currentTeam().name} />
        </View>
    )
}

const BottomInfoView = (props: {
    currentTeam: string,
    nthShot: number,
    maxShotsPerTeam: number
    collapsed: boolean,
    selectedShotType: ShotType,
    onSelectShotType: (shotType: ShotType) => void,
    onNoHit: () => void,
    onToggleFullScreen: () => void
}) => {
    const BODY_HIGHT = 300
    const animate = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (props.collapsed) {
            slideDown()
        } else {
            slideUp()
        }
    }, [props.collapsed])

    const slideUp = () => {
        Animated.timing(animate, {
            toValue: BODY_HIGHT,
            duration: 250,
            useNativeDriver: false
        }).start()
    }

    const slideDown = () => {
        Animated.timing(animate, {
            toValue: 0,
            duration: 250,
            useNativeDriver: false
        }).start()
    }

    return (
        <View style={{ width: "100%", position: "absolute", bottom: 0, backgroundColor: "gray", paddingHorizontal: 20, borderTopRightRadius: 20, borderTopLeftRadius: 20 }}>
            <View style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginVertical: 20
            }}>
                <Text style={{ fontSize: 20 }}>Team {props.currentTeam} wirft</Text>
                <Text style={{ fontSize: 20 }}>Wurf: {props.nthShot + 1}/{props.maxShotsPerTeam}</Text>
                <IconButton icon={!props.collapsed ? "fullscreen" : "fullscreen-exit"} onPress={props.onToggleFullScreen}></IconButton>
            </View>

            <Animated.View style={{ height: animate, width: "100%" }}>
                <View style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
                    <View style={{ display: "flex", flexDirection: "row" }}>
                        <IconButton icon={(args) => <CustomIcon name="normal-shot" {...args}></CustomIcon>} onPress={() => props.onSelectShotType(ShotType.Normal)} color={props.selectedShotType === ShotType.Normal ? "green" : "black"} size={40}></IconButton>
                        <IconButton icon={(args) => <CustomIcon name="bouncing-ball" {...args}></CustomIcon>} onPress={() => props.onSelectShotType(ShotType.Bounce)} color={props.selectedShotType === ShotType.Bounce ? "green" : "black"} size={40}></IconButton>
                        <IconButton icon={(args) => <CustomIcon name="trick-shot" {...args}></CustomIcon>} onPress={() => props.onSelectShotType(ShotType.Trick)} color={props.selectedShotType === ShotType.Trick ? "green" : "black"} size={40}></IconButton>
                    </View>

                    <View style={{ height: "100%", width: 2, backgroundColor: "#a8a8a8" }}></View>
                    <IconButton icon={(args) => <CustomIcon name="not-hit-shot" {...args}></CustomIcon>} onPress={props.onNoHit} color={"#c73e3e"} size={40}></IconButton>
                    <IconButton icon={(args) => <CustomIcon name="ball-roll-back" {...args}></CustomIcon>} onPress={props.onNoHit} color={"#c73e3e"} size={40}></IconButton>
                </View>
            </Animated.View>

        </View>
    )
}