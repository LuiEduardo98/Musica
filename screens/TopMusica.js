import React, { useState, useCallback } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { getTopMusicas } from '../utils/actions'
import Loading from '../components/Loading'
import ListTopMusicas from '../components/ranking/ListTopMusicas'

export default function TopMusica({navigation}) {
    const [musica, setMusicas] = useState(null)
    const [loading, setLoading] = useState(false)

    useFocusEffect(
        useCallback(() => {
            async function getData() {
                setLoading(true)
                const response = await getTopMusicas(10)
                if (response.statusResponse) {
                    setMusicas(response.musica)
                }
                setLoading(false)
            }
            getData()
        }, [])
    )

    return (
        <View>
            <ListTopMusicas
                musica={musica}
                navigation={navigation}
            />
            <Loading isVisible={loading} text="Por favor espera...." />
        </View>
    )
}

const styles = StyleSheet.create({})
