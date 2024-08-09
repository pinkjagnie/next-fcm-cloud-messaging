const TokensBox = () => {
  return (
    <div className="flex flex-col justify-center items-center pt-6">
      <p className="font-medium text-xl pb-10">
        To download the token list, click the button below
      </p>
      <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow-md">
        Get tokens
      </button>
    </div>
  );
};

export default TokensBox;
