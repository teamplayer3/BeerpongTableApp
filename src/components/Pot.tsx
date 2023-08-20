import React from 'react';
import {
    Animated,
    GestureResponderEvent,
    TouchableOpacity,
} from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

const borderWidth = 3;
const divideBorder = 1;
const borderColor = 'red';

export default function PotComponent(props: {
    potId: number;
    size: number;
    scale?: Animated.Value;
    bordered: boolean;
    color: string;
    overlay: any;
    onPress: () => void;
    pressable?: boolean;
    backdropColor?: string;
}) {
    const { size, onPress } = props;
    const scale = props.scale ? props.scale : new Animated.Value(1);
    const innerSize = size - (2 * borderWidth - 2 * divideBorder);
    const AnimatedTouchable =
        Animated.createAnimatedComponent(TouchableOpacity);
    const backdropSize = innerSize + 30;

    const halfSize = size / 2;

    const innerSizeAnimated = Animated.multiply(scale, innerSize);
    const halfSizeAnimated = Animated.multiply(scale, halfSize);

    const onPressInner = (event: GestureResponderEvent) => {
        event.persist();
        onPress();
    };

    return (
        <AnimatedTouchable
            style={{
                position: 'relative',
                width: size,
                height: size,
                borderRadius: halfSizeAnimated,
            }}
            onPress={onPressInner}
            disabled={!props.pressable}>
            {props.bordered && (
                <Animated.View
                    style={{
                        width: size,
                        height: size,
                        position: 'absolute',
                        borderRadius: halfSizeAnimated,
                        left: 0,
                        top: 0,
                        borderStyle: 'solid',
                        borderWidth: borderWidth,
                        borderColor: borderColor,
                    }}
                />
            )}
            {props.backdropColor && (
                <BackdropColor
                    color={props.backdropColor}
                    size={backdropSize}
                    scale={scale}
                />
            )}
            <Animated.View
                style={{
                    position: 'absolute',
                    left: borderWidth + divideBorder,
                    top: borderWidth + divideBorder,
                    backgroundColor: props.color,
                    width: innerSizeAnimated,
                    height: innerSizeAnimated,
                    borderRadius: Animated.divide(innerSizeAnimated, 2),
                }}
            />
        </AnimatedTouchable>
    );
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const BackdropColor = (props: {
    color: string;
    size: number;
    scale: Animated.Value;
}) => {
    const svgCircleAnimation = Animated.multiply(props.scale, props.size / 2);

    return (
        <Svg
            width={props.size}
            height={props.size}
            viewBox={`0 0 ${props.size} ${props.size}`}
            fill="none">
            <Defs>
                <RadialGradient id="myGradient">
                    <Stop offset="30%" stopColor={props.color} />
                    <Stop offset="200%" stopColor="rgba(0, 0, 0, 0)" />
                </RadialGradient>
            </Defs>
            <AnimatedCircle
                cx={svgCircleAnimation}
                cy={svgCircleAnimation}
                r={svgCircleAnimation}
                fill="url('#myGradient')"
            />
        </Svg>
    );
};
