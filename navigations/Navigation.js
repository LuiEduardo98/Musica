import React from 'react'
import { View, Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Icon } from 'react-native-elements'

import MusicaStack from './MusicaStack'
import AccountStack from './AccountStack'
import FavoritesStack from './FavoritesStack'
import SearchStack from './SearchStack'
import TopMusicaStack from './TopMusicaStack'

const Tab = createBottomTabNavigator()

export default function Navigation() {
    const screenOptions = (route, color) => {
        let iconName
        switch (route.name) {
            case "musica":
                iconName = "account-music"
                break;
            case "favorites":
                iconName = "account-star"
                break;
            case "top-musica":
                iconName = "music-circle-outline"
                break;
            case "search":
                iconName = "bulletin-board"
                break;
            case "accout":
                iconName = "account-box"
                break;           
        }

        return (
            <Icon
            type="material-community"
            name={iconName}
            size={22}
            color={color}
            />
        )
    }
    
    
    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName="musica"
                tabBarOptions={{
                    inactiveTintColor:"#FCD312",
                    activeTintColor: "#6B002F"
                }}
                screenOptions={({ route }) =>({
                    tabBarIcon: ({color}) => screenOptions(route, color)
                })}
            >
                <Tab.Screen
                    name="musica"
                    component={MusicaStack}
                    options={{title: "Musica"}}
                />
            <Tab.Screen
                    name="favorites"
                    component={FavoritesStack}
                    options={{title: "Favoritos"}}
                />
            <Tab.Screen
                    name="top-musica"
                    component={TopMusicaStack}
                    options={{title: "Top-Musica"}}
                />
            <Tab.Screen
                    name="search"
                    component={SearchStack}
                    options={{title: "Search"}}
                />
            <Tab.Screen
                    name="accout"
                    component={AccountStack}
                    options={{title: "Account"}}
                />
            </Tab.Navigator>
        </NavigationContainer>
    )
}
