import React, { useState } from "react";
import { BackHandler } from "react-native";
import { Route, Router, useRouter } from "./components/Router";
import GameConfig from "./model/GameConfig";
import { GameStatistics } from "./model/GameStatistics";
import GameConfigView from "./view/GameConfigView";
import { GameStatsView } from "./view/GameStatsView";
import { GameView } from "./view/GameView";
import ManualControlView from "./view/ManualControlView";
import StartScreenView from "./view/StartScreenView";
import TableConnectionView from "./view/TableConnectionView";

const dummyGameConfig = new GameConfig()
dummyGameConfig.ballsPerTeam = 2

export default function Root(props: {}) {

    const [_, setRoute] = useRouter()

    const [gameConfig, setGameConfig] = useState<undefined | GameConfig>(dummyGameConfig)
    const [gameStatistics, setGameStatistics] = useState<undefined | GameStatistics>(undefined)

    const startTeam = 0

    const backHome = () => {
        setRoute(Route.OnStartScreen)
    }

    return (
        <Router
            routes={{
                configScreen: (
                    < GameConfigView
                        onCloseConfig={backHome}
                        onStartGame={(gameConfig) => {
                            setGameConfig(gameConfig)
                            setRoute(Route.InGame)
                        }}
                    />
                ),
                gameScreen: (
                    < GameView
                        onGameEnd={(stats) => {
                            setGameStatistics(stats)
                            setRoute(Route.ShowStatistics)
                        }}
                        gameConfig={gameConfig!}
                        startTeam={startTeam}
                        onCancelGame={backHome}
                    />
                ),
                startScreen: (
                    < StartScreenView
                        onSelectAction={(action) => {
                            switch (action) {
                                case "start": setRoute(Route.InConfig)
                                    break
                                case "tableSetup": setRoute(Route.TableConnectionSetup)
                                    break
                                case "exit": BackHandler.exitApp()
                                    break
                                case "manualControl": setRoute(Route.ManualControl)
                                    break
                                default:
                            }
                        }}
                    />
                ),
                statisticScreen: (
                    < GameStatsView
                        gameStatistics={gameStatistics!}
                        onQuitStatistics={backHome}
                    />
                ),
                tableConnectionSetup: (
                    < TableConnectionView
                        onClose={backHome}
                    />
                ),
                manualControl: (
                    < ManualControlView
                        onClose={backHome}
                    />
                )
            }}
        />
    )
}