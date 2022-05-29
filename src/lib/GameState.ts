
import { PotStyle } from "../components/PotLayout"
import { Color } from "../model/Color"
import { GameMode } from "../model/GameConfig"
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
}

interface SpecificPot {
    id: number,
    teamId: number
}

export enum ClickPotAction {
    Shot,
    Select,
    UndoShot,
    Unselect
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
            remainingTime: undefined
        },
        {
            id: 1,
            name: teamBName,
            playerCount: teamBPlayerCount,
            pots: new Array(10).fill(undefined).map((_, idx) => initPot(idx)),
            remainingTime: undefined
        }
    ]
}

export class GameState {

    gameMode: GameMode
    teams: Team[]
    remainingTime: number | undefined
    currentTeamId: number

    constructor(gameMode: GameMode, teams: Team[], startTeam: number, remainingTime: number | undefined) {
        this.gameMode = gameMode
        this.teams = teams
        this.remainingTime = remainingTime
        this.currentTeamId = startTeam
    }

    clickPot = (pot: SpecificPot): ClickPotAction[] => {
        let potObj = this.getPot(pot)!

        return [ClickPotAction.Shot]
    }

    selectedClickPotAction = (pot: SpecificPot, action: ClickPotAction) => {
        switch (action) {
            case ClickPotAction.Shot: this.shotPot(pot);
                break;
            case ClickPotAction.Select: this.selectPot(pot);
                break;
            case ClickPotAction.Unselect: this.unselectPot(pot);
                break;
            case ClickPotAction.UndoShot: this.undoShotPot(pot);
                break;
        }
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

    shotPot = (pot: SpecificPot) => {
        const potObj = this.getPot(pot)!
        potObj.state.shotCount += 1
    }

    getPot = (pot: SpecificPot) => {
        return this.teams.find((value) => value.id == pot.teamId)
            ?.pots.find((value) => value.id == pot.id)
    }

    isGameOver = () => {
        return this.remainingTime === 0
    }

    teamHasLost = () => {
        let team = this.teams.find((team) => {
            return team.pots.every((value) => isPotFullyShot(value))
        })
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
        return {
            gameMode: this.gameMode,
            teamStats: [{
                teamId: this.teams[0].id,
                remainingCups: this.teams[0].pots.reduce((prev, curr) => prev += isPotFullyShot(curr) ? 0 : 1, 0),
                shotAccuracy: 0
            }, {
                teamId: this.teams[1].id,
                remainingCups: this.teams[1].pots.reduce((prev, curr) => prev += isPotFullyShot(curr) ? 0 : 1, 0),
                shotAccuracy: 0
            }],
            teamWon: teamWon.id,
            teams: this.teams.map((team) => {
                return {
                    id: team.id,
                    playerCount: team.playerCount,
                    name: team.name
                }
            })
        }
    }

}

const isPotFullyShot = (pot: Pot): boolean => {
    return pot.state.shotCount >= 1
}

const mapPotStateToStyle = (potState: PotState): PotStyle => {
    return {
        bordered: potState.selected,
        color: Color.green(),
        overlay: false
    }
}