import React, {
  useEffect,
  useState,
} from "react";
import { CgDollar } from "react-icons/cg";
import { FaArrowDownLong } from "react-icons/fa6";

const CryptosInfo = ({
  name,
  symbol,
  price,
  change24h,
  change7d,
}) => {
  const [change24hStyle, setChange24hStyle] =
    useState(null);
  const [change7dStyle, setChange7dStyle] =
    useState(null);
  useEffect(() => {
    const descending = {
      color: "#f00",
      fontWeight: "600",
    };
    const ascending = {
      transform: "rotate(180deg)",
      color: "#0f0",
      fontWeight: "600",
    };
    setChange24hStyle(
      change24h?.startsWith("-")
        ? descending
        : ascending
    );
    setChange7dStyle(
      change7d?.startsWith("-")
        ? descending
        : ascending
    );
  }, [change24h, change7d]);
  return (
    <div className="crypto-info">
      <div
        style={{
          display: "flex",
          flexDirection: "row-reverse",
          justifyContent: "space-between",
        }}>
        <h3>{name}</h3>
        <h3>{symbol}</h3>
      </div>
      <span>
        Price (USD):{" "}
        <b>
          {price}
          <CgDollar />
        </b>
      </span>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px"
        }}>
        <span>
          Percent Change 24 hours:{" "}
          <b>
            {change24h}
            <FaArrowDownLong
              style={
                change24hStyle && change24hStyle
              }
            />
          </b>
        </span>
        <span>
          Percent Change 7 days:{" "}
          <b>
            {change7d}
            <FaArrowDownLong
              style={
                change7dStyle && change7dStyle
              }
            />
          </b>
        </span>
      </div>
    </div>
  );
};

export default CryptosInfo;
