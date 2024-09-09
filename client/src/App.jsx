import Blocks from "./components/Blocks";
import Wallet from "./components/Wallet";

import "./App.css";
import Cryptos from "./components/Cryptos";
import { useState } from "react";
import ConductTransaction from "./components/ConductTransaction";
import TransactionPool from "./components/TransactionPool";

import {
  ToastContainer,
  toast,
} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [showCase, setShowCase] = useState(1);
  return (
    <>
      <ToastContainer
        closeButton={false}
        autoClose={5000}
      />
      <section className="container">
        <div className="inner-container">
          {showCase === 1 && (
            <Wallet
              setShowCase={setShowCase}
              toast={toast}
            />
          )}
          {showCase === 2 && (
            <ConductTransaction
              setShowCase={setShowCase}
              toast={toast}
            />
          )}
          {showCase === 3 && (
            <TransactionPool
              toast={toast}
              setShowCase={setShowCase}
            />
          )}
          {showCase === 4 && (
            <Blocks setShowCase={setShowCase} />
          )}
        </div>
        <Cryptos />
      </section>
    </>
  );
}

export default App;
