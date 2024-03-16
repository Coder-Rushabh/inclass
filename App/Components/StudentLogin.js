

import { Button } from "react-native";
import { initializeApp } from "firebase/app";
import { getApp } from 'firebase/app';
import { getAuth, GoogleSignin, GoogleAuthProvider } from 'firebase/auth';


const firebaseConfig = {
    apiKey: "AIzaSyA_7y1ucltugtGcp1nZeRRkOn59Ubr78K0",
    authDomain: "inclass-be45b.firebaseapp.com",
    projectId: "inclass-be45b",
    storageBucket: "inclass-be45b.appspot.com",
    messagingSenderId: "534547516203",
    appId: "1:534547516203:web:cf62def35ba918d906d36e"
  };

 

export default function StudentLogin() {

    

    async function onGoogleButtonPress() {
        // Check if your device supports Google Play
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        // Get the users ID token
        const { idToken } = await GoogleSignin.signIn();
      
        // Create a Google credential with the token
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      
        // Sign-in the user with the credential
        return auth().signInWithCredential(googleCredential);
      }


    return (
        <Button title="demo" onPressed={onGoogleButtonPress()}/>
    );
}