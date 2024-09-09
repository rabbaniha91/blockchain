import { useEffect, useState } from "react";
import { getBlocks } from "../api";
import Block from "./Block";
import { IoReturnUpBackSharp } from "react-icons/io5";


function Blocks({ setShowCase }) {
  const [blocks, setBlocks] = useState([]);
  const [recentBlock, setRecentBlock] =
    useState(null);
  const [blockNumber, setBlockNumber] =
    useState(null);
  const [showBlockDetails, setShowBlockDetails] =
    useState(false);

  useEffect(() => {
    getBlocks().then((response) => {
      console.log(response?.data);
      setBlocks(response.data);
    });
  }, []);
  return (
    <>
      <h2
        style={{
          textAlign: "center",
          marginBottom: "36px",
        }}>
        Blocks
      </h2>
      <div className="blocks">
        <div
          style={{
            width: "40%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
          }}>
          <img src="/images/blockchain.png" />
          <button onClick={() => setShowCase(1)}>
            <IoReturnUpBackSharp size={40} />
            Return
          </button>
        </div>

        <div className="blocks-list">
          {blocks.length > 0 &&
            blocks.map((block, i) => (
              <div
                onClick={() => {
                  setBlockNumber(i);
                  setRecentBlock(block);
                  setShowBlockDetails(true);
                }}
                className="block-link"
                key={block?.hash}>
                <p>
                  Hash:{" "}
                  {block?.hash.substring(0, 15)}
                  ...
                </p>
                <p>
                  Date:{" "}
                  {new Date(
                    block?.timestamp
                  ).toLocaleDateString()}
                </p>
              </div>
            ))}
          {showBlockDetails && (
            <Block
              block={recentBlock}
              number={blockNumber}
              setShowBlockDetails={
                setShowBlockDetails
              }
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Blocks;
