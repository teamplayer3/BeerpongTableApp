import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Camera,
    useCameraDevices,
    useFrameProcessor,
} from 'react-native-vision-camera';
import {
    scanBarcodes,
    BarcodeFormat,
    Barcode,
    BarcodeValueType,
} from 'vision-camera-code-scanner';
import { runOnJS } from 'react-native-reanimated';
import { View } from 'react-native';
import { isUndefined } from 'lodash';

export default function QRCodeScanner(props: {
    onFoundCorrectQRCode: (code: Barcode) => void;
    cameraWidth: number | string;
    cameraHeight: number | string;
}) {
    const { onFoundCorrectQRCode } = props;

    const devices = useCameraDevices();
    const device = devices.back;
    const [hasPermission, setHasPermission] = useState<boolean>(false);
    const setHasPermissionRef = useRef(setHasPermission).current;

    const onQRCodeDetected = useCallback(
        (qrCode: Barcode) => {
            if (
                qrCode.content.type === BarcodeValueType.TEXT &&
                validateQrCode(qrCode.content.data)
            ) {
                onFoundCorrectQRCode(qrCode);
            }
        },
        [onFoundCorrectQRCode],
    );

    const validateQrCode = (code: string): boolean => {
        console.log(code);
        const regex = /^(\w{2}:?){6}$/;
        return regex.test(code);
    };

    const frameProcessor = useFrameProcessor(
        frame => {
            'worklet';
            const detectedBarcodes = scanBarcodes(
                frame,
                [BarcodeFormat.QR_CODE],
                { checkInverted: true },
            );
            if (detectedBarcodes.length !== 0) {
                runOnJS(onQRCodeDetected)(detectedBarcodes[0]);
            }
        },
        [onQRCodeDetected],
    );

    useEffect(() => {
        (async () => {
            const status = await Camera.requestCameraPermission();
            setHasPermissionRef(status === 'authorized');
        })();
    }, [setHasPermissionRef]);

    const MemCamera = React.memo(Camera, (prevProps, nextProps) => {
        console.log(nextProps);
        return false;
    });

    console.log(hasPermission);

    return !isUndefined(device) && hasPermission ? (
        <MemCamera
            key="camera-comp"
            style={{
                height: props.cameraHeight,
                width: props.cameraHeight,
            }}
            device={device}
            isActive={true}
            focusable={true}
            frameProcessor={frameProcessor}
            frameProcessorFps={5}
        />
    ) : (
        <View
            style={{
                width: props.cameraWidth,
                height: props.cameraHeight,
            }}
        />
    );
}
