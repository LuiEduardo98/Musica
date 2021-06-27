import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Overlay } from 'react-native-elements'
import { ActivityIndicator } from 'react-native'

export default function Loading({isVisible, text}) {
    return (
        <Overlay
            isVisible={isVisible}
            windowBackGroundColor='rgba(0,0,0,1)'
            overlayBackGroundColor='transparent'
            overlayStyle={styles.overlay}
         >
            <View style={styles.view}>
                <ActivityIndicator
                    size='large'
                    color='#000000'
                />
                {
                    text && <Text style={styles.text}>{text}</Text>
                }
            </View>
        </Overlay>
        
    )
}

const styles = StyleSheet.create({
    overlay:{
        height:100,
        width:200,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E3B434',
        borderColor: '#6B002F',
        borderWidth: 2,
        borderRadius: 10,
    },
    view:{
        flex:1,
    },
    text:{
        color:'#000000',
        marginTop:10,
        fontWeight:'bold'
    }
})
