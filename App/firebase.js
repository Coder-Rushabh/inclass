import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: "AIzaSyA_7y1ucltugtGcp1nZeRRkOn59Ubr78K0",
  authDomain: "inclass-be45b.firebaseapp.com",
  projectId: "inclass-be45b",
  storageBucket: "inclass-be45b.appspot.com",
  messagingSenderId: "534547516203",
  appId: "1:534547516203:web:cf62def35ba918d906d36e"};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);





export { db };