import { isUndefined } from 'lodash';
import React, {
    Dispatch,
    ReactElement,
    ReactNode,
    SetStateAction,
    useRef,
    useState,
} from 'react';
import { useEffect } from 'react';
import {
    Animated,
    Easing,
    LayoutChangeEvent,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CollapsableContext = React.createContext<
    [
        expanding: boolean | undefined,
        setExpanding: Dispatch<SetStateAction<boolean | undefined>>,
    ]
>([true, () => null]);

export default function Collapsable(props: {
    children: {
        header: ReactElement;
        body: ReactElement;
    };
    backgroundColor?: string;
}) {
    const [expanding, setExpanding] = useState<boolean | undefined>();
    return (
        <CollapsableContext.Provider value={[expanding, setExpanding]}>
            {React.cloneElement(props.children.header, {
                backgroundColor: props.backgroundColor,
            })}
            {React.cloneElement(props.children.body, {
                backgroundColor: props.backgroundColor,
            })}
        </CollapsableContext.Provider>
    );
}

export const Header = (props: {
    children: ReactNode;
    backgroundColor?: string;
}) => {
    const [expanding, setExpanding] = React.useContext(CollapsableContext);
    const arrowIcon =
        isUndefined(expanding) || !expanding
            ? 'arrow-drop-down'
            : 'arrow-drop-up';
    const onToggling = () => {
        setExpanding(isUndefined(expanding) || expanding == false);
    };
    return (
        <View
            style={{ ...style.header, backgroundColor: props.backgroundColor }}>
            <Pressable
                android_ripple={{
                    borderless: true,
                }}
                onPress={onToggling}>
                <View style={style.headerInner}>
                    {props.children}
                    <Icon name={arrowIcon} color={'white'} size={20} />
                </View>
            </Pressable>
        </View>
    );
};

export const Body = (props: {
    children: ReactNode;
    backgroundColor?: string;
}) => {
    const [expanding] = React.useContext(CollapsableContext);
    const [expandedHight, setExpandedHight] = useState<number | undefined>();
    const expandedHightDefined = isUndefined(expandedHight) ? 0 : expandedHight;
    const expandAnimation = useRef(
        new Animated.Value(isUndefined(expanding) || expanding ? 0 : 1),
    ).current;

    useEffect(() => {
        if (!isUndefined(expanding)) {
            Animated.timing(expandAnimation, {
                easing: Easing.ease,
                toValue: isUndefined(expanding) || expanding ? 1 : 0,
                duration: 250,
                useNativeDriver: false,
            }).start();
        }
    });

    const onLayout = (dims: LayoutChangeEvent) => {
        const height = dims.nativeEvent.layout.height;
        setExpandedHight(height);
    };

    return (
        <Animated.View
            style={{
                overflow: 'hidden',
                height: isUndefined(expandedHight)
                    ? undefined
                    : expandAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [
                              0,
                              expandedHightDefined + style.body.marginTop,
                          ],
                      }),
            }}>
            <React.Fragment>
                <Text>Hallo</Text>
            </React.Fragment>
            <View
                style={{
                    ...style.body,
                    backgroundColor: props.backgroundColor,
                    position: 'absolute',
                    width: '100%',
                    opacity: isUndefined(expandedHight) ? 0 : 1,
                }}
                onLayout={onLayout}>
                {props.children}
            </View>
        </Animated.View>
    );
};

const boarderRadius = 10;

const style = StyleSheet.create({
    header: {
        borderRadius: boarderRadius,
    },
    headerInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 40,
        paddingHorizontal: 20,
    },
    body: {
        flexDirection: 'column',
        borderBottomLeftRadius: boarderRadius,
        borderBottomRightRadius: boarderRadius,
        paddingHorizontal: 20,
        paddingVertical: 20,
        marginTop: 3,
    },
});
