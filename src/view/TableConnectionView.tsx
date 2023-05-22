import React, { useEffect, useState } from "react";
import { useWindowDimensions, Text, BackHandler } from "react-native";
import { useTheme } from "react-native-paper";
import { HeaderBar } from "../components/HeaderBar";
import { Barcode } from 'vision-camera-code-scanner';
import { isUndefined } from "lodash";
import QRCodeScanner from "../components/QRCodeScanner";
import Fullscreen from "../components/FullScreen";
import Centered from "../components/Centered";

export default function TableConnectionView(props: {
    onClose: () => void
}) {

    const theme = useTheme()
    const [barcode, setBarcode] = useState<Barcode | undefined>()
    const deviceDimensions = useWindowDimensions()

    useEffect(() => {
        let sub = BackHandler.addEventListener("hardwareBackPress", () => {
            props.onClose()
            return true
        })
        return () => {
            sub.remove()
        }
    })

    return (
        <Fullscreen backgroundColor={theme.colors.background}>
            <HeaderBar headerLabel="Tisch verbinden" onClose={props.onClose} />
            {
                isUndefined(barcode) &&
                <Centered>
                    <QRCodeScanner
                        cameraHeight={deviceDimensions.width}
                        cameraWidth={deviceDimensions.width}
                        onFoundCorrectQRCode={setBarcode}
                    />
                </Centered>
            }
            {
                barcode &&
                <Centered>
                    <Text>Identifier: {barcode.content.data}</Text>
                </Centered>

            }
        </Fullscreen >
    )
}