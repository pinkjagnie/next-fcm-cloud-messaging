import admin from "firebase-admin";
import { readFileSync } from "fs";

const serviceAccount = JSON.parse(
  readFileSync(process.env.NEXT_APP_FIREBASE_SERVICE_ACCOUNT_KEY, "utf8")
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const firestore = admin.firestore();
const messaging = admin.messaging();

export { firestore, messaging };
