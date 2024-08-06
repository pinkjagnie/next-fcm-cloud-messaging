const Message = ({ notification }) => {
  return (
    <>
      <div className="flex justify-around items-center text-xl font-bold">
        {/* image is optional */}
        {notification.image && (
          <div className="flex items-center h-24 object-contain">
            <img src={notification.image} width={100} />
          </div>
        )}
        <span>{notification.title}</span>
      </div>
      <div className="mt-2 text-center">{notification.body}</div>
    </>
  );
};

export default Message;
