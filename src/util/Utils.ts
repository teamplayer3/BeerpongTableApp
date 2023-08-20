/*eslint no-bitwise: ["error", { "allow": ["&", ">>"] }] */
import { PermissionsAndroid, ToastAndroid } from 'react-native';
import colorString from 'color-string';

export const modifyColorOpacity = (color: string, opacity: number): string => {
    let rgbColor = colorString.get.rgb(color);
    rgbColor[3] = opacity;
    return colorString.to.rgb(rgbColor);
};

export const requestLocationPermissionForBluetooth = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Localisation for bluetooth',
                message: 'Localisation for bluetooth',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use now Bluetooth');
        } else {
            console.log('Localisation permission denied');
        }
    } catch (err) {
        console.warn(err);
    }
};

export const stringToBytes = (str: string) => {
    return Uint8Array.from(Array.from(str).map(c => c.charCodeAt(0)));
};

export const bytesToString = (bytes: Uint8Array) => {
    return bytes.reduce((data, byte) => data + String.fromCharCode(byte), '');
};

export const showToast = (message: string) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
};

export const showToastWithGravity = (message: string) => {
    ToastAndroid.showWithGravity(
        message,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
    );
};

export const MAX_BYTE_VAL = 0xff;

export type Byte = number;
export type NBytes = Uint8Array;

export const numberToByte = (value: number) => {
    return value & 0xff;
};

export const u16ToBytes = (value: number) => {
    return [(value >> 8) & 0xff, value & 0xff];
};

export const byteToHex = (byte: Byte) => {
    return `${(byte >> 4).toString(16)}${(byte & 0xf).toString(
        16,
    )}`.toUpperCase();
};

export const rgbToHex = (r: number, g: number, b: number) => {
    return `#${byteToHex(numberToByte(r))}${byteToHex(
        numberToByte(g),
    )}${byteToHex(numberToByte(b))}`;
};

export const checkByteBounds = (val: number) => {
    if (val > 0xff) throw 'value to big [0 255] -> ' + val;
};

export const checkU16Bounds = (val: number) => {
    if (val > 0xffff) throw 'value to big [0 65.536] -> ' + val;
};

export type SubHandle = (() => void) | undefined;

export const cancelSub = (handle: SubHandle) => {
    if (handle !== undefined) handle();
};

export const logObjStruct = (value: any) => {
    console.log(JSON.stringify(value, null, 4));
};
