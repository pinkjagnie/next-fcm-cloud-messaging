import { NextResponse } from "next/server";

import { firestore, messaging } from "../../../../public/firebaseAdmin";
import { removeInvalidToken } from "../../../../public/firebaseConfig";

export async function POST(req, res) {
  if (req.method === "POST") {
    const { tokens, title, body } = await req.json();

    try {
      const message = {
        notification: {
          title: title,
          body: body,
        },
        tokens: tokens,
      };

      console.log(
        "MULTICAST meeeeeeeeeeeeeeesssssssssssssssssssssssssssaaaaaaaaaaaaaaaagggggggggggggee"
      );
      console.log(message);

      const response = await messaging.sendMulticast(message);
      console.log("Successfully sent multicast messages", response);

      // Handling failed notification - if there are any
      if (response.failureCount > 0) {
        const failedTokens = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            const failedToken = tokens[idx];
            failedTokens.push(failedToken);

            // If the error is about an inactive token - remove it from the database
            if (
              resp.error.code ===
                "messaging/registration-token-not-registered" ||
              resp.error.code === "messaging/invalid-argument"
            ) {
              removeInvalidToken(failedToken);
            }
          }
        });
        console.log("List of tokens that caused failures:", failedTokens);
      }

      return NextResponse.json(
        { message: "Notification sent to the group of tokens successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error sending notification to group of tokens", error);
      return NextResponse.json(
        { error: "Error sending notification to group of tokens" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
}
