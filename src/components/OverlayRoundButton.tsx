import { isNil } from 'lodash';
import React from 'react';
import { ColorValue, View } from 'react-native';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
import { IconButton } from 'react-native-paper';

export function OverlayAddButton(props: {
    onPress: () => void;
    icon: IconSource;
    backgroundColor: ColorValue;
    color: ColorValue;
    disabled?: boolean;
    size: number;
}) {
    const disabled = isNil(props.disabled) ? false : props.disabled;

    return (
        <View
            style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                height: props.size,
                width: props.size,
            }}>
            <IconButton
                icon={props.icon}
                onPress={props.onPress}
                color={props.color.toString()}
                disabled={disabled}
                size={props.size / 2}
                style={{
                    position: 'absolute',
                    backgroundColor: props.backgroundColor,
                    height: props.size,
                    width: props.size,
                    borderRadius: props.size / 2,
                    bottom: 30,
                    right: 30,
                    shadowColor: 'white',
                    elevation: 5,
                }}
            />
        </View>
    );
}
