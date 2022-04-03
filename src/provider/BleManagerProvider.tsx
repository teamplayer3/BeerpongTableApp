import React, { useEffect, useState } from 'react'
import { BleManager } from 'react-native-ble-plx'

const BleManagerContext = React.createContext<BleManager | undefined>(undefined)

export const useBleManager = () => {
    const context = React.useContext(BleManagerContext)

    if (context === undefined) {
        throw new Error("useUserStore must be used within a UserStoreContext")
    }

    return context!
}

export function BleManagerProvider(props: { children: React.ReactNode }) {

    const [bleManagerInstance] = useState(new BleManager())

    useEffect(() => {
        return () => { bleManagerInstance.destroy() }
    }, [])

    return (
        <BleManagerContext.Provider value={bleManagerInstance}>
            {props.children}
        </BleManagerContext.Provider>
    )
}