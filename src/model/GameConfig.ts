import { Player } from "./PlayerStore"

export enum GameMode {
    Standard,
    QuickGame
}

export const gameModeAsString = (gameMode: GameMode): string => {
    switch (gameMode) {
        case GameMode.Standard: return "Standard"
        case GameMode.QuickGame: return "Schnelles Spiel"
    }
}

export enum BombMode {
    SelectNCups,
    CupsAroundShot
}

export interface ExtraConfig {
    bombMode: BombMode,
    ballsToSelectForBomb: number
}

const defaultExtraConfig = (): ExtraConfig => {
    return {
        bombMode: BombMode.SelectNCups,
        ballsToSelectForBomb: 2
    }
}

export interface Team {
    name: string
    players: Player[]
}

export type TeamEnum = "teamA" | "teamB"

export default class GameConfig {

    teamA: Team = {
        name: "A",
        players: []
    }
    teamB: Team = {
        name: "B",
        players: []
    }
    playersPerGame: number = 1;
    maxPlayTime: number | undefined = undefined;
    gameMode: GameMode = GameMode.Standard;
    ballsPerTeam: number = 1;
    extraConfig: ExtraConfig = defaultExtraConfig()

    set updateTeamAName(name: string) {
        this.teamA.name = name
    }

    set updateTeamBName(name: string) {
        this.teamB.name = name
    }

    get teamAName() {
        return this.teamA.name
    }

    get teamBName() {
        return this.teamB.name
    }

    get teamAPlayers() {
        return this.teamA.players
    }

    get teamBPlayers() {
        return this.teamB.players
    }

    removeTeamAPlayer = (player: Player) => {
        const index = this.teamA.players.findIndex((p) => p.id == player.id)
        this.teamA.players.splice(index, 1)
        console.log(this.teamA.players)
    }

    removeTeamBPlayer = (player: Player) => {
        const index = this.teamB.players.findIndex((p) => p.id == player.id)
        this.teamB.players.splice(index, 1)
    }

    addTeamAPlayer = (player: Player) => {
        this.teamA.players.push(player)
    }

    addTeamBPlayer = (player: Player) => {
        this.teamB.players.push(player)
    }

    getTeamName = (team: TeamEnum) => {
        switch (team) {
            case "teamA": return this.teamAName
            case "teamB": return this.teamBName
        }
    }

    updateTeamName = (team: TeamEnum, name: string) => {
        switch (team) {
            case "teamA": this.updateTeamAName = name
                break
            case "teamB": this.updateTeamBName = name
                break
        }
    }

    getTeamPlayers = (team: TeamEnum) => {
        switch (team) {
            case "teamA": return this.teamA.players
            case "teamB": return this.teamB.players
        }
    }

    addTeamPlayer = (team: TeamEnum, player: Player) => {
        switch (team) {
            case "teamA": this.addTeamAPlayer(player)
                break
            case "teamB": this.addTeamBPlayer(player)
                break
        }
    }

    removeTeamPlayer = (team: TeamEnum, player: Player) => {
        switch (team) {
            case "teamA": this.removeTeamAPlayer(player)
                break
            case "teamB": this.removeTeamBPlayer(player)
                break
        }
    }

    getAllSelectedPlayers = () => {
        return this.teamAPlayers.concat(this.teamBPlayers)
    }

}