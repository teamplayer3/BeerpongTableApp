
import { clone, cloneDeep } from "lodash"
import { PotStyle } from "../components/PotLayout"
import { Color } from "../model/Color"
import GameConfig from "../model/GameConfig"
import { GameStatistics } from "../model/GameStatistics"


interface PotState {
    selected: boolean,
    shotCount: number
}

interface Pot {
    id: number,
    state: PotState
}

export interface Team {
    id: number,
    playerCount: number,
    name: string,
    pots: Pot[]
    remainingTime: number | undefined
    missedShots: number
    shots: number
}

export interface SpecificPot {
    id: number,
    teamId: number
}

export enum ShotType {
    Normal,
    Bounce,
    Trick
}


const initPot = (id: number): Pot => {
    return {
        id: id,
        state: {
            selected: false,
            shotCount: 0
        }
    }
}

export interface GameStateSnapshot {
    teams: Team[]
    remainingTime: number | undefined
    currentTeamId: number
    gameConfig: GameConfig
    currTeamShotCount: number
}

export const initTeams = (
    teamAName: string, teamAPlayerCount: number,
    teamBName: string, teamBPlayerCount: number,
): Team[] => {
    return [
        {
            id: 0,
            name: teamAName,
            playerCount: teamAPlayerCount,
            pots: new Array(10).fill(undefined).map((_, idx) => initPot(idx)),
            remainingTime: undefined,
            missedShots: 0,
            shots: 0
        },
        {
            id: 1,
            name: teamBName,
            playerCount: teamBPlayerCount,
            pots: new Array(10).fill(undefined).map((_, idx) => initPot(idx)),
            remainingTime: undefined,
            missedShots: 0,
            shots: 0
        }
    ]
}

const NEEDED_SHOTS_PER_POT = 1
const MAX_REPLAY_ACTIONS = 10

export class GameState {

    teams: Team[]
    remainingTime: number | undefined
    currentTeamId: number
    gameConfig: GameConfig
    currTeamShotCount: number

    constructor(teams: Team[], startTeam: number, remainingTime: number | undefined, gameConfig: GameConfig) {
        this.gameConfig = gameConfig
        this.teams = teams
        this.remainingTime = remainingTime
        this.currentTeamId = startTeam
        this.currTeamShotCount = 0
    }

    getTeamShotCount = (): number => {
        return this.currTeamShotCount
    }

    selectPot = (pot: SpecificPot) => {
        const potObj = this.getPot(pot)!
        potObj.state.selected = true
    }

    unselectPot = (pot: SpecificPot) => {
        const potObj = this.getPot(pot)!
        potObj.state.selected = false
    }

    undoShotPot = (pot: SpecificPot) => {
        const potObj = this.getPot(pot)!
        potObj.state.shotCount -= 1
    }

    shotPot = (pot: SpecificPot, shotType: ShotType) => {
        const potObj = this.getPot(pot)!
        if (isPotFullyShot(potObj)) {
            return
        }
        potObj.state.shotCount += 1

        let currTeam = this.currentTeam()
        currTeam.shots += 1
        this.evaluateIfBallsToOtherTeam()
    }

    notHitPot = () => {
        let currTeam = this.currentTeam()
        currTeam.missedShots += 1
        currTeam.shots += 1
        this.evaluateIfBallsToOtherTeam()
    }

    evaluateIfBallsToOtherTeam = () => {
        if (this.gameConfig.ballsPerTeam > this.currTeamShotCount + 1) {
            this.currTeamShotCount += 1
        }
        else {
            this.setNextTeam()
            this.currTeamShotCount = 0
        }
    }

    reorderNotShotPots = (teamId: number, notShotIndexes: number[]) => {
        if (!this.isNewPatternValid(teamId, notShotIndexes)) {
            return false
        }

        this.getTeam(teamId)?.pots.forEach((pot) => {
            let inNewPattern = notShotIndexes.find((idx) => idx === pot.id)
            pot.state.shotCount = inNewPattern === undefined ? NEEDED_SHOTS_PER_POT : 0
        })
    }

    isNewPatternValid = (teamId: number, notShotIndexes: number[]) => {
        let remainingInPattern = notShotIndexes.length
        let remaining = this.remainingPots(teamId)
        return remainingInPattern == remaining ? true : false
    }

    getPot = (pot: SpecificPot) => {
        return this.teams.find((value) => value.id == pot.teamId)
            ?.pots.find((value) => value.id == pot.id)
    }

    getTeam = (id: number) => {
        return this.teams.find((team) => team.id === id)
    }

    isGameOver = () => {
        return this.remainingTime === 0
    }

    teamHasLost = () => {
        let team = this.teams.find((team) => team.pots.every((value) => isPotFullyShot(value)))
        if (team !== undefined) {
            console.log("Team " + team.name + " has lost")
        }
        return team
    }

    teamHasWon = () => {
        const lostTeam = this.teamHasLost()
        if (lostTeam === undefined) {
            return undefined
        }
        let teamId = 0;
        switch (lostTeam.id) {
            case 0: teamId = 1;
                break;
            case 1: teamId = 0;
                break;
        }
        console.log(teamId)
        return this.teams.find((team) => team.id === teamId)
    }

    remainingPots = (teamId: number) => {
        return this.teams.find((value) => value.id === teamId)!.pots.reduce((prev, curr, idx) => isPotFullyShot(curr) ? prev - 1 : prev, 10);
    }

    currentTeam = (): Team => {
        return this.teams.find((value) => value.id === this.currentTeamId)!
    }

    setNextTeam = () => {
        this.currentTeamId + 1 > 1 ?
            this.currentTeamId = 0 :
            this.currentTeamId += 1
    }

    createGameStatistics = (): GameStatistics | undefined => {
        const teamWon = this.teamHasWon()
        if (teamWon === undefined) {
            return undefined
        }
        return new GameStatistics(
            this.gameConfig.gameMode,
            this.teams.map((team) => {
                return {
                    id: team.id,
                    playerCount: team.playerCount,
                    name: team.name
                }
            }),
            teamWon.id,
            this.teams.map((team) => {
                return {
                    teamId: team.id,
                    remainingCups: team.pots.reduce((prev, curr) => prev += isPotFullyShot(curr) ? 0 : 1, 0),
                    shotAccuracy: (team.shots - team.missedShots) / team.shots
                }
            })
        )
    }

    createSnapShot = (): GameStateSnapshot => {
        return {
            currentTeamId: this.currentTeamId,
            currTeamShotCount: this.currTeamShotCount,
            gameConfig: this.gameConfig,
            remainingTime: this.remainingTime,
            teams: cloneDeep(this.teams)
        }
    }

    setFromSnapShot = (snapshot: GameStateSnapshot) => {
        this.currentTeamId = snapshot.currentTeamId
        this.currTeamShotCount = snapshot.currTeamShotCount
        this.gameConfig = snapshot.gameConfig
        this.remainingTime = snapshot.remainingTime
        this.teams = snapshot.teams
    }

}

export const isPotFullyShot = (pot: Pot): boolean => {
    return pot.state.shotCount >= NEEDED_SHOTS_PER_POT
}

const mapPotStateToStyle = (potState: PotState): PotStyle => {
    return {
        bordered: potState.selected,
        color: Color.green(),
        overlay: false
    }
}