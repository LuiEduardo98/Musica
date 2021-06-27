import firebase from 'firebase/app'
import 'firebase/firestore'


const firebaseConfig = {
    apiKey: "AIzaSyDIgOhcPeh7_usttBPXKedbxJMhnk7I0RQ",
    authDomain: "music-984b8.firebaseapp.com",
    projectId: "music-984b8",
    storageBucket: "music-984b8.appspot.com",
    messagingSenderId: "296714219934",
    appId: "1:296714219934:web:64ac51d71afbc36b85268f"
  }
export const firebaseApp =  firebase.initializeApp(firebaseConfig)