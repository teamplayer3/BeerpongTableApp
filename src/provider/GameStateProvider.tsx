import React, { Dispatch, SetStateAction, useState } from 'react'
import { GameState, initTeams, Team } from '../lib/GameState'
import GameConfig, { GameMode } from '../model/GameConfig'

const defaultTeams = initTeams("A", 1, "B", 1)

const GameStateContext = React.createContext<[
    gameState: GameState,
    setGameState: Dispatch<SetStateAction<GameState>>
]>([
    new GameState(defaultTeams, 0, undefined, {
        ballsPerTeam: 1,
        gameMode: GameMode.Standard,
        maxPlayTime: undefined,
        playersPerGame: 1
    }),
    () => null
])

export const useGameState = () => {
    const context = React.useContext(GameStateContext)

    if (context === undefined) {
        throw new Error("useGameState must be used within a GameStateContext")
    }

    return context!
}

export function GameStateProvider(props: { children: React.ReactNode, gameConfig: GameConfig, teams: Team[], startTeam: number, gameTime: number | undefined }) {

    const [gameState, setGameState] = useState(new GameState(props.teams, props.startTeam, props.gameTime, props.gameConfig))

    return (
        <GameStateContext.Provider value={[gameState, setGameState]}>
            {props.children}
        </GameStateContext.Provider>
    )
}