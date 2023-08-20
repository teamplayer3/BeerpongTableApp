import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import Gap from '../components/Gap';
import { Orientation, PotLayout, StyledPot } from '../components/PotLayout';
import RotatedText from '../components/RotatedText';
import { SpecificPot } from '../lib/GameState';

const SLIDE_TRANSLATE_OFF = -360;

export enum ViewFocus {
    FullTable = 0,
    TeamTop = 1,
    TeamBottom = 2,
}

export function TableView(props: {
    viewFocus: ViewFocus;
    onPressPot: (pot: SpecificPot) => void;
    potsTop: StyledPot[];
    potsBottom: StyledPot[];
    tableOrientation: Orientation;
    labels: string[];
}) {
    const scaleAnimation = useRef(new Animated.Value(1)).current;
    const slideAnimation = useRef(
        new Animated.Value(SLIDE_TRANSLATE_OFF / 2),
    ).current;

    useEffect(() => {
        const slideToFirst = (after?: () => void) => {
            Animated.timing(slideAnimation, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }).start(after);
        };

        const slideToSecond = (after?: () => void) => {
            Animated.timing(slideAnimation, {
                toValue: SLIDE_TRANSLATE_OFF,
                duration: 250,
                useNativeDriver: true,
            }).start(after);
        };

        const scaleDown = (after?: () => void) => {
            Animated.timing(scaleAnimation, {
                toValue: 0.8,
                duration: 250,
                useNativeDriver: false,
            }).start(after);
        };

        const scaleUp = (after?: () => void) => {
            Animated.timing(scaleAnimation, {
                toValue: 1,
                duration: 250,
                useNativeDriver: false,
            }).start(after);
        };

        if (props.viewFocus === ViewFocus.TeamTop) {
            scaleDown(() => slideToFirst(() => scaleUp()));
        } else if (props.viewFocus === ViewFocus.TeamBottom) {
            scaleDown(() => slideToSecond(() => scaleUp()));
        }
    }, [props.viewFocus, scaleAnimation, slideAnimation]);

    const onPress = (idx: number, tableIdx: number) => {
        props.onPressPot({
            id: idx,
            teamId: tableIdx,
        });
    };

    return (
        <View
            style={{
                height: 300,
                width: '100%',
                backgroundColor: 'red',
                position: 'relative',
                overflow: 'hidden',
            }}>
            <Animated.View
                onLayout={c => console.log(c.nativeEvent.layout)}
                style={{
                    display: 'flex',
                    flexDirection:
                        props.tableOrientation === Orientation.Vertical
                            ? 'column'
                            : 'row',
                    alignItems: 'center',
                    height: '100%',
                    position: 'absolute',
                    transform: [
                        {
                            translateX: slideAnimation,
                        },
                    ],
                }}>
                <RotatedText counterClockWise style={{ fontSize: 20 }}>
                    {props.labels[0]}
                </RotatedText>

                <Gap size={10} />
                <View
                    style={{
                        width: 2,
                        backgroundColor: 'grey',
                        height: '100%',
                    }}
                />

                <Animated.View
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        // backgroundColor: "green",
                        alignItems: 'center',
                        width: 300,
                        transform: [
                            {
                                scale: scaleAnimation,
                            },
                        ],
                        justifyContent: 'space-between',
                    }}>
                    <PotLayout
                        onPress={idx => onPress(idx, 0)}
                        pots={props.potsTop}
                        horizontalFlip
                        orientation={props.tableOrientation}
                    />
                </Animated.View>

                <Animated.View
                    style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        alignSelf: 'center',
                        width: 300,
                        transform: [
                            {
                                scale: scaleAnimation,
                            },
                        ],
                    }}>
                    <PotLayout
                        onPress={idx => onPress(idx, 1)}
                        pots={props.potsBottom}
                        orientation={props.tableOrientation}
                    />
                </Animated.View>

                <View
                    style={{
                        width: 2,
                        backgroundColor: 'grey',
                        height: '100%',
                    }}
                />
                <Gap size={10} />

                <RotatedText style={{ fontSize: 20 }}>
                    {props.labels[1]}
                </RotatedText>
            </Animated.View>
        </View>
    );
}
