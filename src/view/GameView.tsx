import React, { useEffect, useRef, useState } from 'react';
import { Animated, BackHandler, Text, View } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import { Orientation, StyledPot } from '../components/PotLayout';
import { BallsBack, BombShot, ShotType, SpecificPot } from '../lib/GameState';
import GameConfig, { BombMode } from '../model/GameConfig';
import { GameStatistics } from '../model/GameStatistics';
import { GameStateProvider, useGameState } from '../provider/GameStateProvider';
import { useTableConnection } from '../provider/TableConnectionProvider';
import { TableView, ViewFocus } from './TableView';
import CustomIcon from '../icons/CustomIcon';
import {
    GameReplayBufferProvider,
    useGameReplayBuffer,
} from '../provider/GameReplayBufferProvider';
import FullScreenOverlay from '../components/FullScreenOverlay';
import { Button } from '../components/Button';
import Row from '../components/Row';
import Column from '../components/Column';
import Fullscreen from '../components/FullScreen';
import Gap from '../components/Gap';
import { isUndefined } from 'lodash';
import { PacketPayloadBuilder } from '../lib/PacketPayloadBuilder';
import { Color } from '../model/Color';

interface SpecialEvent {
    name: string;
    description: string;
}

const bombSpecialEvent = (
    bombMode: BombMode,
    nBallsToSelect: number,
): SpecialEvent => {
    let description = '';
    switch (bombMode) {
        case BombMode.CupsAroundShot:
            description =
                'Becher um den getroffenen Becher sind ebenfalls getroffen.';
            break;
        case BombMode.SelectNCups:
            description = `Wähle ${nBallsToSelect} zusätzlich Becher zum entfernen aus.`;
    }
    return {
        name: 'Bombe',
        description: description,
    };
};

const ballsBackSpecialEvent: SpecialEvent = {
    name: 'Balls Back',
    description: 'Bälle zum aktuellen Team zurück.',
};

export function GameView(props: {
    gameConfig: GameConfig;
    startTeam: number;
    onGameEnd: (gameStats: GameStatistics) => void;
    onCancelGame: () => void;
}) {
    return (
        <GameReplayBufferProvider replayBufferLen={10}>
            <GameStateProvider
                gameConfig={props.gameConfig}
                startTeam={props.startTeam}>
                <GameTable
                    onGameEnd={props.onGameEnd}
                    onCancelGame={props.onCancelGame}
                />
            </GameStateProvider>
        </GameReplayBufferProvider>
    );
}

function GameTable(props: {
    onGameEnd: (gameStats: GameStatistics) => void;
    onCancelGame: () => void;
}) {
    const { onGameEnd } = props;

    const theme = useTheme();
    const [gameState, setGameState] = useGameState();
    const [gameReplayBuffer, setGameReplayBuffer] = useGameReplayBuffer();
    const [viewFocus, setViewFocus] = useState(ViewFocus.FullTable);
    const tableConnection = useTableConnection();
    const [shotTypeSelected, setShotTypeSelected] = useState<ShotType>(
        ShotType.Normal,
    );
    const [tableOrientation, setTableOrientation] = useState<Orientation>(
        Orientation.Horizontal,
    );
    const [tryCancel, setTryCancel] = useState(false);
    const [specialEvent, setSpecialEvent] = useState<
        SpecialEvent | undefined
    >();
    const [showSpecialEventOverlay, setShowSpecialEventOverlay] =
        useState(false);
    const setTryCancelRef = useRef(setTryCancel).current;

    const currentTeam = gameState.currentTeam();
    useEffect(() => {
        switchSideViewBasedOnTeamId(currentTeam.id);
    }, [currentTeam.id]);

    useEffect(() => {
        const teamHasWon = gameState.teamHasWon();
        if (teamHasWon !== undefined) {
            const stats = gameState.createGameStatistics()!;
            onGameEnd(stats);
        }
    }, [gameState, onGameEnd]);

    useEffect(() => {
        let sub = BackHandler.addEventListener('hardwareBackPress', () => {
            if (tryCancel) {
                setTryCancelRef(false);
            } else {
                onTryCancelGame();
            }

            return true;
        });
        return () => {
            sub.remove();
        };
    }, [tryCancel, setTryCancelRef]);

    useEffect(() => {
        let interval: undefined | NodeJS.Timer;
        if (!isUndefined(gameState.specialEvent)) {
            if (gameState.specialEvent instanceof BombShot) {
                const extraConfig = gameState.gameConfig.extraConfig;
                setSpecialEvent(
                    bombSpecialEvent(
                        extraConfig.bombMode,
                        extraConfig.ballsToSelectForBomb,
                    ),
                );
                interval = showSpecialEventOverlayForTime();
            } else if (gameState.specialEvent instanceof BallsBack) {
                setSpecialEvent(ballsBackSpecialEvent);
                interval = showSpecialEventOverlayForTime();
            }
        } else {
            setSpecialEvent(undefined);
        }

        return () => {
            if (!isUndefined(interval)) {
                clearInterval(interval);
            }
        };
    }, [gameState.specialEvent, gameState.gameConfig.extraConfig]);

    const showSpecialEventOverlayForTime = () => {
        setShowSpecialEventOverlay(true);
        return setInterval(() => setShowSpecialEventOverlay(false), 5000);
    };

    const onTryCancelGame = () => {
        setTryCancel(true);
    };

    const toggleFullScreen = () => {
        if (viewFocus === ViewFocus.FullTable) {
            switchSideViewBasedOnTeamId(gameState.currentTeam().id);
        } else {
            setViewFocus(ViewFocus.FullTable);
        }
    };

    const switchSideViewBasedOnTeamId = (id: number) => {
        switch (id) {
            case 0:
                setViewFocus(ViewFocus.TeamBottom);
                break;
            case 1:
                setViewFocus(ViewFocus.TeamTop);
                break;
        }
    };

    const onPressPot = (pot: SpecificPot) => {
        // tableConnection.send(Package.setPotColors([pot], Color.blue()).pack())
        const snapshot = gameState.createSnapShot();
        gameReplayBuffer.pushGameState(snapshot);
        setGameReplayBuffer({
            ...gameReplayBuffer,
        });

        setGameState(currGameState => {
            currGameState.shotPot(pot, shotTypeSelected);
            return currGameState;
        });
    };

    const potStyleMapping = (tableSide: number): StyledPot[] => {
        return gameState.getTeam(tableSide)!.pots.map(pot => {
            const potColor =
                pot.state.shotsPerRound === 2
                    ? 'purple'
                    : pot.state.shotsPerRound > 0
                    ? 'yellow'
                    : !pot.state.available
                    ? 'green'
                    : 'red';
            tableConnection.send(
                PacketPayloadBuilder.setPotColor(
                    pot.id,
                    tableSide,
                    Color.fromString(potColor)!,
                ),
            );
            return {
                potId: pot.id,
                style: {
                    color: potColor,
                    bordered: false,
                    overlay: undefined,
                },
                pressable:
                    viewFocus !== ViewFocus.FullTable && pot.state.available,
            };
        });
    };

    const onNoHit = () => {
        let snapshot = gameState.createSnapShot()!;
        gameState.notHitPot();
        setShotTypeSelected(ShotType.Normal);
        setGameState({
            ...gameState,
        });

        gameReplayBuffer.pushGameState(snapshot);
        setGameReplayBuffer({
            ...gameReplayBuffer,
        });
    };

    const toggleTableOrientation = () => {
        switch (tableOrientation) {
            case Orientation.Horizontal:
                setTableOrientation(Orientation.Vertical);
                break;
            case Orientation.Vertical:
                setTableOrientation(Orientation.Horizontal);
                break;
        }
    };

    const replayGameState = () => {
        let lastGameState = gameReplayBuffer.popGameState()!;
        setGameReplayBuffer({
            ...gameReplayBuffer,
        });
        gameState.setFromSnapShot(lastGameState);
        setGameState({
            ...gameState,
        });
    };

    const renderedCancelView = () => {
        return (
            <FullScreenOverlay
                contentCenter
                backgroundColor="black"
                opacity={0.6}
                onPressAway={() => setTryCancel(false)}>
                <Column
                    style={{
                        backgroundColor: theme.colors.background,
                        borderRadius: 20,
                        padding: 20,
                    }}
                    stretch
                    horizontalCentered
                    width={260}
                    height={200}>
                    <Text
                        style={{
                            fontSize: 25,
                            textAlign: 'center',
                        }}>
                        Spiel wirklich beenden?
                    </Text>
                    <Row stretch>
                        <Button
                            width={100}
                            title="Nein"
                            onPress={() => setTryCancel(false)}
                        />
                        <Gap size={20} />
                        <Button
                            width={100}
                            title="Ja"
                            onPress={() => props.onCancelGame()}
                        />
                    </Row>
                </Column>
            </FullScreenOverlay>
        );
    };

    const renderedSpecialEventView = () => {
        console.log(specialEvent?.name);
        return (
            <FullScreenOverlay
                contentCenter
                backgroundColor="black"
                opacity={0.4}>
                <Column
                    width={300}
                    horizontalCentered
                    style={{
                        backgroundColor: 'gray',
                        padding: 20,
                        borderRadius: 20,
                    }}>
                    <Text
                        style={{
                            fontSize: 30,
                            fontWeight: 'bold',
                        }}>
                        {specialEvent?.name}
                    </Text>
                    <Gap size={20} />
                    <Text
                        style={{
                            fontSize: 20,
                            textAlign: 'center',
                        }}>
                        {specialEvent?.description}
                    </Text>
                </Column>
            </FullScreenOverlay>
        );
    };

    const newLocal = '100%';
    return (
        <Fullscreen backgroundColor={theme.colors.background}>
            <Row style={{ width: newLocal }} stretch>
                <IconButton
                    icon={'crop-rotate'}
                    color="white"
                    onPress={toggleTableOrientation}
                />
                <IconButton
                    icon={'undo'}
                    disabled={gameReplayBuffer.length() === 0}
                    color="white"
                    onPress={replayGameState}
                />
            </Row>
            <Column horizontalCentered>
                <TableView
                    labels={[
                        gameState.getTeam(0)!.name,
                        gameState.getTeam(1)!.name,
                    ]}
                    tableOrientation={tableOrientation}
                    viewFocus={viewFocus}
                    onPressPot={onPressPot}
                    potsBottom={potStyleMapping(1)}
                    potsTop={potStyleMapping(0)}
                />
            </Column>

            <BottomInfoView
                selectedShotType={shotTypeSelected}
                onSelectShotType={shotType => setShotTypeSelected(shotType)}
                nthShot={gameState.getTeamShotCount()}
                maxShotsPerTeam={gameState.gameConfig.ballsPerTeam}
                onNoHit={onNoHit}
                onToggleFullScreen={toggleFullScreen}
                collapsed={viewFocus === ViewFocus.FullTable}
                currentTeam={gameState.currentTeam().name}
            />

            {showSpecialEventOverlay && renderedSpecialEventView()}
            {tryCancel && renderedCancelView()}
        </Fullscreen>
    );
}

const BottomInfoView = (props: {
    currentTeam: string;
    nthShot: number;
    maxShotsPerTeam: number;
    collapsed: boolean;
    selectedShotType: ShotType;
    onSelectShotType: (shotType: ShotType) => void;
    onNoHit: () => void;
    onToggleFullScreen: () => void;
}) => {
    const BODY_HIGHT = 300;
    const animate = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const slideUp = () => {
            Animated.timing(animate, {
                toValue: BODY_HIGHT,
                duration: 250,
                useNativeDriver: false,
            }).start();
        };

        const slideDown = () => {
            Animated.timing(animate, {
                toValue: 0,
                duration: 250,
                useNativeDriver: false,
            }).start();
        };

        if (props.collapsed) {
            slideDown();
        } else {
            slideUp();
        }
    }, [props.collapsed, animate]);

    return (
        <View
            style={{
                width: '100%',
                position: 'absolute',
                bottom: 0,
                backgroundColor: 'gray',
                paddingHorizontal: 20,
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,
            }}>
            <View
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginVertical: 20,
                }}>
                <Text style={{ fontSize: 20 }}>
                    Team {props.currentTeam} wirft
                </Text>
                <Text style={{ fontSize: 20 }}>
                    Wurf: {props.nthShot + 1}/{props.maxShotsPerTeam}
                </Text>
                <IconButton
                    icon={!props.collapsed ? 'fullscreen' : 'fullscreen-exit'}
                    onPress={props.onToggleFullScreen}
                />
            </View>

            <Animated.View style={{ height: animate, width: '100%' }}>
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'space-between',
                    }}>
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <IconButton
                            icon={args => (
                                <CustomIcon name="normal-shot" {...args} />
                            )}
                            onPress={() =>
                                props.onSelectShotType(ShotType.Normal)
                            }
                            color={
                                props.selectedShotType === ShotType.Normal
                                    ? 'green'
                                    : 'black'
                            }
                            size={40}
                        />
                        <IconButton
                            icon={args => (
                                <CustomIcon name="bouncing-ball" {...args} />
                            )}
                            onPress={() =>
                                props.onSelectShotType(ShotType.Bounce)
                            }
                            color={
                                props.selectedShotType === ShotType.Bounce
                                    ? 'green'
                                    : 'black'
                            }
                            size={40}
                        />
                        <IconButton
                            icon={args => (
                                <CustomIcon name="trick-shot" {...args} />
                            )}
                            onPress={() =>
                                props.onSelectShotType(ShotType.Trick)
                            }
                            color={
                                props.selectedShotType === ShotType.Trick
                                    ? 'green'
                                    : 'black'
                            }
                            size={40}
                        />
                    </View>

                    <View
                        style={{
                            height: '100%',
                            width: 2,
                            backgroundColor: '#a8a8a8',
                        }}
                    />
                    <IconButton
                        icon={args => (
                            <CustomIcon name="not-hit-shot" {...args} />
                        )}
                        onPress={props.onNoHit}
                        color={'#c73e3e'}
                        size={40}
                    />
                    <IconButton
                        icon={args => (
                            <CustomIcon name="ball-roll-back" {...args} />
                        )}
                        onPress={props.onNoHit}
                        color={'#c73e3e'}
                        size={40}
                    />
                </View>
            </Animated.View>
        </View>
    );
};
