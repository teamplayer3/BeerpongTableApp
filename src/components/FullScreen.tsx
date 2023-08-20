import React, { ReactNode } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleProp,
    useWindowDimensions,
    View,
    ViewStyle,
} from 'react-native';

export default function Fullscreen(props: {
    children: ReactNode;
    backgroundColor?: string;
    style?: StyleProp<ViewStyle>;
}) {
    const deviceDimensions = useWindowDimensions();
    return (
        <View
            style={{
                ...(props.style as object),
                backgroundColor: props.backgroundColor,
                width: deviceDimensions.width,
                height: deviceDimensions.height,
            }}>
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}>
                    {props.children}
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}
