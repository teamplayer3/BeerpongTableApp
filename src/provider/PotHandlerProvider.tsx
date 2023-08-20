import React, { useState } from 'react';
import { PotHandler } from '../lib/PotHandler';
import { useTableConnection } from './TableConnectionProvider';

const PotHandlerContext = React.createContext<PotHandler | undefined>(
    undefined,
);

export const usePotHandler = () => {
    const context = React.useContext(PotHandlerContext);

    if (context === undefined) {
        throw new Error('useUserStore must be used within a UserStoreContext');
    }

    return context!;
};

export function PotHandlerProvider(props: { children: React.ReactNode }) {
    const tableConnection = useTableConnection();
    const [tableInstance] = useState(new PotHandler(tableConnection));

    return (
        <PotHandlerContext.Provider value={tableInstance}>
            {props.children}
        </PotHandlerContext.Provider>
    );
}
