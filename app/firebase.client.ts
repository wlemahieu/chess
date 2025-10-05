import { initializeApp } from "firebase/app";
/*
import {
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  getAuth,
  inMemoryPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";*/
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";

const app = initializeApp({
  apiKey: "AIzaSyCFcyUrJY7EPLAQ2-YQ_YuwhnaGZKzfzvk",
  authDomain: "rdychess-com.firebaseapp.com",
  projectId: "rdychess-com",
  storageBucket: "rdychess-com.firebasestorage.app",
  messagingSenderId: "880734792209",
  appId: "1:880734792209:web:2a719b8cfbe01049519fb0",
  measurementId: "G-4F7N90RP9Q",
});
const region = "us-west1";

// export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app, region);

// setPersistence(auth, inMemoryPersistence);

/*
export const signUp = async (email: string, password: string) => {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const { user } = credential;

  await setDoc(doc(db, "users", user.uid), {
    email: user.email,
    createdAt: new Date(),
  });

  return user;
};

export const signIn = async (email: string, password: string) => {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const { user } = credential;
  return user;
};
*/

if (process.env.NODE_ENV !== "production") {
  connectFirestoreEmulator(db, "127.0.0.1", 8086);
  // connectAuthEmulator(auth, "http://localhost:9099");
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
}
