import React, { useEffect, useRef, useState } from 'react';
import {
    LayoutChangeEvent,
    LayoutRectangle,
    PanResponder,
    PanResponderGestureState,
    View,
    ViewStyle,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { Color } from '../model/Color';
import { rgbToHex } from '../util/Utils';

const pickerSize = 20;
const pickerWidth = 40;

export default function ColorPicker(props: {
    height: number;
    startColor: Color;
    onClolorChange: (color: Color) => void;
    style?: ViewStyle;
}) {
    const { height, startColor, onClolorChange, style } = props;
    const [rect, setRect] = useState<LayoutRectangle>({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    });

    const [picker, setPicker] = useState<{
        r: number;
        g: number;
        b: number;
        x: number;
        size: number;
    }>({
        r: startColor.r,
        g: startColor.g,
        b: startColor.b,
        x: 0,
        size: pickerSize,
    });

    useEffect(() => {
        const x = colorToX(rect.width, startColor);
        setPicker({
            ...picker,
            r: startColor.r,
            g: startColor.g,
            b: startColor.b,
            x: x,
        });
    }, [rect, startColor, picker]);

    const theme = useTheme();

    const viewRef = useRef<View | null>(null);

    const recalcColorAndPos = (dx: number) => {
        const x = picker.x + dx;
        const x_ = ranged(x, 0, rect.width);
        const color = calcInterpolatedColor(x_);
        onClolorChange(new Color(color.r, color.g, color.b));
        return {
            ...color,
            x: x_,
        };
    };

    const updateColorAndState = (dx: number) => {
        const colorAndPos = recalcColorAndPos(dx);
        setPicker({
            ...picker,
            ...colorAndPos,
        });
    };

    const colorToX = (width: number, color: Color) => {
        const max = 0xff;
        const step = (tStep: number) => (1 / 6) * tStep * width;
        const interpolate = (step_: number, c: number) =>
            step(step_) +
            ((step(step_ + 1) - step(step_)) / (max - 0)) * (c - 0);

        let x = 0;
        const { r, g, b } = color;

        if (r === max && b === 0) {
            x = interpolate(0, g);
        } else if (g === max && b === 0) {
            x = interpolate(1, max - r);
        } else if (r === 0 && g === max) {
            x = interpolate(2, b);
        } else if (r === 0 && b === max) {
            x = interpolate(3, max - g);
        } else if (g === 0 && b === max) {
            x = interpolate(4, r);
        } else if (r === max && g === 0) {
            x = interpolate(5, max - b);
        }

        return x;
    };

    const calcInterpolatedColor = (x: number) => {
        const max = 0xff;
        const step = (tStep: number) => (1 / 6) * tStep * rect.width;
        const interpolate = (tStep: number, _x: number) =>
            0 +
            ((max - 0) / (step(tStep + 1) - step(tStep))) * (x - step(tStep));
        let r = 0,
            g = 0,
            b = 0;

        if (x < step(1)) {
            r = max;
            g = interpolate(0, x);
            b = 0;
        } else if (x < step(2)) {
            r = max - interpolate(1, x);
            g = max;
            b = 0;
        } else if (x < step(3)) {
            r = 0;
            g = max;
            b = interpolate(2, x);
        } else if (x < step(4)) {
            r = 0;
            g = max - interpolate(3, x);
            b = max;
        } else if (x < step(5)) {
            r = interpolate(4, x);
            g = 0;
            b = max;
        } else if (x <= step(6)) {
            r = max;
            g = 0;
            b = max - interpolate(5, x);
        }

        return {
            r: r,
            g: g,
            b: b,
        };
    };

    const onLayout = (event: LayoutChangeEvent) => {
        setRect({
            ...event.nativeEvent.layout,
            width: event.nativeEvent.layout.width - pickerWidth,
        });
    };

    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponderCapture: () => true,
        onStartShouldSetPanResponder: () => true,
        onPanResponderStart: () => onTouch(),
        onPanResponderMove: (_, gestureState) => onMove(gestureState),
        onPanResponderRelease: () => onTouchEnd(),
    });

    const onTouchEnd = () => {
        setPicker({
            ...picker,
            size: pickerSize,
        });
    };

    const onTouch = () => {
        const color = calcInterpolatedColor(picker.x);
        onClolorChange(new Color(color.r, color.g, color.b));
        setPicker({
            ...picker,
            size: (pickerSize * 3) / 2,
        });
    };

    const onMove = (gestureState: PanResponderGestureState) => {
        // console.log(gestureState.vx * 1e10)
        updateColorAndState(gestureState.dx);
    };

    const ranged = (value: number, min: number, max: number) => {
        return value < min ? min : value > max ? max : value;
    };

    return (
        <View
            ref={viewRef}
            onLayout={onLayout}
            style={{
                paddingLeft: pickerWidth / 2,
                paddingRight: pickerWidth / 2,
                height: height,
                position: 'relative',
                ...style,
            }}>
            <Svg width="100%" height={height} preserveAspectRatio="slice">
                <Defs>
                    <LinearGradient id="gradient">
                        <Stop
                            offset={`${(100 / 6) * 0}%`}
                            stopColor="#ff0000"
                        />
                        <Stop
                            offset={`${(100 / 6) * 1}%`}
                            stopColor="#ffff00"
                        />
                        <Stop
                            offset={`${(100 / 6) * 2}%`}
                            stopColor="#00ff00"
                        />
                        <Stop
                            offset={`${(100 / 6) * 3}%`}
                            stopColor="#00ffff"
                        />
                        <Stop
                            offset={`${(100 / 6) * 4}%`}
                            stopColor="#0000ff"
                        />
                        <Stop
                            offset={`${(100 / 6) * 5}%`}
                            stopColor="#ff00ff"
                        />
                        <Stop
                            offset={`${(100 / 6) * 6}%`}
                            stopColor="#ff0000"
                        />
                    </LinearGradient>
                </Defs>

                <Rect
                    x="0"
                    y="0"
                    width="100%"
                    height={height}
                    fill="url(#gradient)"
                />
            </Svg>

            <View
                style={{
                    position: 'absolute',
                    top: 0,
                    left: picker.x,
                    width: pickerWidth,
                    height: height,
                    backgroundColor: 'gray',
                    opacity: 0.25,
                }}
                {...panResponder.panHandlers}
            />
            {rect.width !== 0 && (
                <View
                    style={{
                        width: picker.size,
                        height: picker.size,
                        position: 'absolute',
                        top: -(picker.size + theme.spacing(1)),
                        borderRadius: picker.size / 2,
                        left: picker.x - picker.size / 2 + pickerWidth / 2,
                        backgroundColor: rgbToHex(picker.r, picker.g, picker.b),
                    }}
                />
            )}
        </View>
    );
}
