import { NextResponse } from "next/server";

import { firestore, messaging } from "../../../../firebaseAdmin";

export async function POST(req, res) {
  if (req.method === "POST") {
    const { token, title, body } = req.body;

    try {
      const message = {
        notification: {
          title: title,
          body: body,
        },
        token: token,
      };

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

      // NextResponse.status(200).json({ message: "Notification sent successfully" });
      return NextResponse.json(
        { message: "Notification sent successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error sending message:", error);
      // NextResponse.status(500).json({ error: "Error sending message" });
      return NextResponse.json(
        { error: "Error sending message" },
        { status: 500 }
      );
    }
  } else {
    // NextResponse.status(405).json({ error: "Method not allowed" });
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
}
