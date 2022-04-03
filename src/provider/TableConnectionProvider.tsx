import React, { useEffect, useState } from 'react'
import TableConnection from '../lib/TableConnection'
import { useBleManager } from "./BleManagerProvider";

const TabelConnectionContext = React.createContext<TableConnection | undefined>(undefined)

export const useTableConnection = () => {
    const context = React.useContext(TabelConnectionContext)

    if (context === undefined) {
        throw new Error("useUserStore must be used within a UserStoreContext")
    }

    return context!
}

export function TableConnectionProvider(props: {children: React.ReactNode}) {

    const bleManager = useBleManager()
    const [tableInstance] = useState(new TableConnection(bleManager))

    useEffect(() => {
        return () => { tableInstance.stop() }
    }, [])

    return (
        <TabelConnectionContext.Provider value={tableInstance}>
            {props.children}
        </TabelConnectionContext.Provider>
    )
}