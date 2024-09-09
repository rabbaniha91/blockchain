import { useCallback, useRef } from "react";
import { addTrensaction } from "../api";
import { GiConfirmed } from "react-icons/gi";
import { IoReturnUpBackSharp } from "react-icons/io5";

import {
  Link,
  useNavigate,
} from "react-router-dom";

function ConductTransaction({
  setShowCase,
  toast,
}) {
  const naviagte = useNavigate();
  const recipientRef = useRef(null);
  const amountRef = useRef(null);

  const handleSend = useCallback(async () => {
    const recipient = recipientRef.current.value;
    const amount = amountRef.current.value;

    if (recipient && amount) {
      addTrensaction({ recipient, amount })
        .then((response) => {
          toast.success("Success", {
            position: "top-center",
          });
          setShowCase(3);
        })
        .catch((error) => {
          toast.error(
            error.response.data.message,
            {
              position: "top-center",
            }
          );
        });
    }
  });

  return (
    <div className="form">
      <input
        className="input"
        ref={recipientRef}
        placeholder="recipient"
        type="text"
      />
      <input
        className="input"
        ref={amountRef}
        placeholder="amount"
        type="number"
      />
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginTop: "24px",
        }}>
        <button onClick={() => setShowCase(1)}>
          <IoReturnUpBackSharp size={40} />
          Return
        </button>
        <button onClick={() => handleSend()}>
          <GiConfirmed size={40} />
          Confirm
        </button>
      </div>
    </div>
  );
}

export default ConductTransaction;
