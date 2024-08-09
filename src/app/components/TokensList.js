import SingleToken from "./SingleToken";

const TokensList = ({ tokensList }) => {
  return (
    <ul className="list-none p-6 my-10 text-stone-900">
      {tokensList.map((token, index) => {
        return <SingleToken key={index} token={token} />;
      })}
    </ul>
  );
};

export default TokensList;
