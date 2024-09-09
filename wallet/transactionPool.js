const Transaction = require("./transaction");

class TransactionPool {
  constructor() {
    this.transactionMap = {};
  }

  setTransaction(tranaction) {
    this.transactionMap[tranaction.id] =
      tranaction;
  }

  isExsistingTransaction({ inputAddress }) {
    const transactions = Object.values(
      this.transactionMap
    );
    const transaction = transactions.find(
      (transaction) =>
        transaction.input.address === inputAddress
    );

    return transaction;
  }

  setMap(transactions) {
    this.transactionMap = transactions;
  }

  validTransactions() {
    return Object.values(
      this.transactionMap
    ).filter((transaction) => {
      return Transaction.validTransaction(
        transaction
      );
    });
  }

  clear() {
    this.transactionMap = {};
  }

  clearBlockchainTransaction({ chain }) {
    for (let i = 0; i < chain.length; i++) {
      const block = chain[i];
      for (let tranaction of block.data) {
        if (this.transactionMap[tranaction.id]) {
          delete this.transactionMap[
            tranaction.id
          ];
        }
      }
    }
  }
}

module.exports = TransactionPool;
