import { initializeApp } from "firebase/app";

import { getMessaging, getToken, isSupported } from "firebase/messaging";

import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_APP_API_KEY,
  authDomain: process.env.NEXT_APP_AUTH_DOMAIN,
  projectId: process.env.NEXT_APP_PROJECT_ID,
  storageBucket: process.env.NEXT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_APP_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_APP_APP_ID,
  measurementId: process.env.NEXT_APP_MEASUREMENT_ID,
  vapidKey: process.env.NEXT_APP_VAPID_KEY,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Messaging service
// export const messaging = getMessaging(app);
let messaging;
if (typeof window !== "undefined") {
  messaging = getMessaging(app);
}
export { messaging };

// Firestore configure
export const firestore = getFirestore(app);

// First way to solve about service worker - this works!
// navigator.serviceWorker.register("/firebase-messaging-sw.js", {
//   scope: "/firebase-cloud-messaging-push-scope",
// });

// Second way to solve about service worker - this works too!
const getOrRegisterServiceWorker = () => {
  if ("serviceWorker" in navigator) {
    return window.navigator.serviceWorker
      .getRegistration("/firebase-cloud-messaging-push-scope")
      .then((serviceWorker) => {
        if (serviceWorker) {
          return serviceWorker;
        }
        return window.navigator.serviceWorker
          .register("/firebase-messaging-sw.js")
          .then((serviceWorker) => {
            console.log("success registering SW");
          })
          .catch((err) => {
            console.log("registering failed", err);
          });
      });
  }
  throw new Error("The browser doesn`t support service worker.");
};

export const requestForToken = async () => {
  try {
    navigator.serviceWorker.register("/firebase-messaging-sw.js", {
      scope: "/firebase-cloud-messaging-push-scope",
    });

    const currentToken = await getToken(messaging, {
      vapidKey: process.env.NEXT_APP_VAPID_KEY,
    });
    if (currentToken) {
      console.log("current token for client: ", currentToken);

      const storedToken = localStorage.getItem("fcmToken");
      if (!storedToken || currentToken !== storedToken) {
        localStorage.setItem("fcmToken", currentToken);
      }

      const tokensRef = collection(firestore, "tokens");
      const q = query(tokensRef, where("token", "==", currentToken));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        const docRef = await addDoc(tokensRef, {
          token: currentToken,
          createdAt: new Date(),
        });
        console.log("Token stored with ID:", docRef.id);
      } else {
        console.log("Token already exists in Firestore.");
      }

      console.log("currrrrrrrrrrrrentttttttttttt", currentToken);

      const response = await fetch("/api/send-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: currentToken,
          title: "Hello!",
          body: `This is a notification message! And this is your token: ${currentToken}`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send notification");
      }

      const responseData = await response.json();
      console.log("Notification sent successfully", responseData);
    } else {
      console.log(
        "No registration token available. Request permission to generate one."
      );
    }
  } catch (err) {
    console.log(
      "An error occurred while retrieving token or sending notification.",
      err
    );
  }
};

export const getTokens = async () => {
  const serviceWorkerRegistration = await getOrRegisterServiceWorker();

  const tokensCollection = collection(firestore, "tokens");
  const tokensSnapshot = await getDocs(tokensCollection);

  // tokens into array of tokens
  const tokens = tokensSnapshot.docs.map((doc) => doc.data().token);

  return tokens;
};

// MULTICAST - remove inactive token from database
export const removeInvalidToken = async (token) => {
  try {
    const tokensRef = collection(firestore, "tokens");
    const q = query(tokensRef, where("token", "==", token));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      querySnapshot.forEach(async (docSnapshot) => {
        await deleteDoc(doc(firestore, "tokens", docSnapshot.id));
        console.log(`Token ${token} removed from the database.`);
      });
    }
  } catch (error) {
    console.error(`Failed to remove token ${token} from the database:`, error);
  }
};

// DIRECT MSG - remove inactive token from database
export const deleteInvalidToken = async (token) => {
  try {
    const tokensRef = doc(firestore, "tokens", token);
    await deleteDoc(tokensRef);
    console.log(`Token ${token} has been removed from the database.`);
  } catch (error) {
    console.error(`Failed to remove token ${token} from the database:`, error);
  }
};
