import React, { useEffect } from 'react'
import { Text, View } from "react-native";
import { PotLayout, PotStyle, StyledPot } from '../components/PotLayout';
import { SpecificPot } from '../lib/GameState';
import { Color } from '../model/Color';
import { useGameState } from '../provider/GameStateProvider';
import { logObjStruct } from '../util/Utils';


export enum ViewFocus {
    FullTable = 0,
    TeamTop = 1,
    TeamBottom = 2
}

export function TableView(props: {
    viewFocus: ViewFocus,
    onPressPot: (pot: SpecificPot) => void,
    potsTop: StyledPot[],
    potsBottom: StyledPot[]
}) {
    const onPress = (idx: number, tableIdx: number) => {
        props.onPressPot({
            id: idx,
            teamId: tableIdx
        })
    }

    return (
        <View style={{
            flexDirection: 'column',
            justifyContent: 'space-between'
        }}>
            {
                (props.viewFocus === ViewFocus.TeamTop || props.viewFocus === ViewFocus.FullTable) &&
                <View style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginVertical: 20
                }}>
                    <PotLayout onPress={(idx) => onPress(idx, 0)} pots={props.potsTop} horizontalFlip />
                </View>
            }
            {
                (props.viewFocus === ViewFocus.TeamBottom || props.viewFocus === ViewFocus.FullTable) &&
                <View style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginVertical: 20
                }}>
                    <PotLayout onPress={(idx) => onPress(idx, 1)} pots={props.potsBottom} />
                </View>
            }

        </View>
    )
}

