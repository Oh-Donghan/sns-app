import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "my-sns-c02df.firebaseapp.com",
  projectId: "my-sns-c02df",
  storageBucket: "my-sns-c02df.appspot.com",
  messagingSenderId: "307425168587",
  appId: "1:307425168587:web:f4bbad8eb627068fd25f4e"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);