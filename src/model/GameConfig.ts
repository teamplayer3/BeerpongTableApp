
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

export default class GameConfig {

    playersPerGame: number = 1;
    maxPlayTime: number | undefined = undefined;
    gameMode: GameMode = GameMode.Standard;
    ballsPerTeam: number = 1;

}