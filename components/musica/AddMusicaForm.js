import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, ScrollView, Alert, Dimensions } from 'react-native'
import { Input, Button, Icon, Avatar, Image } from 'react-native-elements'
import CountryPicker from 'react-native-country-picker-modal'
import { map, size, filter, isEmpty } from 'lodash' 
import Modal from '../../components/Modal'
import MapView from 'react-native-maps'
import uuid from 'random-uuid-v4'


import { addDocumentWithoutId, getCurrentUser, uploadImage } from '../../utils/actions'
import {formatPhone, getCurrentLocation, loadImageFromGallery, validateEmail} from '../../utils/helpers'

const widthScreen = Dimensions.get("window").width

export default function AddMusicaForm({ toastRef, setLoading, navigation}) {
    const [formData, setFormData] = useState(defaultFormValues())
    const [errorName, setErrorName] = useState(null)
    const [errorDescription, setErrorDescription] = useState(null)
    const [errorEmail, setErrorEmail] = useState(null)
    const [errorAddress, setErrorAddress] = useState(null)
    const [errorPhone, setErrorPhone] = useState(null)
    const [imagesSelected, setImagesSelected] = useState([])
    const [isVisibleMap, setIsVisibleMap] = useState(false)
    const [locationMusica, setLocationMusica] = useState(null)



   const addMusica = async() => {
       if (!validForm()){
           return
       }

       setLoading(true)
       const responseUploadImages = await uploadImages()
       const musica ={
            name: formData.name,
            address: formData.address,
            description: formData.description,
            callingCode: formData.callingCode,
            phone: formData.phone,
            location: locationMusica,
            email: formData.email,
            images: responseUploadImages,
            rating: 0,
            ratingTotal: 0,
            quantityVoting: 0,
            createAt: new Date(),
            createBy: getCurrentUser().uid
       }
       const responseAddDocument = await addDocumentWithoutId("musica", musica)
       setLoading(false)

       if (!responseAddDocument.statusResponse) {
        toastRef.current.show("Error al grabar, por favor intenta más tarde.", 3000)
        return
    }
        navigation.navigate("musica")
   }

   const uploadImages = async() => {
    const imagesUrl = []
    await Promise.all(
        map(imagesSelected, async(image) => {
            const response = await uploadImage(image, "musica", uuid())
            if (response.statusResponse) {
               imagesUrl.push(response.url)
            }
        })
    )
    return imagesUrl
}

   const validForm = () => {
    clearErrors()
    let isValid = true

    if (isEmpty(formData.name)) {
        setErrorName("Debes ingresar el nombre del local de musica.")
        isValid = false
    }

    if (isEmpty(formData.address)) {
        setErrorAddress("Debes ingresar la dirección del local.")
        isValid = false
    }

    if (!validateEmail(formData.email)) {
        setErrorEmail("Debes ingresar un email de local válido.")
        isValid = false
    }

    if (size(formData.phone) < 10 ) {
        setErrorPhone("Debes ingresar un teléfono de local válido.")
        isValid = false
    }

    if (isEmpty(formData.description)) {
        setErrorDescription("Debes ingresar una descripción del local.")
        isValid = false
    }

    if (!locationMusica) {
        toastRef.current.show("Debes de localizar el local en el mapa.", 3000)
        isValid = false
    } else if(size(imagesSelected) === 0) {
        toastRef.current.show("Debes de agregar al menos una imagen al local.", 3000)
        isValid = false
    }

    return isValid
}

const clearErrors = () => {
    setErrorAddress(null)
    setErrorDescription(null)
    setErrorEmail(null)
    setErrorName(null)
    setErrorPhone(null)
}
   
    return (
        <ScrollView style={styles.viewContainer}>
            <ImageMusica
                imageMusica={imagesSelected[0]}
            />
            <FormAdd
                formData={formData}
                setFormData={setFormData}
                errorName={errorName}
                errorDescription={errorDescription}
                errorEmail={errorEmail}
                errorAddress={errorAddress}
                errorPhone={errorPhone}
                setIsVisibleMap={setIsVisibleMap}
                locationMusica={locationMusica}
            />
            <UploadImage
            toastRef={toastRef}
            imagesSelected={imagesSelected}
            setImagesSelected={setImagesSelected}
            />
            <Button
                title="Crear Musica"
                onPress={addMusica}
                buttonStyle={styles.btnAddMusica}
            />
            <MapMusica
                isVisibleMap={isVisibleMap}
                setIsVisibleMap={setIsVisibleMap}
                setLocationMusica={setLocationMusica}
                toastRef={toastRef}
            />
        </ScrollView>
    )
}

function MapMusica({ isVisibleMap, setIsVisibleMap, setLocationMusica, locationMusica, toastRef }) {
    const [newRegion, setNewRegion] = useState(null)
    
    useEffect(() => {
        (async() =>{
            const response = await getCurrentLocation()
            if (response.status){
                setNewRegion(response.location)
            }
        })()  
    }, [])
    
    const confirmLocation = () => {
        setLocationMusica(newRegion)
        toastRef.current.show("Localización guardada correctamente.", 3000)
        setIsVisibleMap(false)
    }

    return (
        <Modal isVisible={isVisibleMap} setVisible={setIsVisibleMap}>
        <View>
            {
            newRegion && (
                <MapView
                    style={styles.mapStyle}
                    initialRegion={newRegion}
                    showsUserLocation={true}
                    onRegionChange={(region) => setNewRegion(region)}
                >
                    <MapView.Marker
                        coordinate={{
                            latitude: newRegion.latitude,
                            longitude: newRegion.longitude
                        }}
                        draggable
                    />

                </MapView>   
            )
            }
            <View style={styles.viewMapBtn}>
                <Button
                    title="Guardar ubicacion"
                    containerStyle={styles.viewMapBtnContainerSave}
                    buttonStyle={styles.viewMapBtnSave}
                    onPress={confirmLocation}
                />
                <Button
                    title="Cancelar Ubicacion"
                    containerStyle={styles.viewMapBtnContainerCancell}
                    buttonStyle={styles.viewMapBtnCancel}
                    onPress={() => setIsVisibleMap(false)}
                />
            </View>
        </View>
        </Modal>
    )
}

function ImageMusica({ imageMusica }) {
    return (
        <View style={styles.viewPhoto}>
            <Image
                style={{ width: widthScreen, height: 200}}
                source={
                    imageMusica
                        ? { uri: imageMusica}
                        : require("../../assets/imagenofound.png")
                }
            />
        </View>
    )
}

function UploadImage( {toastRef, imagesSelected, setImagesSelected} ) {
    const imageSelect = async() => {
        const response = await loadImageFromGallery([4, 3])
        if (!response.status) {
            toastRef.current.show("No has seleccionado ninguna imagen.", 3000)
            return
        }
        setImagesSelected([...imagesSelected, response.image])
    }

    const removeImage = (image) => {
        Alert.alert(
            "Eliminar Imagen",
            "¿Estas seguro que quieres eliminar la imagen?",
            [
                {
                    text: "No",
                    style: "cancel"                    
                },
                {
                    text: "Sí",
                    onPress: () => {
                        setImagesSelected(
                            filter(imagesSelected, (imageUrl) => imageUrl !== image)
                        )
                    }
                }
            ],
            { cancelable: false }
        )
    }

    return (
        <ScrollView
            horizontal
            style={styles.viewImages}
        >
            {
                size(imagesSelected) < 5 && (
                <Icon
                    type="material-community"
                    name="camera"
                    color="#7a7a7a"
                    containerStyle={styles.containerIcon}
                    onPress={imageSelect}
                 />
                )
            }  
            {
                map(imagesSelected, (imageMusica, index) => (
                    <Avatar
                        key={index}
                        style={styles.miniatureStyle}
                        source={{ uri: imageMusica}}
                        onPress={() => removeImage(imageMusica)}

                    />
                ))

            }  
        </ScrollView>
    )
    }

function FormAdd({ 
    formData, 
    setFormData, 
    errorName,  
    errorDescription, 
    errorEmail, 
    errorAddres, 
    errorPhone, 
    setIsVisibleMap, 
    locationMusica }) 
    {
    const [country, setCountry] = useState("MX")
    const [callingCode, setCallingCode] = useState("52")
    const [phone, setPhone] = useState("")

    const onChange = (e, type) => {
        setFormData({...formData, [type] : e.nativeEvent.text})
    }

    return (
        <View style={styles.viewForm}>
            <Input
                placeholder="Nombre de local de Muisca"
                defaultValue={formData.name}
                onChange={(e) => onChange(e, "name")}
                errorMessage={errorName}
            />
            <Input
                placeholder="Direccion"
                defaultValue={formData.address}
                onChange={(e) => onChange(e, "address")}
                errorMessage={errorAddres}
                rightIcon={{
                    type: "material-community",
                    name: "map-marker-radius",
                    color: locationMusica ? "#442484" : "#c2c2c2",
                    onPress:()=> setIsVisibleMap(true)
                }}
            />
            <Input
                placeholder="Email"
                keyboardType="email-address"
                defaultValue={formData.email}
                onChange={(e) => onChange(e, "email")}
                errorMessage={errorEmail}
            />
            <View style={styles.phoneView}>
                <CountryPicker
                    withFlag
                    withCallingCode
                    withFilter
                    withCallingCodeButton
                    containerStyle={styles.countryPicker}
                    countryCode={country}
                    onSelect={(country) => {
                        setFormData({
                            ...formData,
                            "country": country.cca2,
                            "callingCode": country.callingCode[0]})
                    }}
                />
                <Input
                     placeholder="What's del local Musica"
                    keyboardType="phone-pad"
                    containerStyle={styles.inputPhone}
                    defaultValue={formData.phone}
                onChange={(e) => onChange(e, "phone")}
                errorMessage={errorPhone}
                />
            </View>
            <Input
                    placeholder="Descricion tienda"
                    multiline
                    containerStyle={styles.textArea}
                    defaultValue={formData.description}
                onChange={(e) => onChange(e, "description")}
                errorMessage={errorDescription}
                />
        </View>
    
    )
    
}

const defaultFormValues = () => {
    return {
        name: "",
        description: "",
        email: "",
        phone: "",
        address: "",
        country: "MX",
        callingCode: "52"
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        height: "100%"
    },
    viewForm: {
        marginHorizontal: 10,
    },
    textArea: {
        height: 100,
        width: "100%"
    },
    phoneView: {
        width: "80%",
        flexDirection: "row"
    },
    inputPhone: {
        width: "80%"
    },
    btnAddMusica: {
        margin: 20,
        backgroundColor: "#442484"
    },
    viewImages: {
        flexDirection: "row",
        marginHorizontal: 20,
        marginTop: 30
    },
    containerIcon: {
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        height: 70,
        width: 79,
        backgroundColor: "#e3e3e3"
    },
    miniatureStyle: {
        width: 70,
        height: 70,
        marginRight: 10
    },
    viewPhoto: {
        alignItems: "center",
        height: 200,
        marginBottom: 20
    },
    mapStyle: {
        width: "100%",
        height: 550
    },
    viewMapBtn: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10
    },
    viewMapBtnContainerCancel: {
        paddingLeft: 5
    },
    viewMapBtnContainerSave: {
        paddingRight: 5,
    },
    viewMapBtnCancel: {
        backgroundColor: "#a65273"
    },
    viewMapBtnSave: {
        backgroundColor: "#442484"
    }
})
