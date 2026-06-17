import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const configuracaoFirebase = {
  apiKey: "AIzaSyD9lodSIc5MA3xNi9AwXxP5dMALe4cZhn4",
  authDomain: "pintadasso-abc62.firebaseapp.com",
  projectId: "pintadasso-abc62",
  storageBucket: "pintadasso-abc62.firebasestorage.app",
  messagingSenderId: "507827222753",
  appId: "1:507827222753:web:b622ea30c88045461adfa0",
  measurementId: "G-708CKHHZHC"
};

const app = initializeApp(configuracaoFirebase);

// Usa AsyncStorage pra manter o usuário logado entre sessões
export const autenticacao = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const bancoDeDados = getFirestore(app);
