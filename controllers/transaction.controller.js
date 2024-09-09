const Transaction = require("../wallet/transaction");
const Wallet = require("../wallet/wallet");
const {
  transactionPool,
  wallet,
  pubsub,
  transactionMiner,
  blockchain,
} = require("./util");

const transact = (req, res) => {
  try {
    let { amount, recipient } = req.body;
    amount = parseFloat(amount);
    let transaction =
      transactionPool.isExsistingTransaction({
        inputAddress: wallet.publicKey,
      });

    if (transaction) {
      transaction.update({
        senderWallet: wallet,
        recipient,
        amount,
      });
    } else {
      transaction = wallet.createTransaction({
        recipient,
        amount,
        chain: blockchain.chain,
      });
    }

    transactionPool.setTransaction(transaction);

    pubsub.boardcastTransaction(transaction);

    res.json({ transaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const sendTransactionPool = (req, res) => {
  try {
    res.json(transactionPool.transactionMap);
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const mineTransactions = (req, res) => {
  try {
    transactionMiner.mineTransaction();
    res.redirect("/api/blocks/get");
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: error.message });
  }
};

module.exports = {
  transact,
  sendTransactionPool,
  transactionPool,
  mineTransactions,
};
