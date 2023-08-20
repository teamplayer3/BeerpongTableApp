import React from 'react';
import { Text, View } from 'react-native';
import { IconButton } from 'react-native-paper';

export function HeaderBar(props: {
    headerLabel?: string;
    onClose?: () => void;
}) {
    return (
        <View
            style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                height: 70,
                backgroundColor: 'grey',
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
            }}>
            {props.onClose && (
                <IconButton
                    style={{
                        position: 'absolute',
                        left: 10,
                    }}
                    color="white"
                    icon="close"
                    size={30}
                    onPress={props.onClose}
                />
            )}
            {props.headerLabel && (
                <Text
                    style={{
                        fontSize: 30,
                    }}>
                    {props.headerLabel}
                </Text>
            )}
        </View>
    );
}
