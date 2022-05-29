import { GameMode } from "./GameConfig"



interface Team {
    id: number,
    playerCount: number,
    name: string,
}

interface TeamStats {
    teamId: number,
    shotAccuracy: number,
    remainingCups: number
}

export interface GameStatistics {
    gameMode: GameMode,
    teams: Team[],
    teamWon: number,
    teamStats: TeamStats[]
}