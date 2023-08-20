import React, { Dispatch, SetStateAction, useState } from 'react';
import GameConfig from '../model/GameConfig';

const GameConfigContext = React.createContext<
    [
        gameConfig: GameConfig,
        setGameConfig: Dispatch<SetStateAction<GameConfig>>,
    ]
>([new GameConfig(), () => null]);

export const useGameConfig = () => {
    const context = React.useContext(GameConfigContext);

    if (context === undefined) {
        throw new Error(
            'useGameConfig must be used within a GameConfigContext',
        );
    }

    return context!;
};

export function GameConfigProvider(props: { children: React.ReactNode }) {
    const [gameConfig, setGameConfig] = useState(new GameConfig());

    return (
        <GameConfigContext.Provider value={[gameConfig, setGameConfig]}>
            {props.children}
        </GameConfigContext.Provider>
    );
}
