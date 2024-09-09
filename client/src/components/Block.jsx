import { IoIosClose } from "react-icons/io";
import Transaction from "./Transaction";

function Block({
  block,
  number,
  setShowBlockDetails,
}) {
  return (
    <>
      <div className="block">
        <h2>Block {number}</h2>
        <div>Hash: {block?.hash}</div>
        <div>
          Timestamp:
          {new Date(
            block?.timestamp
          ).toLocaleDateString()}
        </div>
        <>
          {block?.data?.length > 0 && block?.data.map((transaction) => {
            return (
              <Transaction
                transaction={transaction}
                key={transaction?.id}
              />
            );
          })}
        </>

        <IoIosClose
          onClick={() =>
            setShowBlockDetails(false)
          }
          className="close-block"
          color="#e11"
          size={34}
          fontWeight={700}
        />
      </div>
    </>
  );
}

export default Block;
