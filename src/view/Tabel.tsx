import React from 'react'
import { View } from "react-native";
import { TabelBottomSide, TabelTopSide } from "./TabelSide";



export default function Tabel() {

    return (
        <View style={{
            width: '100%',
            height: '100%',
            flexDirection: 'column',
            justifyContent: 'flex-end'
        }}>
            <TabelTopSide/>
            <TabelBottomSide/>
        </View>
    )
}