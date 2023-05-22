import { isUndefined } from "lodash";
import React, { useEffect, useState } from "react";
import { BackHandler, Pressable, SafeAreaView, SectionList, Text, TextInput } from "react-native";
import { useTheme } from "react-native-paper";
import Fullscreen from "../components/FullScreen";
import { HeaderBar } from "../components/HeaderBar";
import { OverlayAddButton } from "../components/OverlayRoundButton";
import { Player } from "../model/PlayerStore";
import { usePlayerStore } from "../provider/PlayerStoreProvider";



export function PlayerSelector(props: {
    onClosePlayerSelection: () => void,
    onSelectPlayer: (player: Player) => void,
    filteredPlayers?: Player[]
}) {
    const theme = useTheme()
    const [addPlayer, setAddPlayer] = useState(false)
    const [newPlayerName, setNewPlayerName] = useState("")
    const [playerStore, setPlayerStore] = usePlayerStore()

    useEffect(() => {
        let sub = BackHandler.addEventListener("hardwareBackPress", () => {
            props.onClosePlayerSelection()
            return true
        })
        return () => {
            sub.remove()
        }
    })

    const onPressAddButton = () => {

        if (!addPlayer) {
            setAddPlayer(true)
        } else {
            if (newPlayerName.length != 0) {
                const id = playerStore.addPlayer(newPlayerName)
                console.log("new player with id " + id + " and name " + newPlayerName)
                setPlayerStore(playerStore)
                setNewPlayerName("")
            }

            setAddPlayer(false)
        }
    }

    const onSelectPlayer = (player: Player) => {
        props.onSelectPlayer(player)
    }

    const isPlayerFiltered = (player: Player): boolean => {
        if (isUndefined(props.filteredPlayers)) {
            return false
        }

        return !isUndefined(props.filteredPlayers.find((p) => p.id === player.id))
    }

    const renderedListItem = (item: Player) => {
        const filtered = isPlayerFiltered(item)
        return (
            <Pressable android_ripple={{ borderless: false }} style={{ paddingHorizontal: 20, paddingVertical: 10, marginRight: 20, marginVertical: 5 }} disabled={filtered} onPress={() => onSelectPlayer(item)}>
                <Text style={{ fontSize: 20 }}>{item.name}</Text>
            </Pressable>
        )
    }


    return (

        <Fullscreen backgroundColor={theme.colors.background}>


            <HeaderBar headerLabel="Spieler Auswahl" onClose={props.onClosePlayerSelection} />
            <SectionList sections={playerStore.getGroupedByStartLetter().map((g) => ({
                title: g.letter,
                data: g.players
            }))}
                renderItem={({ item }) => renderedListItem(item)}
                renderSectionHeader={({ section }) => <Text style={{ fontSize: 20, borderRadius: 10, fontWeight: "bold", backgroundColor: "grey", paddingHorizontal: 10, marginRight: 20 }}>{section.title}</Text>}
                keyExtractor={(item, index) => `basicListEntry-${item.id}`}
                style={{
                    marginLeft: 20,
                    marginVertical: 20,
                }}
            >
            </SectionList>

            {
                addPlayer &&
                <TextInput
                    style={{
                        position: "absolute",
                        bottom: 45,
                        left: 30,
                        width: 200,
                        borderRadius: 10,
                        backgroundColor: "grey",
                        padding: 10,
                        elevation: 5,
                        shadowColor: "white"
                    }}
                    autoFocus={true}
                    onChangeText={(text) => setNewPlayerName(text)}
                    placeholder={"Spielername"}
                    value={newPlayerName}
                />
            }


            <OverlayAddButton
                backgroundColor="grey"
                color="white"
                icon="plus"
                onPress={() => onPressAddButton()}
                size={70}
            />
        </Fullscreen >

    )
}