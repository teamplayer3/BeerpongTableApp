import { Portal } from '@gorhom/portal';
import { isUndefined } from 'lodash';
import React, { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { modifyColorOpacity } from '../util/Utils';

export default function FullScreenOverlay(props: {
    children: ReactNode | ReactNode[];
    backgroundColor?: string;
    opacity?: number;
    contentCenter?: boolean;
    onPressAway?: () => void;
}) {
    const contentCenter = isUndefined(props.contentCenter)
        ? false
        : props.contentCenter;
    const backgroundColor = isUndefined(props.backgroundColor)
        ? undefined
        : isUndefined(props.opacity)
        ? props.backgroundColor
        : modifyColorOpacity(props.backgroundColor, props.opacity);
    const renderedCenterLayout = () => {
        return (
            <React.Fragment>
                <Pressable
                    style={{
                        ...style.container,
                        backgroundColor: backgroundColor,
                    }}
                    onPress={props.onPressAway}
                />
                <View
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        ...(contentCenter ? style.center : {}),
                        flexDirection: 'column',
                    }}>
                    {props.children}
                </View>
            </React.Fragment>
        );
    };
    const renderedFullLayout = () => {
        return (
            <React.Fragment>
                <View
                    style={{
                        ...style.container,
                        ...(contentCenter ? style.center : {}),
                        backgroundColor: backgroundColor,
                    }}>
                    {props.children}
                </View>
            </React.Fragment>
        );
    };
    return (
        <Portal>
            {contentCenter ? renderedCenterLayout() : renderedFullLayout()}
        </Portal>
    );
}

const style = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        flexDirection: 'column',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
