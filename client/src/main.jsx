import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import ConductTransaction from "./components/ConductTransaction.jsx";
import TransactionPool from "./components/TransactionPool.jsx";

createRoot(
  document.getElementById("root")
).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/transact"
          element={<ConductTransaction />}
        />
        <Route
          path="/transaction-pool"
          element={<TransactionPool />}
        />

        <Route path="/home" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
