const firebase = require('firebase')
const rebase = require('re-base')

const config = {
    apiKey: "AIzaSyAtdKp7wgMYdXZb6nNBEN-R8YdFXbi4Bb8",
    authDomain: "jardim-unificado.firebaseapp.com",
    databaseURL: "https://jardim-unificado.firebaseio.com",
    projectId: "jardim-unificado",
    storageBucket: "jardim-unificado.appspot.com",
    messagingSenderId: "345999096479",
    appId: "1:345999096479:web:92d5cc33a296cb842840aa",
    measurementId: "G-LV5X31RY7D"
};

const app = firebase.initializeApp(config);
const firebaseConfig = rebase.createClass(app.database())
const firestore = app.firestore()

export const storage = app.storage()
export const base = rebase.createClass(firestore)
export const auth = app.auth()

export default firebaseConfig