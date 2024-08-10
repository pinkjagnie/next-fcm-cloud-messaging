const SingleToken = ({ token }) => {
  const sendDirectNotification = async (token) => {
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
        throw new Error("Failed to send notification");
      }

      const responseData = await response.json();
      console.log("Notification sent successfully", responseData);
    } catch (err) {
      console.log("An error occurred while sending direct notification.", err);
    }
  };

  return (
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
  );
};

export default SingleToken;
