import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyC-OBc7AaN7kijaQGEacV4wb1ffRNALPTo",
  authDomain: "cp4mobileclayton-guilhermesola.firebaseapp.com",
  projectId: "cp4mobileclayton-guilhermesola",
  storageBucket: "cp4mobileclayton-guilhermesola.firebasestorage.app",
  messagingSenderId: "418712166693",
  appId: "1:418712166693:web:d35881f579ebaa082f7acc",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});