import { isUndefined } from 'lodash';
import React, { ReactNode } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

export default function Column(props: {
    children: ReactNode;
    horizontalCentered?: boolean;
    verticalCentered?: boolean;
    stretch?: boolean;
    width?: string | number;
    height?: string | number;
    style?: StyleProp<ViewStyle>;
}) {
    const horizontalCentered = isUndefined(props.horizontalCentered)
        ? false
        : props.horizontalCentered;
    const verticalCentered = isUndefined(props.verticalCentered)
        ? false
        : props.verticalCentered;
    const stretch = isUndefined(props.stretch) ? false : props.stretch;

    return (
        <View
            style={{
                ...(props.style as object),
                display: 'flex',
                flexDirection: 'column',
                justifyContent: stretch
                    ? 'space-between'
                    : verticalCentered
                    ? 'center'
                    : undefined,
                alignItems: horizontalCentered ? 'center' : undefined,
                height: props.height,
                width: props.width,
            }}>
            {props.children}
        </View>
    );
}
