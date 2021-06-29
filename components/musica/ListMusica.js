import { size } from 'lodash'
import React from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Image } from 'react-native-elements'
import { formatPhone } from '../../utils/helpers'


export default function Listmusica({ musics, navigation, handleLoadMore}) {
    return (
        <View>
            <FlatList
                data={musics}
                keyExtractor={(item, index) => index.toString()}
                onEndReachedThreshold={0.5}
                onEndReached={handleLoadMore}
                renderItem={(musics) => (
                    <Musica musics={musics} navigation={navigation}/>
                )}
            />
        </View>
    )
}

function Musica({musics, navigation, handleLoadMore }) {
    const { id, images, name, address, description, phone, callingCode } = musics.item
    const imageMusica = images[0]

    const goMusic = () => {
        navigation.navigate("musicau", {id, name})
    }

    return (
        <TouchableOpacity onPress={goMusic}>
            <View style={styles.viewMusica}>
                <View style={styles.viewMusicaImage}>
                    <Image
                        resizeMode="cover"
                        PlaceholderContent={<ActivityIndicator color="#fff"/>}
                        source={{ uri: imageMusica }}
                        style={styles.imageMusica}
                    />
                </View>
                <View>
                    <Text style={styles.musicaTitle}>{name}</Text>
                    <Text style={styles.musicaInformation}>{address}</Text>
                    <Text style={styles.musicaInformation}>{formatPhone(callingCode, phone)}</Text>
                    <Text style={styles.musicaDescription}>
                        {
                            size(description) > 0
                                ? `${description.substr(0, 60)}...`
                                : description
                        }
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}



const styles = StyleSheet.create({
    viewMusica: {
        flexDirection: "row",
        margin: 10,
        backgroundColor: "#E2F8F8"
    },
    viewMusicaImage: {
        marginRight: 15
    },
    imageMusica: {
        width: 90,
        height: 90
    },
    musicaTitle: {
        fontWeight: "bold"
    },
    musicaInformation: {
        paddingTop: 2,
        color: "grey"
    },
    musicaDescription: {
        paddingTop: 2,
        color: "grey",
        width: "75%"
    }
})