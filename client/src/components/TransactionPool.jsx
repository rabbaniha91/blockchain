import React, {
  useCallback,
  useEffect,
  useState,
} from "react";
import Transaction from "./Transaction";
import {
  getTransactionPool,
  mineTransactions,
} from "../api";
import {
  Link,
  useNavigate,
} from "react-router-dom";
import { IoReturnUpBackSharp } from "react-icons/io5";
import { SiAdminer } from "react-icons/si";

function TransactionPool({ setShowCase, toast }) {
  const navigate = useNavigate();
  const [transactionMap, setTransactionMap] =
    useState(null);

  useEffect(() => {
    const fetchData = () => {
      getTransactionPool().then((response) => {
        setTransactionMap(response?.data);
      });
    };

    fetchData();

    const interval = setInterval(
      fetchData,
      10000
    );

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleMine = useCallback(() => {
    mineTransactions().then(() => {
      toast.success(
        "Transactions successfuly mined",
        { position: "top-center" }
      );
      setShowCase(1);
    });
  });

  return (
    <div className="transaction-pool">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "24px",
          width: "40%",
        }}>
        <img src="/images/pool.png" alt="" />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}>
          <button onClick={() => setShowCase(1)}>
            <IoReturnUpBackSharp size={40} />
            Return
          </button>

          <button onClick={handleMine}>
            <SiAdminer size={40} />
            Mine
          </button>
        </div>
      </div>
      <div className="transaction-map">
        {transactionMap !== null &&
          Object.values(transactionMap).map(
            (transaction) => {
              return (
                <div key={transaction.id}>
                  <Transaction
                    transaction={transaction}
                  />
                </div>
              );
            }
          )}
      </div>
    </div>
  );
}

export default TransactionPool;
