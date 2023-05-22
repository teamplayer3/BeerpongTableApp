import React, { Dispatch, SetStateAction, useState } from 'react'
import { GameState, initTeams, Team } from '../lib/GameState'
import GameConfig, { GameMode } from '../model/GameConfig'

const GameStateContext = React.createContext<[
    gameState: GameState,
    setGameState: Dispatch<SetStateAction<GameState>>
]>([
    new GameState(0, new GameConfig()),
    () => null
])

export const useGameState = () => {
    const context = React.useContext(GameStateContext)

    if (context === undefined) {
        throw new Error("useGameState must be used within a GameStateContext")
    }

    return context!
}

export function GameStateProvider(props: { children: React.ReactNode, gameConfig: GameConfig, startTeam: number }) {

    const [gameState, setGameState] = useState(new GameState(props.startTeam, props.gameConfig))

    return (
        <GameStateContext.Provider value={[gameState, setGameState]}>
            {props.children}
        </GameStateContext.Provider>
    )
}