import React, { Dispatch, SetStateAction, useState } from 'react';
import { PlayerStore } from '../model/PlayerStore';
import { MMKVLoader } from 'react-native-mmkv-storage';

const mmkvStorage = new MMKVLoader().withInstanceID('players').initialize();
const PlayerStoreContext = React.createContext<
    [
        playerStore: PlayerStore,
        setPlayerStore: Dispatch<SetStateAction<PlayerStore>>,
    ]
>([new PlayerStore(mmkvStorage), () => null]);

export const usePlayerStore = () => {
    const context = React.useContext(PlayerStoreContext);

    if (context === undefined) {
        throw new Error(
            'usePlayerStore must be used within a PlayerStoreContext',
        );
    }

    return context!;
};

export function PlayerStoreProvider(props: { children: React.ReactNode }) {
    const [playerStore, setPlayerStore] = useState(
        new PlayerStore(mmkvStorage),
    );

    return (
        <PlayerStoreContext.Provider value={[playerStore, setPlayerStore]}>
            {props.children}
        </PlayerStoreContext.Provider>
    );
}
