import { GameState, GameStateSnapshot } from "./GameState";




export class GameReplayBuffer {
    buffer: GameStateSnapshot[]
    maxReplays: number

    constructor(maxReplays: number) {
        this.buffer = []
        this.maxReplays = maxReplays
    }

    pushGameState = (gameState: GameStateSnapshot) => {
        if (this.buffer.length >= this.maxReplays) {
            this.buffer.slice()
        }
        this.buffer.push(gameState)
    }

    popGameState = (): GameStateSnapshot | undefined => {
        return this.buffer.pop()
    }

    length = () => {
        return this.buffer.length
    }

}
