import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyC-OBc7AaN7kijaQGEacV4wb1ffRNALPTo",
  authDomain: "cp4mobileclayton-guilhermesola.firebaseapp.com",
  projectId: "cp4mobileclayton-guilhermesola",
  storageBucket: "cp4mobileclayton-guilhermesola.firebasestorage.app",
  messagingSenderId: "418712166693",
  appId: "1:418712166693:web:d35881f579ebaa082f7acc",
};

const app = initializeApp(firebaseConfig);

// No web o Firebase já persiste a sessão sozinho;
// getReactNativePersistence só existe no build nativo
export const auth =
  Platform.OS === "web"
    ? getAuth(app)
    : initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
