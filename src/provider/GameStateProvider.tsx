import React, { Dispatch, useState } from 'react'
import { GameState, initTeams, Team } from '../lib/GameState'
import { GameMode } from '../model/GameConfig'

const defaultTeams = initTeams("A", 1, "B", 1)

const GameStateContext = React.createContext<[
    gameState: GameState,
    setGameState: Dispatch<GameState>
]>([
    new GameState(GameMode.Standard, defaultTeams, 0, undefined),
    () => null
])

export const useGameState = () => {
    const context = React.useContext(GameStateContext)

    if (context === undefined) {
        throw new Error("useGameState must be used within a GameStateContext")
    }

    return context!
}

export function GameStateProvider(props: { children: React.ReactNode, gameMode: GameMode, teams: Team[], startTeam: number, gameTime: number | undefined }) {

    const [gameState, setGameState] = useState(new GameState(props.gameMode, props.teams, props.startTeam, props.gameTime))

    return (
        <GameStateContext.Provider value={[gameState, setGameState]}>
            {props.children}
        </GameStateContext.Provider>
    )
}