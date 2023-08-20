import React, { ReactNode } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

export default function Centered(props: {
    children: ReactNode;
    style?: StyleProp<ViewStyle>;
}) {
    return (
        <View
            style={{
                ...(props.style as object),
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                width: '100%',
            }}>
            {props.children}
        </View>
    );
}
