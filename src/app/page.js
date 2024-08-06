import { useEffect } from "react";

import { onMessage } from "firebase/messaging";
import { messaging, requestForToken } from "./firebase/firebaseConfig";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Message from "./components/Message";

export default function Home() {
  async function requestPermission() {
    //requesting permission using Notification API
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      requestForToken();
    } else if (permission === "denied") {
      //notifications are blocked
      alert("You denied for the notification");
    }
  }

  useEffect(() => {
    requestPermission();

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("incoming message");
      console.log(payload);
      toast(<Message notification={payload.notification} />, {
        autoClose: false,
        closeOnClick: false,
        closeButton: true,
      });
    });

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <main className="min-h-screen py-24 px-6">
      <h1 className="text-center font-extrabold text-4xl my-10">Hello</h1>
      <ToastContainer />
    </main>
  );
}
