import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native'
import { SearchBar, ListItem, Icon, Image } from 'react-native-elements'
import { isEmpty, size } from 'lodash'
import { searchMusicas } from '../utils/actions'

export default function Search({navigation}) {
    const [search, setSearch] = useState("")
    const [musica, setMusica] = useState([])

    console.log(musica)

    useEffect(() => {
        if (isEmpty(search)) {
            return
        }

        async function getData() {
            const response = await searchMusicas(search)
            if (response.statusResponse) {
                setMusica(response.musica)
            }
        }
        getData();
    }, [search])
    
    return (
        <View>
            <SearchBar
                placeholder="Ingresa nombre del local..."
                onChangeText={(e) => setSearch(e)}
                containerStyle={styles.searchBar}
                value={search}
            />
            {
                size(musica) > 0 ? (
                    <FlatList
                        data={musica}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={(music) => 
                            <Music
                                music={music}
                                navigation={navigation}
                            />
                        }
                    />
                ) : (
                    isEmpty(search) ? (
                        <Text style={styles.noFound}>
                            Ingrese las primeras letras del nombre del local.
                        </Text>
                    ) : (
                        <Text style={styles.noFound}>
                            No hay locales que coincidan con el critertio de búsqueda.
                        </Text>
                    )
                )
            }
        </View>
    )

}

function Music ({ music, navigation }) {
    const { id, name, images } = music.item

    return (
        <ListItem
            style={styles.menuItem}
            onPress={() => navigation.navigate("musica", {
                screen: "musicau",
                params: { id, name }
            })}
        >
            <Image
                resizeMode="cover"
                PlaceholderContent={<ActivityIndicator color="#fff"/>}
                source={{ uri: images[0] }}
                style={styles.imageMusica}
            />
            <ListItem.Content>
                <ListItem.Title>{name}</ListItem.Title>
            </ListItem.Content>
            <Icon
                type="material-community"
                name="chevron-right"
            />
        </ListItem>
    )
}

const styles = StyleSheet.create({
    searchBar: {
        marginBottom: 20,
        backgroundColor: "#fff"
    },
    imageMusica: {
        width: 90,
        height: 90
    },
    noFound: {
        alignSelf: "center",
        width: "90%"
    },
    menuItem: {
        margin: 10
    }
})
