const SingleToken = ({ token }) => {
  return (
    <li className="flex items-center justify-between w-[90%] mx-auto pb-4">
      <span className="w-[85%] py-1 px-2 bg-gray-100 rounded mb-2 border border-gray-300 break-words">
        {token}
      </span>
      <button className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
        Push message
      </button>
    </li>
  );
};

export default SingleToken;
