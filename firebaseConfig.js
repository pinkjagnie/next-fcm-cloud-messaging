import { initializeApp } from "firebase/app";

import { getMessaging, getToken } from "firebase/messaging";

import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.VITE_APP_API_KEY,
  authDomain: process.env.VITE_APP_AUTH_DOMAIN,
  projectId: process.env.VITE_APP_PROJECT_ID,
  storageBucket: process.env.VITE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_APP_MESSAGING_SENDER_ID,
  appId: process.env.VITE_APP_APP_ID,
  measurementId: process.env.VITE_APP_MEASUREMENT_ID,
  vapidKey: process.env.VITE_APP_VAPID_KEY,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Messaging service
export const messaging = getMessaging(app);

// Firestore configure
const firestore = getFirestore(app);

export const requestForToken = () => {
  // The method getToken() allows FCM to use the VAPID key credential
  // when sending message requests to different push services
  return getToken(messaging, { vapidKey: process.env.VITE_APP_VAPID_KEY })
    .then((currentToken) => {
      if (currentToken) {
        console.log("current token for client: ", currentToken);

        const storedToken = localStorage.getItem("fcmToken");

        if (!storedToken || currentToken !== storedToken) {
          localStorage.setItem("fcmToken", currentToken);
        }

        // if (storedToken) {
        //   if (currentToken !== storedToken) {
        //     localStorage.setItem("fcmToken", currentToken);
        //   }
        // } else {
        //   localStorage.setItem("fcmToken", currentToken);
        // }

        // adding token to database in firestore
        // try {
        //   const docRef = addDoc(collection(firestore, "tokens"), {
        //     token: currentToken,
        //     createdAt: new Date(),
        //   });
        //   console.log("Token stored with ID:", docRef.id);
        // } catch (e) {
        //   console.error("Error storing token:", e);
        // }

        // checking if token already exist in database & then adding token to database - Firestore
        const tokensRef = collection(firestore, "tokens");
        const q = query(tokensRef, where("token", "==", currentToken));
        const querySnapshot = getDocs(q);

        if (querySnapshot.empty) {
          const docRef = addDoc(tokensRef, {
            token: currentToken,
            createdAt: new Date(),
          });
          console.log("Token stored with ID:", docRef.id);
        } else {
          console.log("Token already exists in Firestore.");
        }
      } else {
        console.log(
          "No registration token available. Request permission to generate one."
        );
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
    });
};
