import React, { useEffect } from 'react';
import { BackHandler, Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import Centered from '../components/Centered';
import Fullscreen from '../components/FullScreen';
import { HeaderBar } from '../components/HeaderBar';

export default function ManualControlView(props: { onClose: () => void }) {
    const theme = useTheme();

    useEffect(() => {
        let sub = BackHandler.addEventListener('hardwareBackPress', () => {
            props.onClose();
            return true;
        });
        return () => {
            sub.remove();
        };
    });

    return (
        <Fullscreen backgroundColor={theme.colors.background}>
            <HeaderBar headerLabel="Manual Control" onClose={props.onClose} />
            <Centered>
                <Text>Not implemented yet</Text>
            </Centered>
        </Fullscreen>
    );
}
