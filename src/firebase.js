import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey:            "AIzaSyA1-vFeGQTOuD06tzWhnzGgpk4axVL8EI4",
  authDomain:        "qutex-priyam.firebaseapp.com",
  databaseURL:       "https://qutex-priyam-default-rtdb.firebaseio.com",
  projectId:         "qutex-priyam",
  storageBucket:     "qutex-priyam.firebasestorage.app",
  messagingSenderId: "369167630836",
  appId:             "1:369167630836:web:f2f9961fecfe042272b9a1"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
