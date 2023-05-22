import { cloneDeep, isNull, isUndefined } from "lodash"
import { MMKVInstance } from "react-native-mmkv-storage"

export interface PlayerStatistics {
    playedGames: number,
    winnedGames: number,
    teamSizeAverage: number | undefined
}

const init_player_statistics = (): PlayerStatistics => {
    return {
        playedGames: 0,
        teamSizeAverage: undefined,
        winnedGames: 0
    }
}

export interface Player {
    id: number
    name: string
    statistics: PlayerStatistics
}

export const UnknownPlayer: Player = {
    id: 0,
    name: "Unknown",
    statistics: init_player_statistics()
}

export interface PlayerStartLetterGroup {
    letter: string,
    players: Player[]
}

const DUMMY_DATA: Player[] = [
    {
        id: 1,
        name: "Alex",
    },
    {
        id: 2,
        name: "Laura",
    },
    {
        id: 3,
        name: "Andy",
    },
    {
        id: 4,
        name: "Sina",
    },
    {
        id: 5,
        name: "Werner",
    },
].map((p) => ({
    ...p,
    statistics: init_player_statistics()
}))

const STORAGE_KEY = "PLAYERS"

export class PlayerStore {

    keyValueStore: MMKVInstance

    constructor(mmkvStorage: MMKVInstance) {
        this.keyValueStore = mmkvStorage
        this.players = DUMMY_DATA
    }

    get players(): Player[] {
        const players = this.keyValueStore.getArray<Player>(STORAGE_KEY)
        if (isNull(players)) {
            this.keyValueStore.setArray(STORAGE_KEY, [])
            return []
        } else {
            return players
        }
    }

    set players(players: Player[]) {
        this.keyValueStore.setArray(STORAGE_KEY, players)
    }

    getGroupedByStartLetter = (): PlayerStartLetterGroup[] => {
        const sortedPlayers = cloneDeep(this.players).sort((a, b) => {
            const a_code = a.name.charCodeAt(0);
            const b_code = b.name.charCodeAt(0);
            return a_code < b_code ? -1 : a_code > b_code ? 1 : 0
        });
        let groups: PlayerStartLetterGroup[] = []
        let currPlayerGroup: PlayerStartLetterGroup | undefined
        sortedPlayers.forEach((player) => {
            if (isUndefined(currPlayerGroup)) {
                currPlayerGroup = {
                    letter: player.name.charAt(0),
                    players: []
                }
            } else if (player.name.charCodeAt(0) != currPlayerGroup.letter.charCodeAt(0)) {
                groups.push(currPlayerGroup)
                currPlayerGroup = {
                    letter: player.name.charAt(0),
                    players: []
                }
            }
            currPlayerGroup.players.push(player)
        });

        return groups
    }

    addPlayer = (name: string): number => {
        const id = generateId(name)
        let players = this.players
        players.push({
            id: id,
            name: name,
            statistics: init_player_statistics()
        })
        this.players = players
        return id
    }

    updatePlayer = (player: Player) => {
        let players = this.players
        const storedPlayerId = players.findIndex((p) => p.id === player.id);
        if (!isUndefined(storedPlayerId)) {
            players[storedPlayerId] = player
        }
        this.players = players
    }

}

const generateId = (name: string): number => {
    const hash = hashCode(name)
    const random = Math.floor(Math.random() * 11);
    return hash * 10 + random
}

const hashCode = (s: string) => s.split('').reduce((a, b) => (((a << 5) - a) + b.charCodeAt(0)) | 0, 0)