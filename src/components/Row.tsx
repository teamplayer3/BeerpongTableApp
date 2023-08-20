import { isUndefined } from 'lodash';
import React, { ReactNode } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

export default function Row(props: {
    children: ReactNode | ReactNode[];
    verticalCentered?: boolean;
    stretch?: boolean;
    height?: string | number;
    style?: StyleProp<ViewStyle>;
}) {
    const verticalCentered = isUndefined(props.verticalCentered)
        ? false
        : props.verticalCentered;
    const stretch = isUndefined(props.stretch) ? false : props.stretch;

    return (
        <View
            style={{
                ...(props.style as object),
                display: 'flex',
                flexDirection: 'row',
                justifyContent: stretch ? 'space-between' : undefined,
                alignItems: verticalCentered ? 'center' : undefined,
                height: props.height,
            }}>
            {props.children}
        </View>
    );
}
