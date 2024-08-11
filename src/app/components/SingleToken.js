import { useState } from "react";

const SingleToken = ({ token }) => {
  const [errorMsg, setErrorMsg] = useState(null);

  const sendDirectNotification = async (token) => {
    setErrorMsg(null); // Reset error before new request

    try {
      const response = await fetch(`/api/send-notification/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          title: "Hello!",
          body: `This is a direct notification message! And this is your token: ${token}`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 404) {
          // The token is out dated
          setErrorMsg("This token is no longer valid and has been removed.");
        } else {
          throw new Error(errorData.error || "Failed to send notification");
        }
      } else {
        const responseData = await response.json();
        console.log("Notification sent successfully", responseData);
      }
    } catch (err) {
      console.log("An error occurred while sending direct notification.", err);
      setErrorMsg(err.message);
    }
  };

  return (
    <>
      {errorMsg && (
        <p className="w-[90%] mx-auto mt-4 mb-2 text-center font-medium break-words">
          Token {token} - <span className="text-red-500">{errorMsg}</span>
        </p>
      )}
      <li className="flex items-center justify-between w-[90%] mx-auto pb-4">
        <span className="w-[85%] py-1 px-2 bg-gray-100 rounded mb-2 border border-gray-300 break-words">
          {token}
        </span>
        <button
          className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          onClick={() => {
            sendDirectNotification(token);
          }}
        >
          Push message
        </button>
      </li>
    </>
  );
};

export default SingleToken;
