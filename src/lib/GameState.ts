
import { cloneDeep, isNull, isUndefined } from "lodash"
import { PotStyle } from "../components/PotLayout"
import { Color } from "../model/Color"
import GameConfig, { BombMode } from "../model/GameConfig"
import { GameStatistics } from "../model/GameStatistics"
import { Player, UnknownPlayer } from "../model/PlayerStore"
import { logObjStruct } from "../util/Utils"


interface PotState {
    selected: boolean,
    shotCount: number,
    shotsPerRound: number
    available: boolean
}

interface Pot {
    id: number,
    state: PotState
}

export interface Team {
    id: number,
    players: Player[],
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
            shotCount: 0,
            shotsPerRound: 0,
            available: true
        }
    }
}

export interface GameStateSnapshot {
    teams: Team[]
    remainingTime: number | undefined
    currentTeamId: number
    gameConfig: GameConfig
    currTeamShotCount: number
    specialEvent: SpecialEvent
}

export const initTeams = (
    teamAName: string, teamAPlayerCount: number,
    teamBName: string, teamBPlayerCount: number,
): Team[] => {
    return [
        {
            id: 0,
            name: teamAName,
            players: [UnknownPlayer],
            pots: new Array(10).fill(undefined).map((_, idx) => initPot(idx)),
            remainingTime: undefined,
            missedShots: 0,
            shots: 0
        },
        {
            id: 1,
            name: teamBName,
            players: [UnknownPlayer],
            pots: new Array(10).fill(undefined).map((_, idx) => initPot(idx)),
            remainingTime: undefined,
            missedShots: 0,
            shots: 0
        }
    ]
}

abstract class SpecialEvent {

    abstract isOver(): boolean
    abstract selectPot(pot: SpecificPot): void
    abstract noHit(): void
    abstract nextEvent(): SpecialEvent | null
    abstract cleanUp(): void
}

const NEEDED_SHOTS_PER_POT = 1
const MAX_REPLAY_ACTIONS = 10

export class GameState {

    teams: Team[]
    remainingTime: number | undefined
    currentTeamId: number
    gameConfig: GameConfig
    currTeamShotCount: number
    specialEvent: SpecialEvent

    constructor(startTeam: number, gameConfig: GameConfig) {
        this.gameConfig = gameConfig
        this.teams = [{
            id: 0,
            missedShots: 0,
            name: gameConfig.teamAName,
            players: gameConfig.teamAPlayers,
            pots: new Array(10).fill(undefined).map((_, idx) => initPot(idx)),
            remainingTime: undefined,
            shots: 0
        }, {
            id: 1,
            missedShots: 0,
            name: gameConfig.teamBName,
            players: gameConfig.teamBPlayers,
            pots: new Array(10).fill(undefined).map((_, idx) => initPot(idx)),
            remainingTime: undefined,
            shots: 0
        }]
        this.remainingTime = gameConfig.maxPlayTime
        this.currentTeamId = startTeam
        this.currTeamShotCount = 0
        this.specialEvent = new NormalMode(this)
    }

    getTeamShotCount = (): number => {
        return this.currTeamShotCount
    }

    selectPot = (pot: SpecificPot) => {
        if (isUndefined(this.specialEvent)) {
            const potObj = this.getPot(pot)!
            potObj.state.selected = true
        } else {
            this.specialEvent.selectPot(pot)
        }

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
        if (!isUndefined(this.specialEvent)) {
            this.specialEvent.selectPot(pot)
            if (this.specialEvent.isOver()) {
                this.onEventIsOver()
            }
        }

        // logObjStruct(this.teams.find((team) => team.id === pot.teamId)?.pots)
    }

    notHitPot = () => {
        if (!isUndefined(this.specialEvent)) {
            this.specialEvent.noHit()

            if (this.specialEvent.isOver()) {
                this.onEventIsOver()
            }
        }
    }

    onEventIsOver = () => {
        console.log("over")
        let nextEvent = this.specialEvent.nextEvent()
        this.specialEvent.cleanUp()
        if (nextEvent instanceof NormalMode) {
            this.setNextTeam()
        }
        console.log(nextEvent)
        if (!isNull(nextEvent)) {
            this.specialEvent = nextEvent
        }
    }

    cleanTeamTempPotState = (team: number) => {
        const otherTeam = this.getTeam(team)!
        otherTeam.pots.forEach((pot) => {
            if (isPotFullyShot(pot)) {
                pot.state.available = false
            }
            pot.state.shotsPerRound = 0
            return pot
        })
    }

    evaluateIfBallsToOtherTeam = () => {
        if (isUndefined(this.specialEvent)) {
            return this.gameConfig.ballsPerTeam <= this.currTeamShotCount
        } else {
            return this.specialEvent.isOver()
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
                    playerCount: team.players.length,
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
            teams: cloneDeep(this.teams),
            specialEvent: cloneDeep(this.specialEvent)
        }
    }

    setFromSnapShot = (snapshot: GameStateSnapshot) => {
        this.currentTeamId = snapshot.currentTeamId
        this.currTeamShotCount = snapshot.currTeamShotCount
        this.gameConfig = snapshot.gameConfig
        this.remainingTime = snapshot.remainingTime
        this.teams = snapshot.teams
        this.specialEvent = snapshot.specialEvent
    }

}

export const isPotFullyShot = (pot: Pot): boolean => {
    return pot.state.shotCount >= NEEDED_SHOTS_PER_POT
}

export class NormalMode extends SpecialEvent {

    gameState: GameState
    lastHitPot: undefined | SpecificPot
    hitPots: number
    computedNextEvent: SpecialEvent | null | undefined

    constructor(gameState: GameState) {
        super()
        this.gameState = gameState
        this.hitPots = 0
        this.computedNextEvent = undefined
    }

    isOver(): boolean {
        this.evaluateNextEvent()
        if (isNull(this.computedNextEvent)) {
            return false
        } else {
            return true
        }
    }

    selectPot(pot: SpecificPot): void {
        const currTeam = this.gameState.currentTeam()
        if (currTeam.id == pot.teamId) {
            throw `pot ${pot.id} is in its own team`
        }
        const potObj = this.gameState.getPot(pot)!
        if (potObj.state.available) {
            if (this.gameState.gameConfig.ballsPerTeam > 1) {
                potObj.state.shotsPerRound += 1
                this.hitPots += 1
            }
            potObj.state.shotCount += 1
        }

        this.lastHitPot = pot
        currTeam.shots += 1
        this.gameState.currTeamShotCount += 1
    }

    noHit(): void {
        let currTeam = this.gameState.currentTeam()
        currTeam.missedShots += 1
        currTeam.shots += 1
        this.gameState.currTeamShotCount += 1
    }

    nextEvent = (): SpecialEvent | null => {
        return this.computedNextEvent!
    }

    cleanUp(): void {
        this.hitPots = 0
        this.gameState.currTeamShotCount = 0
        if (!(this.computedNextEvent instanceof BombShot)) {
            if (!isUndefined(this.lastHitPot)) {
                this.gameState.cleanTeamTempPotState(this.lastHitPot.teamId)
            }
        }

    }

    private evaluateNextEvent = () => {
        const potObj = !isUndefined(this.lastHitPot) ? this.gameState.getPot(this.lastHitPot) : undefined
        const manyHits = this.hitPots >= this.gameState.gameConfig.ballsPerTeam
        const shotWasABomb = !isUndefined(potObj) && isPotFullyShot(potObj) && potObj.state.shotsPerRound > 1
        const teamHasNoShotsOver = this.gameState.currTeamShotCount >= this.gameState.gameConfig.ballsPerTeam

        if (shotWasABomb) {
            this.computedNextEvent = new BombShot(this.gameState, this.lastHitPot!)
        } else if (manyHits) {
            this.computedNextEvent = new BallsBack(this.gameState)
        } else if (teamHasNoShotsOver) {
            this.computedNextEvent = new NormalMode(this.gameState)
        } else {
            this.computedNextEvent = null
        }
    }
}

export class BombShot extends SpecialEvent {

    gameState: GameState
    pot: SpecificPot
    selectedPots: number

    constructor(gameState: GameState, pot: SpecificPot) {
        super()
        this.gameState = gameState
        this.pot = pot
        this.selectedPots = 0
    }

    isOver(): boolean {
        return this.selectedPots === this.gameState.gameConfig.extraConfig.ballsToSelectForBomb
    }

    selectPot(pot: SpecificPot): void {
        const potObj = this.gameState.getPot(pot)!
        potObj.state.available = false
        this.selectedPots += 1
    }

    noHit(): void { }

    nextEvent(): SpecialEvent | null {
        return new BallsBack(this.gameState)
    }

    cleanUp(): void {
        const potObj = this.gameState.getPot(this.pot)!
        let state = potObj.state
        state.available = false
        state.shotsPerRound = 0
        state.shotCount = NEEDED_SHOTS_PER_POT
        this.gameState.currTeamShotCount = 0
    }
}

export class BallsBack extends SpecialEvent {

    gameState: GameState
    innerEvent: NormalMode

    constructor(gameState: GameState) {
        super()
        this.gameState = gameState
        this.innerEvent = new NormalMode(gameState)
    }

    isOver(): boolean {
        return this.innerEvent.isOver()
    }

    selectPot(pot: SpecificPot): void {
        this.innerEvent.selectPot(pot)
    }

    noHit(): void {
        this.innerEvent.noHit()
    }

    nextEvent(): SpecialEvent | null {
        return this.innerEvent.nextEvent()
    }

    cleanUp(): void {
        this.innerEvent.cleanUp()
    }
}