import { firebaseApp } from './firebase'
import * as firebase from 'firebase'
import 'firebase/firestore'
import { fileToBlob } from './helpers'
import { map } from 'lodash'
import { FireSQL } from 'firesql'

const db = firebase.firestore(firebaseApp)
const fireSQL = new FireSQL(firebase.firestore(), { includeId: "id"})
 
export const isUserLogged = () =>{
    let isLogged = false
    firebase.auth().onAuthStateChanged((user) => {
        user !== null && (isLogged = true)
    })
    return isLogged
}

export const getCurrentUser = () =>{
    return firebase.auth().currentUser
}

export const closeSession = () =>{
    return firebase.auth().signOut()
}


export const registerUser = async(email, password) => {
    const result = { statusResponse: true, error: null}
    try{
        await firebase.auth().createUserWithEmailAndPassword(email, password)
    } catch (error) {
        result.statusResponse = false
        result.error = "Este correo ya ha sido registrado"
    }
    return result
}

export const loginWithEmailAndPassword = async(email, password) => {
    const result = { statusResponse: true, error: null}
    try {
        await firebase.auth().signInWithEmailAndPassword(email, password)
    } catch (error) {
        result.statusResponse = false
        result.error = "Usuario o contraseña no válidos."
    }
    return result
}

export const uploadImage = async(image, path, name) => {
    const result = { statusResponse: false, error: null, url: null }
    const ref = firebase.storage().ref(path).child(name)
    const blob = await fileToBlob(image)

    try {
        await ref.put(blob)
        const url = await firebase.storage().ref(`${path}/${name}`).getDownloadURL()
        result.statusResponse = true
        result.url = url
    } catch (error) {
        result.error = error
    }
    return result
}

export const updateProfile = async(data) => {
    const result = { statusResponse: true, error: null }
    try {
        await firebase.auth().currentUser.updateProfile(data)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result  
}   

export const reauthenticate = async(password) => {
    const result = { statusResponse: true, error: null }
    const user = getCurrentUser()
    const credentials = firebase.auth.EmailAuthProvider.credential(user.email, password)

    try {
        await user.reauthenticateWithCredential(credentials)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

export const updateEmail = async(email) => {
    const result = { statusResponse: true, error: null }
    try {
        await firebase.auth().currentUser.updateEmail(email)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

export const updatePassword = async(password) => {
    const result = { statusResponse: true, error: null }
    try {
        await firebase.auth().currentUser.updatePassword(password)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

export const addDocumentWithoutId = async(collection, data) => {
    const result = { statusResponse: true, error: null }
    try {
        await db.collection(collection).add(data)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

export const getMusica = async(limitMusica) => {
    const result = { statusResponse: true, error: null, musics: [], starMusica: null}
    try {
        const response = await db
        .collection("musica")
        .orderBy("createAt", "desc")
        .limit(limitMusica)
        .get()
        if (response.docs.length > 0){
            result.starMusica = response.docs[response.docs.length - 1]
        }
        response.forEach((doc) => {
            const musica = doc.data()
            musica.id = doc.id
            result.musics.push(musica)
        })
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

export const getMoreMusica = async(limitMusica, starMusica) => {
    const result = { statusResponse: true, error: null, musics: [], starMusica: null}
    try {
        const response = await db
            .collection("musica")
            .orderBy("createAt", "desc")
            .startAfter(starMusica.data().createAt)
            .limit(limitMusica)
            .get()
        if (response.docs.length > 0) {
            result.starMusica = response.docs[response.docs.length - 1]
        }
        response.forEach((doc) => {
            const musica = doc.data()
            musica.id = doc.id
            result.musics.push(musica)
        })
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

export const getDocumentById = async(collection, id) => {
    const result = { statusResponse: true, error: null, document: null }
    try {
        const response = await db.collection(collection).doc(id).get()
        result.document = response.data()
        result.document.id = response.id
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     

    
}

export const updateDocument = async(collection, id, data) => {
    const result = { statusResponse: true, error: null }
    try {
        await db.collection(collection).doc(id).update(data)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result   
}

export const getMusicaReviews = async(id) => {
    const result = { statusResponse: true, error: null, reviews: [] }
    try {
        const response = await db
        .collection("reviews")
        .where("idMusica", "==", id)
        .get()
        response.forEach((doc) => {
            const review = doc.data()
            review.id = doc.id
            result.reviews.push(review)
        })
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

export const getIsFavorite = async(idMusica) => {
    const result = { statusResponse: true, error: null, isFavorite: false }
    try {
    const response = await db
    .collection("favorites")
    .where("idMusica", "==", idMusica)
    .where("idUser", "==", getCurrentUser().uid)
    .get()
    result.isFavorite = response.docs.length > 0
    } catch (error) {
       result.statusResponse = false
        result.error = error
    }
    return result   
}

export const deleteFavorite = async(idMusica) => {
    const result = { statusResponse: true, error: null }
    try {
    const response = await db
    .collection("favorites")
    .where("idMusica", "==", idMusica)
    .where("idUser", "==", getCurrentUser().uid)
    .get()
response.forEach(async(doc) => {
    const favoriteId = doc.id
    await db.collection("favorites").doc(favoriteId).delete()
})
    } catch (error) {
       result.statusResponse = false
        result.error = error
    }
    return result   
}

export const getFavorites = async() => {
    const result = { statusResponse: true, error: null, favorites: [] }
    try {
    const response = await db
    .collection("favorites")
    .where("idUser", "==", getCurrentUser().uid)
    .get()
    const musicasId = []
response.forEach((doc) => {
    const favorite = doc.data()
    musicasId.push(favorite.idMusica)
})
    await Promise.all(
        map(musicasId, async(musicaId) =>{
            const response2= await getDocumentById("musica", musicaId)
            if (response2.statusResponse){
                result.favorites.push(response2.document)
            }
        })
    )
    } catch (error) {
       result.statusResponse = false
        result.error = error
    }
    return result   
}

export const getTopMusicas = async(limit) => {
    const result = { statusResponse: true, error: null, musica: [] }
    try {
    const response = await db
    .collection("musica")
    .orderBy("rating", "desc")
    .limit(limit)
    .get()
response.forEach((doc) => {
    const music = doc.data()
    music.id = doc.id
    result.musica.push(music)
})
    } catch (error) {
       result.statusResponse = false
        result.error = error
    }
    return result   
}

export const searchMusicas = async(criteria) => {
    const result = { statusResponse: true, error: null, musica: [] }
    try {
        result.musica = await fireSQL.query(`SELECT * FROM musica WHERE name LIKE '${criteria}%'`)
    } catch (error) {
       result.statusResponse = false
        result.error = error
    }
    return result   
}