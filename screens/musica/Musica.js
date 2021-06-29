import React, { useState, useEffect, useCallback } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Icon } from 'react-native-elements' 
import Loading from '../../components/Loading'
import firebase  from 'firebase/app'
import { useFocusEffect } from '@react-navigation/native'
import { getMoreMusica, getMusica } from '../../utils/actions'
import { size } from 'lodash'
import Listmusica from '../../components/musica/ListMusica'


export default function Musica({ navigation} ) {
    const [user, setUser] = useState(null)
    const [startMusica, setStartMusica] = useState(null)
    const [musics, setMusics] = useState([])
    const [loading, setLoading] = useState(false)

    const limitMusica = 7



useEffect(() => {
    firebase.auth().onAuthStateChanged((userInfo) => {
        userInfo ? setUser(true) : setUser(false)
        })
}, [])

useFocusEffect(
    useCallback(() => {
        async function getData() {
            setLoading(true)
            const response = await getMusica(limitMusica)
            if (response.statusResponse) {
                setStartMusica(response.startMusica)
                setMusics(response.musics)
            }
            setLoading(false)
            }
                getData()
    }, [])
)

const handleLoadMore = async() => {
    if (!startMusica) {
        return
    }

    setLoading(true)
    const response = await getMoreMusica(limitMusica, startMusica)
    if (response.statusResponse) {
        setStartMusica(response.startMusica)
        setMusics([...musics, ...response.musics])
    }
    setLoading(false)
}


    if (user === null){
        return <Loading isVisible={true} text="Cargando...."/>
    }


    return (
        <View style={styles.viewBody}>
            {
                size(musics) > 0 ? (
                    <Listmusica
                        musics={musics}
                        navigation={navigation}
                        handleLoadMore={handleLoadMore}
                    />
                )   :   (
                        <View style={styles.notFoundView}>
                            <Text style={styles.notFoundText}>No hay registrado...</Text>
                        </View>
                )
            }
            {   user && (
                <Icon
             type="material-community"
             name="plus"
             color="#442484"
             reverse
             containerStyle={styles.btnContainer}
             onPress={() => navigation.navigate("add-musica")}
            />
       
             )
        }
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#fff"
    },
    btnContainer: {
        position: "absolute",
        bottom: 10,
        right:10,
        shadowColor: "black",
        shadowOffset: {width: 2, height: 2},
        shadowOpacity: 0.5
    },
    notFoundText: {
        fontSize: 18,
        fontWeight: "bold"
    },
    notFoundView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
})
