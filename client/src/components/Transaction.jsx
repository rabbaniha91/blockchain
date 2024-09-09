function Transacion({ transaction }) {
  return (
    <>
      {transaction && (
        <div className="transaction">
          <div>
            From:{" "}
            {`${transaction?.input?.address.substring(
              0,
              4
            )}...${transaction?.input?.address.substring(
              transaction?.input?.address.length -
                4
            )}`}{" "}
            | Balance:{" "}
            {transaction?.input?.amount}
          </div>
          {Object.keys(
            transaction?.outputMap
          )?.map((recipient) => (
            <div key={recipient}>
              To:{" "}
              {`${recipient?.substring(
                0,
                4
              )}...${recipient?.substring(
                recipient.length - 4
              )}`}{" "}
              | sent:{" "}
              {transaction?.outputMap[recipient]}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default Transacion;
