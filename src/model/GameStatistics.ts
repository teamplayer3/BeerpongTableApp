import { GameMode } from './GameConfig';

interface Team {
    id: number;
    playerCount: number;
    name: string;
}

interface TeamStats {
    teamId: number;
    shotAccuracy: number;
    remainingCups: number;
}

export class GameStatistics {
    gameMode: GameMode;
    teams: Team[];
    teamWon: number;
    teamStats: TeamStats[];

    constructor(
        gameMode: GameMode,
        teams: Team[],
        teamWon: number,
        teamStats: TeamStats[],
    ) {
        this.gameMode = gameMode;
        this.teams = teams;
        this.teamWon = teamWon;
        this.teamStats = teamStats;
    }

    get teamWonName() {
        return this.teams.find(team => team.id === this.teamWon)!.name;
    }

    winnerTeamStats = () => {
        return this.teamStats.find(stats => stats.teamId === this.teamWon)!;
    };
}
