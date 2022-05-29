import React, { useEffect } from "react";
import { View } from "react-native";
import { Team } from "../lib/GameState";
import { GameMode } from "../model/GameConfig";
import { GameStatistics } from "../model/GameStatistics";
import { GameStateProvider, useGameState } from "../provider/GameStateProvider";
import TableView from "./TableView";



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

    useEffect(() => {
        const teamLost = gameState.teamHasWon();
        if (teamLost !== undefined) {
            const stats = gameState.createGameStatistics()!
            props.onGameEnd(stats)
        }
        return () => {

        }
    }, [gameState.teamHasWon()])

    return (
        <View>
            <TableView />
        </View>
    )
}