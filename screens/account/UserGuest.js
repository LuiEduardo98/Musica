import React from 'react'
import { StyleSheet, Text, View, ScrollView, Image, ActivityIndicator } from 'react-native'
import Loading from '../../components/Loading'
import { Button } from 'react-native-elements'
import {  useNavigation  } from '@react-navigation/native'

export default function UserGuest() {
    const navigation = useNavigation()
    return (
        <ScrollView
            centerContent
            style={styles.viewBody}     
        >
            <Image
                source={require("../../assets/logomusica.png")}
                resizeMode="contain"
                style={styles.image}
                PlaceholderContent={<ActivityIndicator />}
            />
            <Text style={styles.title}>Consulta tu perfil</Text>
            <Text style={styles.description}>
                Las mejores playlist
            </Text>
            <Button
                buttonStyle={styles.button}
                title="Ver Perfil"
                onPress={() => navigation.navigate("login")}
            />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        marginHorizontal: 30
    },
    image: {
        height: 300,
        width: "100%",
        marginBottom: 10,
    },
    title: {
        fontWeight: "bold",
        fontSize: 19,
        marginVertical: 10,
        textAlign: "center"
    },
    description: {
        textAlign: "center",
        marginBottom: 20,
        color: "#000000"
    },
    button: {
        backgroundColor: "#442484"
    }
})
    
