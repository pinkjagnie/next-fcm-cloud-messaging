import { NextResponse } from "next/server";

import { firestore, messaging } from "../../../../../public/firebaseAdmin";
import { deleteInvalidToken } from "../../../../../public/firebaseConfig";

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

      // Checking if the error is related to an invalid token
      if (error.code === "messaging/registration-token-not-registered") {
        // Remove the token from the database because it is out dated
        await deleteInvalidToken(token);

        return NextResponse.json(
          { error: "The token is no longer valid and has been removed." },
          { status: 404 } // 404 - informs that token has not been found
        );
      }

      return NextResponse.json(
        { error: "Error sending direct message" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
}
