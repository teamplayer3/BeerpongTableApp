import React, { useState } from 'react';
import { Dimensions, View, ViewStyle } from 'react-native';
import { Button, IconButton, useTheme } from 'react-native-paper';
import { Shadow } from 'react-native-shadow-2';
import ColorPicker from '../components/ColorPicker';
import { Color } from '../model/Color';
import { Pot } from '../model/Pot';
import { usePotHandler } from '../provider/PotHandlerProvider';
import { cancelSub, SubHandle } from '../util/Utils';

export default function ColorSelectView(props: {
    onClose: () => void;
    style?: ViewStyle;
}) {
    const { onClose } = props;
    const theme = useTheme();
    const width = Dimensions.get('screen').width;
    const radius = 30;

    const potHandler = usePotHandler();

    const [colorSelectState, setColorSelectState] = useState<{
        isSelecting: boolean;
        callbackHandle: SubHandle;
        pickerColor: Color;
    }>({
        isSelecting: false,
        callbackHandle: undefined,
        pickerColor: Color.red(),
    });

    const [viewHeight] = useState<number>(Dimensions.get('screen').height / 2);

    const setToColorSelecting = () => {
        const handle = potHandler.waitForPotSelect(onColorPick);
        setColorSelectState({
            ...colorSelectState,
            callbackHandle: handle,
            isSelecting: true,
        });
    };

    const onColorPick = (pot: Pot) => {
        potHandler.changeColorOfSelected(pot.color);
        setColorSelectState({
            ...setColorSelectState,
            callbackHandle: undefined,
            isSelecting: false,
            pickerColor: pot.color,
        });
    };

    const cancelColorSelcting = () => {
        cancelSub(colorSelectState.callbackHandle);
        if (!colorSelectState.isSelecting) return;
        setColorSelectState({
            ...colorSelectState,
            callbackHandle: undefined,
            isSelecting: false,
        });
    };

    const toggleColorSelecting = () => {
        if (colorSelectState.isSelecting) {
            cancelColorSelcting();
        } else {
            setToColorSelecting();
        }
    };

    return (
        <Shadow distance={15} offset={[0, 3]}>
            <View
                style={{
                    width: width,
                    height: viewHeight,
                    backgroundColor: 'white',
                    borderTopLeftRadius: radius,
                    borderTopRightRadius: radius,
                    paddingVertical: theme.spacing(2),
                    paddingHorizontal: theme.spacing(2),
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}>
                <View
                    style={{
                        flexDirection: 'row',
                        width: '100%',
                    }}>
                    <ColorPicker
                        style={{ flexGrow: 1 }}
                        startColor={colorSelectState.pickerColor}
                        onClolorChange={color =>
                            potHandler.changeColorOfSelected(color)
                        }
                        height={50}
                    />
                    <IconButton
                        color={
                            colorSelectState.isSelecting ? '#FF0000' : '#000000'
                        }
                        icon="eyedropper"
                        onPress={toggleColorSelecting}
                    />
                </View>

                <View
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                    }}>
                    <Button mode="outlined" onPress={onClose}>
                        Close
                    </Button>
                </View>
            </View>
        </Shadow>
    );
}
