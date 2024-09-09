import {
  useEffect,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { getWalletInfo } from "../api";

import {
  RiFolderReceivedLine,
  RiFolderSharedLine,
  RiMoneyDollarCircleLine,
} from "react-icons/ri";
import { FaSwimmingPool } from "react-icons/fa";
import { SiCodeblocks } from "react-icons/si";
import WalletAddress from "./WalletAddress";

function Wallet({ setShowCase, toast }) {
  const [walletInfo, setWalletInfo] =
    useState(null);

  const [showAddress, setShowAddress] =
    useState(false);

  const addressRef = useRef(null);

  useEffect(() => {
    getWalletInfo().then((response) => {
      setWalletInfo(response.data);
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      if (
        addressRef.current &&
        !addressRef.current.contains(event.target)
      ) {
        setShowAddress(false);
      }
    };

    window.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      window.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [showAddress]);

  return (
    <div className="wallet">
      {showAddress && (
        <div
          ref={addressRef}
          className="wallet-address">
          <WalletAddress
            toast={toast}
            setShowAddress={setShowAddress}
            address={walletInfo?.address}
          />
        </div>
      )}
      <div className="image">
        <img src="./images/wallet-svgrepo-com.svg" />
      </div>
      <div className="wallet-info">
        <h1>WELLCOME BACK</h1>
        <div className="balance">
          <span>Balance</span>
          <div
            style={{
              display: "flex",
              gap: "2px",
              alignItems: "center",
            }}>
            <RiMoneyDollarCircleLine
              size={20}
              style={{ marginRight: "10px" }}
            />
            <span>{walletInfo?.balance}</span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}>
          <div
            style={{
              display: "flex",
              gap: "12px",
            }}>
            <button
              onClick={() =>
                setShowAddress(true)
              }>
              <RiFolderReceivedLine size={40} />
              <span>Recive</span>
            </button>
            <button
              onClick={() => setShowCase(2)}
              className="transaction"
              to={"/transact"}>
              <RiFolderSharedLine size={40} />

              <span>Send</span>
            </button>
          </div>
          <div
            style={{
              display: "flex",
              gap: "12px",
            }}>
            <button
              onClick={() => setShowCase(3)}
              className="transaction">
              <FaSwimmingPool size={40} />
              <span>Pool</span>
            </button>
            <button
              onClick={() => setShowCase(4)}
              className="transaction">
              <SiCodeblocks size={40} />
              <span>Blocks</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Wallet;
