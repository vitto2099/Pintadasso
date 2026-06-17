import { Platform } from 'react-native';
import { initializeApp } from 'firebase/app';
// @ts-ignore
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const configuracaoFirebase = {
  apiKey: "AIzaSyBzsulboyCwQtdn5a98Rh4jeDpbRFK6nuM",
  authDomain: "pintadasso-3ae99.firebaseapp.com",
  projectId: "pintadasso-3ae99",
  storageBucket: "pintadasso-3ae99.firebasestorage.app",
  messagingSenderId: "613812527770",
  appId: "1:613812527770:web:03f07a29110db397e6b523",
  measurementId: "G-0MFPHYHRVN"
};

const app = initializeApp(configuracaoFirebase);

export const autenticacao = Platform.OS === 'web' 
  ? getAuth(app) 
  : initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });

export const bancoDeDados = getFirestore(app);
