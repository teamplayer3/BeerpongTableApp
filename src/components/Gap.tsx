import React from 'react';
import { View } from 'react-native';

export default function Gap(props: { size: number }) {
    return (
        <View
            style={{
                width: props.size,
                height: props.size,
            }}
        />
    );
}
