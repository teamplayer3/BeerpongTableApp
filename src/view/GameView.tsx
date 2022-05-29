import React, { useEffect, useState } from "react";
import { Button, Pressable, Text, View } from "react-native";
import { IconButton } from "react-native-paper";
import CenterOverlay from "../components/CenterOverlay";
import { StyledPot } from "../components/PotLayout";
import { ClickPotAction, clickPotActionToString, isPotFullyShot, SpecificPot, Team } from "../lib/GameState";
import { Color } from "../model/Color";
import { GameMode } from "../model/GameConfig";
import { GameStatistics } from "../model/GameStatistics";
import { GameStateProvider, useGameState } from "../provider/GameStateProvider";
import { useTableConnection } from "../provider/TableConnectionProvider";
import { TableView, ViewFocus } from "./TableView";
import Package from "../model/Package"


export function GameView(props: {
    gameMode: GameMode,
    teams: Team[],
    gameTime: number | undefined,
    startTeam: number,
    onGameEnd: (gameStats: GameStatistics) => void
}) {


    return (
        <GameStateProvider gameMode={props.gameMode} teams={props.teams} gameTime={props.gameTime} startTeam={props.startTeam}>
            <GameTable onGameEnd={props.onGameEnd} />
        </GameStateProvider>
    )
}

function GameTable(props: {
    onGameEnd: (gameStats: GameStatistics) => void
}) {

    const [gameState, setGameState] = useGameState();
    const [viewFocus, setViewFocus] = useState(ViewFocus.FullTable);
    const tableConnection = useTableConnection();
    const [showOptionMenu, setShowOptionMenu] = useState<{
        show: boolean,
        targetPot: SpecificPot | undefined,
        options: ClickPotAction[]
    }>({
        show: false,
        targetPot: undefined,
        options: []
    })

    useEffect(() => {
        console.log("Called")
        switchSideViewBasedOnTeamId(gameState.currentTeamId)

        return () => { }
    }, [gameState.currentTeamId])

    const toggleFullScreen = () => {
        if (viewFocus === ViewFocus.FullTable) {
            switchSideViewBasedOnTeamId(gameState.currentTeamId)
        } else {
            setViewFocus(ViewFocus.FullTable)
        }
    }

    const switchSideViewBasedOnTeamId = (id: number) => {
        console.log("switch for team " + id)
        switch (id) {
            case 0: setViewFocus(ViewFocus.TeamBottom);
                break;
            case 1: setViewFocus(ViewFocus.TeamTop);
                break
        }
    }

    const onPressPot = (pot: SpecificPot) => {
        tableConnection.send(Package.setPotColors([pot], Color.blue()).pack())
        const newGameState = gameState
        const actions = newGameState.clickPot(pot)
        setGameState({
            ...newGameState
        })
        setShowOptionMenu({
            ...showOptionMenu,
            show: true,
            targetPot: pot,
            options: actions,
        })
    }

    const selectedOption = (option: ClickPotAction) => {
        setGameState((gameState) => {
            gameState.selectedClickPotAction(showOptionMenu.targetPot!, option)
            return {
                ...gameState
            }
        })
        setShowOptionMenu({
            ...showOptionMenu,
            targetPot: undefined,
            options: [],
            show: false
        })
    }

    useEffect(() => {
        const teamLost = gameState.teamHasWon();
        if (teamLost !== undefined) {
            const stats = gameState.createGameStatistics()!
            props.onGameEnd(stats)
        }
        return () => {

        }
    }, [gameState.teamHasWon()])

    const renderOptionList = () => {
        const width = 300;
        return showOptionMenu.options.map((option) => (
            <View key={clickPotActionToString(option)} style={{
                width: width,
                height: 100,
                alignItems: "center",
            }}>
                <Pressable style={{
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    padding: 10
                }} android_ripple={{
                    color: "gray",
                    radius: width / 2
                }} onPress={() => selectedOption(option)}>
                    <Text style={{
                        fontSize: 20
                    }}>{clickPotActionToString(option)}</Text>
                </Pressable>
            </View>

        ))
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

    return (
        <View style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
        }}>
            <TableView viewFocus={viewFocus} onPressPot={onPressPot} potsBottom={potStyleMapping(1)} potsTop={potStyleMapping(0)} />

            <BottomInfoView onToggleFullScreen={toggleFullScreen} collapsed={viewFocus === ViewFocus.FullTable} currentTeam={gameState.currentTeam().name} />

            {
                showOptionMenu.show &&
                <CenterOverlay backgroundColor={"green"} onPressAway={() => setShowOptionMenu({
                    ...showOptionMenu,
                    options: [],
                    show: false,
                    targetPot: undefined
                })}>
                    <View style={{
                        display: "flex",
                        flexDirection: "column",
                        padding: 20,
                    }}>
                        {renderOptionList()}
                    </View>
                </CenterOverlay>
            }

        </View>
    )
}

const BottomInfoView = (props: {
    currentTeam: string,
    collapsed: boolean,
    onToggleFullScreen: () => void
}) => {
    return (
        <View style={{ backgroundColor: "green", padding: 20, borderTopRightRadius: 20, borderTopLeftRadius: 20 }}>
            <View style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
            }}>
                <Text>Team {props.currentTeam} wirft</Text>
                <IconButton icon={!props.collapsed ? "fullscreen" : "fullscreen-exit"} onPress={props.onToggleFullScreen}></IconButton>
            </View>
            {
                !props.collapsed &&
                <View style={{ height: 300 }}>

                </View>
            }

        </View>
    )
}