import React, {useState, useEffect, useCallback, useRef} from 'react'
import { Alert, Dimensions, StyleSheet, Text, ScrollView } from 'react-native'
import { View } from 'react-native'
import { addDocumentWithoutId, deleteFavorite, getCurrentUser, getDocumentById, getIsFavorite } from '../../utils/actions'
import Loading from '../../components/Loading'
import CarouselImages from '../../components/CarouselImages'
import { Rating, ListItem, Icon } from 'react-native-elements' 
import { formatPhone } from '../../utils/helpers'
import MapMusica from '../../components/musica/MapMusica'
import { map } from 'lodash'
import ListReviews from '../../components/musica/ListReviews'
import { useFocusEffect } from '@react-navigation/native'
import firebase from 'firebase/app'
import Toast from 'react-native-easy-toast'


const widthScreen = Dimensions.get("window").width

export default function Musicau( {navigation, route}) {
    const { id, name} = route.params
    const toastRef = useRef()
    
    const [musicau, setMusicau] = useState(null)
    const [activeSlide, setActiveSlide] = useState(0)
    const [isFavorite, setIsFavorite] = useState(false)
    const [userLogged, setUserLogged] = useState(false)
    const [loading, setLoading] = useState(false)

    firebase.auth().onAuthStateChanged(user => {
        user ? setUserLogged(true) : setUserLogged(false)
    })
    
    navigation.setOptions({ title: name})

    useFocusEffect(
        useCallback(() =>{
            (async() => {
                const response = await getDocumentById("musica", id)
                if (response.statusResponse){
                 setMusicau(response.document)
                } else {
                    setMusicau({})
                    Alert.alert("Ocurrio un problema, intente  mas tarde")
                }
            })()
        },[])  
    
    )

    useEffect(() => {
        (async() => {
            if (userLogged && musicau) {
                const response = await getIsFavorite(musicau.id)
                response.statusResponse && setIsFavorite(response.isFavorite)
            }
        })()
    }, [userLogged, musicau])
   
        
    const addFavorite = async () => {
        if (!userLogged) {
            toastRef.current.show("Para agregar a favoritos debe de estar logeado", 3000)
            return
        }

        setLoading(true)
        const response = await addDocumentWithoutId("favorites", {
            idUser: getCurrentUser().uid,
            idMusica: musicau.id
        })
        setLoading(false)
        if (response.statusResponse){
            setIsFavorite(true)
            toastRef.current.show("Local añadido a favoritos", 3000)
        }   else {
            toastRef.current.show("No se pudo agregar a favoritos, intenta mas tarde", 3000)
        }
    }
    
    
    const removeFavorite = async() => {
            setLoading(true)
            const response = await deleteFavorite(musicau.id)
            setLoading(false)

            if (response.statusResponse){
                setIsFavorite(false)
                toastRef.current.show("Local eliminado de favoritos", 3000)
            }   else {
                toastRef.current.show("No se pudo eliminar de favoritos, intenta mas tarde", 3000)
            }
        }


    if (!musicau) {
        return <Loading isVisible={true} text="Cargando..."/>
    }
   
    return (
        <ScrollView style={styles.viewBody}>
            <CarouselImages
                images={musicau.images}
                height={250}
                width={widthScreen}
                activeSlide={activeSlide}
                setActiveSlide={setActiveSlide}
            />
            <View style={styles.viewFavorite}>
                <Icon
                    type="material-community"
                    name={ isFavorite ? "heart-multiple" : "heart-multiple-outline" }
                    onPress={ isFavorite ? removeFavorite : addFavorite }
                    color="#fb757a"
                    size={35}
                    underlayColor="tranparent"
                />
            </View>
            <TitleMusica
                name={musicau.name}
                description={musicau.description}
                rating={musicau.rating}
            />
            <MusicaInfo
                name={musicau.name}
                location={musicau.location}
                address={musicau.address}
                email={musicau.email}
                phone={formatPhone(musicau.callingCode, musicau.phone)}
            />
            <ListReviews
             navigation={navigation}
             idMusica={musicau.id}
            />
             <Toast ref={toastRef} position="center" opacity={0.9} />
             <Loading isVisible={loading} text="Espera un momento...."/>
        </ScrollView>
    )
}

function MusicaInfo( { name, location, address, email, phone} ) {
    const listInfo = [
        {text: address, iconName: "map-marker"},
        {text: phone, iconName: "phone"},
        {text: email, iconName: "at"},
    ]

    return(
        <View style={styles.viewMusicaInfo}>
        <Text style={styles.musicaInfoTitle}>
            Informacion de musica
        </Text>
        <MapMusica
            location={location}
            name={name}
            height={150}
        />
        {
            map(listInfo, (item, index) => (
            <ListItem
                key={index}
                style={styles.containerListItem}
            >
                <Icon
                    type="material-community"
                    name={item.iconName}
                    color="#442484"
                />
                <ListItem.Content>
                    <ListItem.Title>{item.text}</ListItem.Title>
                </ListItem.Content>
            </ListItem>
            ))
        }
        </View>
    )
} 

function TitleMusica({ name, description, rating}) {
    return (
        <View style={styles.viewMusicaTitle}>
        <View style={styles.viewMusicaContainer}>
            <Text style={styles.nameMusica}>{name}</Text>
            <Rating
                style={styles.rating}
                imageSize={20}
                readonly
                startingValue={parseFloat(rating)}
            />
            </View>
            <Text style={styles.descriptionMusica}>{description}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody:{
        flex: 1,
        backgroundColor: "#fff"
    },
    viewMusicaTitle: {
        padding: 15,
    },
    viewMusicaContainer: {
        flexDirection: "row"
    },
    descriptionMusica: {
        marginTop: 8,
        color: "gray",
        textAlign: "justify"
    },
    rating: {
        position: "absolute",
        right: 0
    },
    nameMusica: {
        fontWeight: "bold"
    },
    viewMusicaInfo:{
        margin: 15,
        marginTop: 25
    },
    musicaInfoTitle:{
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15
    },
    containerListItem: {
        borderBottomColor: "#a376c7",
        borderBottomWidth: 1
    },
    viewFavorite: {
        position: "absolute",
        top: 0,
        right: 0,
        backgroundColor: "#fff",
        borderBottomLeftRadius: 100,
        padding: 5,
        paddingLeft: 15
    },
})
