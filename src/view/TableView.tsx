import { isString } from 'lodash';
import React, { ReactNode, useEffect, useRef } from 'react'
import { Animated, Text, View } from "react-native";
import { Orientation, PotLayout, StyledPot } from '../components/PotLayout';
import { SpecificPot } from '../lib/GameState';

const SLIDE_TRANSLATE_OFF = -360

export enum ViewFocus {
    FullTable = 0,
    TeamTop = 1,
    TeamBottom = 2
}

export function TableView(props: {
    viewFocus: ViewFocus,
    onPressPot: (pot: SpecificPot) => void,
    potsTop: StyledPot[],
    potsBottom: StyledPot[],
    tableOrientation: Orientation,
    labels?: string[] | ReactNode[]
}) {

    const scaleAnimation = useRef(new Animated.Value(1)).current
    const slideAnimation = useRef(new Animated.Value(SLIDE_TRANSLATE_OFF / 2)).current

    useEffect(() => {
        if (props.viewFocus === ViewFocus.TeamTop) {
            scaleDown(() => slideToFirst(() => scaleUp()))
        } else if (props.viewFocus === ViewFocus.TeamBottom) {
            scaleDown(() => slideToSecond(() => scaleUp()))
        }
    }, [props.viewFocus])

    const slideToFirst = (after?: () => void) => {
        Animated.timing(slideAnimation, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true
        }).start(after)
    }

    const slideToSecond = (after?: () => void) => {
        Animated.timing(slideAnimation, {
            toValue: SLIDE_TRANSLATE_OFF,
            duration: 250,
            useNativeDriver: true
        }).start(after)
    }

    const scaleDown = (after?: () => void) => {
        Animated.timing(scaleAnimation, {
            toValue: 0.8,
            duration: 250,
            useNativeDriver: false
        }).start(after)
    }

    const scaleUp = (after?: () => void) => {
        Animated.timing(scaleAnimation, {
            toValue: 1,
            duration: 250,
            useNativeDriver: false
        }).start(after)
    }

    const onPress = (idx: number, tableIdx: number) => {
        props.onPressPot({
            id: idx,
            teamId: tableIdx
        })
    }

    const evaluate_label_a = () => {
        if (props.labels === null || props.labels === undefined || props.labels[0] === undefined) {
            return;
        }

        return isString(props.labels[0]) ? (<Text style={{
            fontSize: 20,
            transform: [{
                rotate: "90deg"
            }]
        }} > {props.labels[0]}</ Text >) : props.labels[0]
    }

    const evaluate_label_b = () => {
        if (props.labels === null || props.labels === undefined || props.labels[1] === undefined) {
            return;
        }

        return isString(props.labels[1]) ? (<Text style={{
            fontSize: 20,
            transform: [{
                rotate: "-90deg"
            }]
        }}>{props.labels[1]}</Text>) : props.labels[1]
    }

    const label_a = evaluate_label_a()
    const label_b = evaluate_label_b()

    return (
        <View style={{
            height: 300,
            width: 350,
            overflow: "hidden",
        }}>
            <Animated.View style={{
                display: "flex",
                flexDirection: props.tableOrientation === Orientation.Vertical ? 'column' : 'row',
                alignItems: 'center',
                height: "100%",
                width: 360,
                transform: [{
                    translateX: slideAnimation
                }]
            }}>
                {label_a}
                {label_a && <View style={{ width: 2, backgroundColor: "grey", height: "100%" }}></View>}
                <Animated.View style={{
                    display: "flex",
                    flexDirection: 'column',
                    // backgroundColor: "green",
                    alignItems: 'center',
                    width: 300,
                    transform: [{
                        scale: scaleAnimation
                    }],
                    justifyContent: "space-between"
                }}>
                    <PotLayout onPress={(idx) => onPress(idx, 0)} pots={props.potsTop} horizontalFlip orientation={props.tableOrientation} />
                </Animated.View>

                <Animated.View style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    alignSelf: "center",
                    width: 300,
                    transform: [{
                        scale: scaleAnimation
                    }]
                }}>

                    <PotLayout onPress={(idx) => onPress(idx, 1)} pots={props.potsBottom} orientation={props.tableOrientation} />

                </Animated.View>
                {label_b && <View style={{ width: 2, backgroundColor: "grey", height: "100%" }}></View>}
                {label_b}

            </Animated.View >
        </View >

    )
}

