import { NextResponse } from "next/server";

import { firestore, messaging } from "../../../../../public/firebaseAdmin";

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
        "DIRECT meeeeeeeeeeeeeeesssssssssssssssssssssssssssaaaaaaaaaaaaaaaagggggggggggggee"
      );
      console.log(message);

      const response = await messaging.send(message);
      console.log("Successfully sent direct message:", response);

      return NextResponse.json(
        { message: "Direct notification sent successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error sending direct message:", error);
      return NextResponse.json(
        { error: "Error sending direct message" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
}
