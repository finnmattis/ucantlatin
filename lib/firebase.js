import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyD4Mum-IYNDQtAtZWE6YTSCcw0lP-K04MI",
    authDomain: "ucantlatin.firebaseapp.com",
    projectId: "ucantlatin",
    storageBucket: "ucantlatin.appspot.com",
    messagingSenderId: "970111123763",
    appId: "1:970111123763:web:e319a93e8d07fe5c3abe46",
}

const app = initializeApp(firebaseConfig)
export const firestore = getFirestore(app)
