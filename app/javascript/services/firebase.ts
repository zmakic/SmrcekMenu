import firebase from 'firebase/app';
import 'firebase/auth';

const fireBaseAppName = "smrcek-menu";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDjowBlmGb0wdWSUus1p5oifHhZ3IF4DCE",
    authDomain: "smrcek-menu.firebaseapp.com",
    projectId: "smrcek-menu",
    storageBucket: "smrcek-menu.appspot.com",
    messagingSenderId: "13352765497",
    appId: "1:13352765497:web:b61c62de89a5b086ee65e8"
};

let firebaseApp:firebase.app.App;
let firebaseAuthProvider:firebase.auth.Auth;

try {
    firebaseApp = firebase.initializeApp(firebaseConfig, fireBaseAppName);
    firebaseAuthProvider = firebase.auth(firebaseApp);
}
catch (err) {
    console.log("FIREBASE ERROR", err);
}

export {
    firebaseApp,
    firebaseAuthProvider
}
