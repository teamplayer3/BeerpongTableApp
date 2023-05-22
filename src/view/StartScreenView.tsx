import { Animated, Easing, StyleSheet, useWindowDimensions, View } from "react-native";
import React, { useRef } from "react";
import { Button } from "../components/Button";
import { useState } from "react";
import { useEffect } from "react";
import rnTextSize, { TSMeasureResult, TSFontSpecs } from "react-native-text-size"
import { isUndefined } from "lodash";
import { useTheme } from "react-native-paper";
import ConnectionIndicator from "../components/ConnectionIndicator";
import Column from "../components/Column";
import Gap from "../components/Gap";
import Fullscreen from "../components/FullScreen";


type Action = "start" | "tableSetup" | "exit" | "manualControl";

const headline = "Beer Pong"

export default function StartScreenView(props: {
    onSelectAction: (action: Action) => void
}) {
    const theme = useTheme()
    const transitionAnimation = useRef(new Animated.Value(0)).current
    const [pressedAction, setPressedAction] = useState<Action | undefined>()
    const [headerDimensions, setHeaderDimensions] = useState<TSMeasureResult | undefined>()
    const windowDimensions = useWindowDimensions()

    const buttonWidth = 200
    const slideToRightRange = windowDimensions.width / 2 + buttonWidth / 2
    const slideToLeftRange = -(windowDimensions.width / 2 + buttonWidth / 2)

    const slideToRightAnimation = transitionAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, slideToRightRange]
    })

    const slideToLeftAnimation = transitionAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, slideToLeftRange]
    })

    useEffect(() => {
        rnTextSize.measure({
            text: headline,
            ...style.headlineFont
        }).then(setHeaderDimensions)
    }, [])

    const onPress = (action: Action) => {
        setPressedAction(action)
        Animated.timing(transitionAnimation, {
            easing: Easing.exp,
            toValue: 1,
            duration: 250,
            useNativeDriver: true
        }).start(() => props.onSelectAction(action))
    }

    const renderedButton = (action: Action, title: string) => {
        return (
            <Animated.View style={{
                transform: [{
                    translateX: pressedAction == action ? slideToRightAnimation : slideToLeftAnimation
                }]
            }}>
                <Button disabled={!isUndefined(pressedAction)} width={200} onPress={() => onPress(action)} title={title} horizontalCentered />
            </Animated.View>
        )
    }

    return (
        <Fullscreen backgroundColor={theme.colors.background}>
            <ConnectionIndicator />

            <Column horizontalCentered verticalCentered height={"100%"}>

                <Animated.Text style={{
                    ...style.headline,
                    ...style.headlineFont,
                    transform: [{
                        translateY: transitionAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, -(40 + (isUndefined(headerDimensions) ? 0 : headerDimensions.height))]
                        })
                    }]
                }}>
                    Beer Pong
                </Animated.Text>

                {renderedButton("manualControl", "Manual Control")}
                <Gap size={20} />
                {renderedButton("start", "Spielen")}
                <Gap size={20} />
                {renderedButton("tableSetup", "Tisch verbinden")}
                <Gap size={20} />
                {renderedButton("exit", "Beenden")}
            </Column>
        </Fullscreen>
    )
}

const style = StyleSheet.create({
    headlineFont: {
        fontSize: 40,
        fontWeight: "bold"
    },
    headline: {
        top: 40,
        position: "absolute",
    }
})