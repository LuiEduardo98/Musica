import React, {useRef, useState} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import AddMusicaForm from '../../components/musica/AddMusicaForm'
import Toast from 'react-native-easy-toast'
import Loading from '../../components/Loading'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function AddMusica({navigation}) {
    const toastRef = useRef()
    const [loading, setLoading] = useState(false)
    return (
        <KeyboardAwareScrollView>
            <AddMusicaForm 
            toastRef={toastRef} 
            setLoading={setLoading}
            navigation={navigation}/>
            <Loading isVisible={loading} text="Creando Musica..." />
            <Toast ref={toastRef} position="center" opacity={0.9} />
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({})
