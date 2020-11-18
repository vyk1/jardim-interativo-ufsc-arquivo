const firebase = require('firebase')
const rebase = require('re-base')

const config = {
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    apiKey: "AIzaSyAnd4tD161VzVYOpkT6zHfcLKXXGMhSe2w",
    authDomain: "jardim-interativo.firebaseapp.com",
    databaseURL: "https://jardim-interativo.firebaseio.com",
    projectId: "jardim-interativo",
    storageBucket: "jardim-interativo.appspot.com",
    messagingSenderId: "268525316208",
    appId: "1:268525316208:web:001866f0c59b34fce1acb5",
    measurementId: "G-P7VVSDEM75"
};

const app = firebase.initializeApp(config);
const firebaseConfig = rebase.createClass(app.database())
const firestore = app.firestore()

export const storage = app.storage()
export const base = rebase.createClass(firestore)
export const auth = app.auth()

export default firebaseConfig