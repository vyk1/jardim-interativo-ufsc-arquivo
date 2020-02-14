const firebase = require('firebase')
const rebase = require('re-base')


const config = {
    apiKey: "AIzaSyCRZBRZ6E4ro-eHo1FwlXFi9iz5FIpyg0Q",
    authDomain: "jardim-universitario.firebaseapp.com",
    databaseURL: "https://jardim-universitario.firebaseio.com",
    projectId: "jardim-universitario",
    storageBucket: "jardim-universitario.appspot.com",
    messagingSenderId: "24241088193",
    appId: "1:24241088193:web:9d3e0c14777a718d13d640",
    measurementId: "G-2RVMJHZMY9"
};

//   firebase.analytics();

const app = firebase.initializeApp(config);
const firebaseConfig = rebase.createClass(app.database())
const firestore = app.firestore()

export const storage = app.storage()
export const base = rebase.createClass(firestore)

export default firebaseConfig