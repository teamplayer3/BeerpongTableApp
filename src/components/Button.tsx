import { isUndefined } from 'lodash';
import React from 'react';
import { Pressable, StyleProp, Text, View, ViewStyle } from 'react-native';

export function Button(props: {
    onPress?: () => void;
    title: string;
    disabled?: boolean;
    horizontalCentered?: boolean;
    width?: string | number;
    style?: StyleProp<ViewStyle>;
}) {
    const disabled = isUndefined(props.disabled) ? false : props.disabled;
    const horizontalCentered = isUndefined(props.horizontalCentered)
        ? false
        : props.horizontalCentered;

    const centeringWrapper = (node: JSX.Element): JSX.Element => {
        if (horizontalCentered) {
            return (
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                    }}>
                    {node}
                </View>
            );
        }

        return node;
    };

    return centeringWrapper(
        <View
            style={{
                ...(props.style as object),
                backgroundColor: 'gray',
                borderRadius: 20,
                alignSelf: 'flex-start',
                width: props.width,
            }}>
            <Pressable
                style={{
                    display: 'flex',
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    borderRadius: 20,
                }}
                onPress={props.onPress}
                disabled={disabled}
                android_ripple={{
                    borderless: true,
                }}>
                <Text
                    style={{
                        fontSize: 20,
                    }}>
                    {props.title}
                </Text>
            </Pressable>
        </View>,
    );
}
