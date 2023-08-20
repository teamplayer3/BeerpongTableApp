import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { ConnectionState } from '../lib/TableConnection';
import { useTableConnection } from '../provider/TableConnectionProvider';
import Row from './Row';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Gap from './Gap';

export default function ConnectionIndicator() {
    const tableConnection = useTableConnection();
    const [showLabel, setShowLabel] = useState<boolean>(true);
    const [connected, setConnected] = useState<boolean>(
        tableConnection.state === ConnectionState.Connected,
    );
    const indicatorColor = connected ? 'green' : 'red';
    useEffect(() => {
        const listenerHandle = tableConnection.onConnectionStateChange(
            state => {
                const isConnected = state === ConnectionState.Connected;
                setConnected(isConnected);
            },
        );
        const timeout = setTimeout(changeToIcon, 5000);
        return () => {
            clearTimeout(timeout);
            listenerHandle.remove();
        };
    }, [tableConnection]);
    const changeToIcon = () => {
        setShowLabel(false);
    };
    return (
        <Row
            style={{ position: 'absolute', right: 10, top: 5 }}
            height={20}
            verticalCentered>
            {showLabel ? (
                <Text>Tischverbindung</Text>
            ) : (
                <Icon size={16} name="bluetooth" />
            )}
            <Gap size={5} />
            <View
                style={{
                    width: 10,
                    height: 10,
                    borderRadius: 10,
                    backgroundColor: indicatorColor,
                }}
            />
        </Row>
    );
}
