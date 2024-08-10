import { useState } from "react";

import { getTokens } from "../../../public/firebaseConfig";

import TokensList from "./TokensList";

const TokensBox = () => {
  const [tokensList, setTokensList] = useState();

  const fetchTokens = async () => {
    const tokens = await getTokens();
    console.log("tokeeeeensssss", tokens);
    setTokensList(tokens);
  };

  const sendMulticast = async (tokens) => {
    try {
      const response = await fetch("/api/send-multicast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tokens: tokens,
          title: "Hello!",
          body: "This is a multicast notification message!",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send multicast notifications");
      }

      const responseData = await response.json();
      console.log("Multicast notifications sent successfully", responseData);
    } catch (err) {
      console.log(
        "An error occurred while sending multicast notification.",
        err
      );
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center pt-6">
        <p className="font-medium text-xl pb-10">
          To download the token list, click the button below
        </p>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow-md"
          onClick={fetchTokens}
        >
          Get tokens
        </button>
      </div>
      {tokensList && (
        <div className="flex items-center justify-center pt-10">
          <button
            className="bg-stone-500 hover:bg-stone-600 text-white font-semibold py-2 px-4 rounded shadow-md"
            onClick={() => sendMulticast(tokensList)}
          >
            Push messages to all tokens
          </button>
        </div>
      )}
      {tokensList && <TokensList tokensList={tokensList} />}
    </>
  );
};

export default TokensBox;
