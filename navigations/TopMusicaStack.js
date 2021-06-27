import React from 'react'
import { View, Text } from 'react-native'
import {createStackNavigator} from '@react-navigation/stack'
import TopMusica from '../screens/TopMusica'

const Stack = createStackNavigator()

export default function TopMusicaStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="top-musica"
                component={TopMusica}
                options={{title: "Top-Musica"}}
            />
        </Stack.Navigator>
    )
}
