import { StyleProp, Text, TextStyle, View } from 'react-native';
import React from 'react';
import { GameStatistics } from '../model/GameStatistics';
import { Button } from '../components/Button';

export const GameStatsView = (props: {
    gameStatistics: GameStatistics;
    onQuitStatistics: () => void;
}) => {
    const teamWonLine = () => {
        const textStyle: StyleProp<TextStyle> = {
            fontSize: 20,
        };
        return (
            <View style={{ display: 'flex', flexDirection: 'row' }}>
                <Text style={textStyle}>Team </Text>
                <Text style={{ fontWeight: 'bold', ...textStyle }}>
                    {props.gameStatistics.teamWonName}
                </Text>
                <Text style={textStyle}> has won</Text>
            </View>
        );
    };

    return (
        <View
            style={{
                height: '100%',
                position: 'relative',
            }}>
            {teamWonLine()}
            <Text>
                Treffer Accuracy:{' '}
                {Math.floor(
                    props.gameStatistics.winnerTeamStats().shotAccuracy * 100,
                )}
                %
            </Text>
            <View
                style={{
                    position: 'absolute',
                    bottom: 30,
                    width: '100%',
                }}>
                <Button
                    title="Fertig"
                    onPress={props.onQuitStatistics}
                    horizontalCentered
                />
            </View>
        </View>
    );
};
