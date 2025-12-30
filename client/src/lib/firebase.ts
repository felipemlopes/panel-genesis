import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBALPqz62RLnqlrLjCiAfqbo2NGPzslwP4",
    authDomain: "testenovo-9ce64.firebaseapp.com",
    projectId: "testenovo-9ce64",
    storageBucket: "testenovo-9ce64.firebasestorage.app",
    messagingSenderId: "621467052426",
    appId: "1:621467052426:web:dcf80c5103e83a7c8c4073",
};

export const app = initializeApp(firebaseConfig);

// Serviços que você vai usar
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
