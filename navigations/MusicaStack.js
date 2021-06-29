import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import Musica from '../screens/musica/Musica'
import AddMusica from '../screens/musica/AddMusica'
import Musicau from '../screens/musica/Musicau'
import AddReviewMusica from '../screens/musica/AddReviewMusica'

const Stack = createStackNavigator()

export default function MusicaStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="musica"
                component={Musica}
                options={{title: "Musica"}}
            />
            <Stack.Screen
                name="add-musica"
                component={AddMusica}
                options={{title: "Crear Musica"}}
            />
            <Stack.Screen
                name="musicau"
                component={Musicau}
            />
            <Stack.Screen
                name="add-review-musica"
                component={AddReviewMusica}
                options={{title: "Nuevo Comentario"}}
            />
        </Stack.Navigator>
    )
}
