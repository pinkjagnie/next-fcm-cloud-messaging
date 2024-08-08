// import { navigator } from "window";

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
export const messaging = getMessaging(app);

// Firestore configure
const firestore = getFirestore(app);

// export const requestForToken = async () => {
//   // The method getToken() allows FCM to use the VAPID key credential
//   // when sending message requests to different push services
//   return getToken(messaging, { vapidKey: process.env.NEXT_APP_VAPID_KEY })
//     .then((currentToken) => {
//       if (currentToken) {
//         console.log("current token for client: ", currentToken);

//         const storedToken = localStorage.getItem("fcmToken");

//         if (!storedToken || currentToken !== storedToken) {
//           localStorage.setItem("fcmToken", currentToken);
//         }

//         // if (storedToken) {
//         //   if (currentToken !== storedToken) {
//         //     localStorage.setItem("fcmToken", currentToken);
//         //   }
//         // } else {
//         //   localStorage.setItem("fcmToken", currentToken);
//         // }

//         // adding token to database in firestore
//         // try {
//         //   const docRef = addDoc(collection(firestore, "tokens"), {
//         //     token: currentToken,
//         //     createdAt: new Date(),
//         //   });
//         //   console.log("Token stored with ID:", docRef.id);
//         // } catch (e) {
//         //   console.error("Error storing token:", e);
//         // }

//         // checking if token already exist in database & then adding token to database - Firestore
//         const tokensRef = collection(firestore, "tokens");
//         const q = query(tokensRef, where("token", "==", currentToken));
//         const querySnapshot = getDocs(q);

//         if (querySnapshot.empty) {
//           const docRef = addDoc(tokensRef, {
//             token: currentToken,
//             createdAt: new Date(),
//           });
//           console.log("Token stored with ID:", docRef.id);
//         } else {
//           console.log("Token already exists in Firestore.");
//         }

//         // NEEEEEEEEEEEEEEEEEEEEw

//         console.log("currrrrrrrrrrrrentttttttttttt", currentToken);

//         const response = fetch("/api/send-notification", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             token: currentToken,
//             title: "Hello!",
//             body: `This is a notification message! And this is your token: ${currentToken}`,
//           }),
//         });

//         if (!response.ok) {
//           throw new Error("Failed to send notification");
//         }

//         console.log("Notification sent successfully");
//       } else {
//         console.log(
//           "No registration token available. Request permission to generate one."
//         );
//       }
//     })
//     .catch((err) => {
//       console.log("An error occurred while retrieving token. ", err);
//     });
// };

navigator.serviceWorker.register("/firebase-messaging-sw.js", {
  scope: "/firebase-cloud-messaging-push-scope",
});

export const requestForToken = async () => {
  try {
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
