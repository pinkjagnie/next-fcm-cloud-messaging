import { NextResponse } from "next/server";

import { firestore, messaging } from "../../../../public/firebaseAdmin";

export async function POST(req, res) {
  if (req.method === "POST") {
    const { token, title, body } = await req.json();

    try {
      const message = {
        notification: {
          title: title,
          body: body,
        },
        token: token,
      };

      console.log(
        "meeeeeeeeeeeeeeesssssssssssssssssssssssssssaaaaaaaaaaaaaaaagggggggggggggee"
      );
      console.log(message);

      const response = await messaging.send(message);
      console.log("Successfully sent message:", response);

      // Checking if token already exists in Firestore
      const tokensRef = firestore.collection("tokens");
      const querySnapshot = await tokensRef.where("token", "==", token).get();

      if (querySnapshot.empty) {
        await tokensRef.add({
          token: token,
          createdAt: new Date(),
        });
        console.log("Token stored in Firestore");
      } else {
        console.log("Token already exists in Firestore");
      }

      return NextResponse.json(
        { message: "Notification sent successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error sending message:", error);
      return NextResponse.json(
        { error: "Error sending message" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
}
