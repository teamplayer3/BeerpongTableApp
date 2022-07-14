import React, { Dispatch, SetStateAction, useState } from "react"
import { GameReplayBuffer } from "../lib/GameReplayBuffer"

const DEFAULT_REPLAY_BUFFER_LEN = 10

const GameReplayBufferContext = React.createContext<[
    gameReplayBuffer: GameReplayBuffer,
    setGameReplayBuffer: Dispatch<SetStateAction<GameReplayBuffer>>
]>([
    new GameReplayBuffer(DEFAULT_REPLAY_BUFFER_LEN),
    () => null
])

export const useGameReplayBuffer = () => {
    const context = React.useContext(GameReplayBufferContext)

    if (context === undefined) {
        throw new Error("useGameReplayBuffer must be used within a GameReplayBufferContext")
    }

    return context!
}

export function GameReplayBufferProvider(props: { children: React.ReactNode, replayBufferLen: number }) {

    const [gameReplayBuffer, setGameReplayBuffer] = useState(new GameReplayBuffer(props.replayBufferLen))

    return (
        <GameReplayBufferContext.Provider value={[gameReplayBuffer, setGameReplayBuffer]}>
            {props.children}
        </GameReplayBufferContext.Provider>
    )
}