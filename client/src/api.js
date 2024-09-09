import axios from "./axios";

export async function getWalletInfo() {
  return await axios.get("/wallet/wallet-info");
}

export async function getBlocks() {
  return await axios.get("/blocks/get");
}

export async function addTrensaction({
  recipient,
  amount,
}) {
  return await axios.post(
    "/transaction/transact",
    { recipient, amount }
  );
}

export async function getTransactionPool() {
  return await axios.get(
    "/transaction/transaction-pool-map"
  );
}

export async function mineTransactions() {
  return await axios.get(
    "/transaction/mine-transaction"
  );
}

export async function getCryptosInfo() {
  return await axios.get("/cryptos");
}
