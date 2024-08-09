"use client";

import { useEffect } from "react";

import { onMessage } from "firebase/messaging";
import { messaging, requestForToken } from "../../public/firebaseConfig";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Message from "./components/Message";
import TokensBox from "./components/TokensBox";

let hasRequestedPermission = false;

export default function Home() {
  async function requestPermission() {
    console.log("początek request permission");
    //requesting permission using Notification API
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      requestForToken();

      // this way with onMessage works on Chrome & Firefox
      onMessage(messaging, (payload) => {
        console.log("incoming message");
        console.log(payload);
        toast(<Message notification={payload.notification} />, {
          autoClose: false,
          closeOnClick: false,
          closeButton: true,
        });
      });
    } else if (permission === "denied") {
      //notifications are blocked
      alert("You denied for the notification");
    }
    console.log("koniec request permission");
  }

  useEffect(() => {
    if (!hasRequestedPermission) {
      console.log("przed request permission");
      requestPermission();
      console.log("po request permission");
      hasRequestedPermission = true;
    }

    // This way with onMessage works on Chrome but not on Firefox
    // const unsubscribe = onMessage(messaging, (payload) => {
    //   console.log("incoming message");
    //   console.log(payload);
    //   toast(<Message notification={payload.notification} />, {
    //     autoClose: false,
    //     closeOnClick: false,
    //     closeButton: true,
    //   });
    // });

    // // Clean up the subscription on unmount
    // return () => unsubscribe();
  }, []);

  return (
    <main className="min-h-screen py-24 px-6">
      <h1 className="text-center font-extrabold text-4xl my-10">Hello</h1>
      <ToastContainer />
      <TokensBox />
    </main>
  );
}
