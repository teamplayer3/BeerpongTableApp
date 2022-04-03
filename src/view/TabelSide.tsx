import React from 'react';
import { View } from "react-native"
import { Pot } from '../model/Pot';
import TabelPotView from '../components/Pot';
import PotRow from '../components/PotRow';
import { usePotHandler } from '../provider/PotHandlerProvider';

const gap = 5
const potSize = 60

export function TabelTopSide() {

    const potHandler = usePotHandler()
    const pots = potHandler.pots


    const onPress = (pot: Pot) => {
        pot.toggleSelect()
    }

    return (
        <View style={{
            flexDirection: 'column',
            alignItems: 'center',
            marginVertical: 20,
        }}>
            <PotRow gap={gap}>
                <TabelPotView pot={pots[0]} size={potSize} onPress={onPress}/>
                <TabelPotView pot={pots[1]} size={potSize} onPress={onPress}/>
                <TabelPotView pot={pots[2]} size={potSize} onPress={onPress}/>
                <TabelPotView pot={pots[3]} size={potSize} onPress={onPress}/>
            </PotRow>
            <PotRow gap={gap}>
                <TabelPotView pot={pots[4]} size={potSize} onPress={onPress}/>
                <TabelPotView pot={pots[5]} size={potSize} onPress={onPress}/>
                <TabelPotView pot={pots[6]} size={potSize} onPress={onPress}/>
            </PotRow>
            <PotRow gap={gap}>
                <TabelPotView pot={pots[7]} size={potSize} onPress={onPress}/>
                <TabelPotView pot={pots[8]} size={potSize} onPress={onPress}/>
            </PotRow>
            <PotRow gap={gap}>
                <TabelPotView pot={pots[9]} size={potSize} onPress={onPress}/>
            </PotRow>
        </View>
    )
}

export function TabelBottomSide() {

    const potHandler = usePotHandler()
    const pots = potHandler.pots
    
    const onPress = (pot: Pot) => {
        pot.toggleSelect()
    }

    return (
        <View style={{
            flexDirection: 'column',
            alignItems: 'center',
            marginVertical: 20
        }}>
            <PotRow gap={gap}>
                <TabelPotView pot={pots[19]} size={potSize} onPress={onPress}/>
            </PotRow>
            <PotRow gap={gap}>
                <TabelPotView pot={pots[18]} size={potSize} onPress={onPress}/>
                <TabelPotView pot={pots[17]} size={potSize} onPress={onPress}/>
            </PotRow>
            <PotRow gap={gap}>
                <TabelPotView pot={pots[16]} size={potSize} onPress={onPress}/>
                <TabelPotView pot={pots[15]} size={potSize} onPress={onPress}/>
                <TabelPotView pot={pots[14]} size={potSize} onPress={onPress}/>
            </PotRow>
            <PotRow gap={gap}>
                <TabelPotView pot={pots[13]} size={potSize} onPress={onPress}/>
                <TabelPotView pot={pots[12]} size={potSize} onPress={onPress}/>
                <TabelPotView pot={pots[11]} size={potSize} onPress={onPress}/>
                <TabelPotView pot={pots[10]} size={potSize} onPress={onPress}/>
            </PotRow>
        </View>
    )
}