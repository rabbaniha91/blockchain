const Transaction = require("../wallet/transaction");
const Wallet = require("../wallet/wallet");
const TransactionPool = require("../wallet/TransactionPool");
const Blockchain = require("../blockchain/blockchain");

describe("TransactionPool", () => {
  let tranactionPool, tranaction, senderWallet;

  beforeEach(() => {
    tranactionPool = new TransactionPool();
    senderWallet = new Wallet();
    tranaction = new Transaction({
      senderWallet,
      recipient: "new recipient",
      amount: 80,
    });
  });

  it("adds transaction to transaction pool", () => {
    tranactionPool.setTransaction(tranaction);

    expect(
      tranactionPool.transactionMap[tranaction.id]
    ).toBe(tranaction);
  });

  describe("validTransactions()", () => {
    let validTransactions, errorMock;

    beforeEach(() => {
      validTransactions = [];
      errorMock = jest.fn();
      global.console.error = errorMock;

      for (let i = 0; i < 10; i++) {
        tranaction = new Transaction({
          senderWallet,
          recipient: "foo-bar",
          amount: 30,
        });

        if (i % 3 === 0) {
          tranaction.input.amount = 999999;
        } else if (i % 3 === 1) {
          tranaction.input.signature =
            new Wallet().sign("boo");
        } else {
          validTransactions.push(tranaction);
        }

        tranactionPool.setTransaction(tranaction);
      }
    });

    it("returns valid transaction", () => {
      expect(
        tranactionPool.validTransactions()
      ).toEqual(validTransactions);
    });

    it("log's error for invalid transaction", () => {
      tranactionPool.validTransactions();
      expect(errorMock).toHaveBeenCalled();
    });
  });

  describe("clear()", () => {
    it("clear the transaction", () => {
      tranactionPool.clear();
      expect(
        tranactionPool.transactionMap
      ).toEqual({});
    });
  });

  describe("clearBlockchainTranaction()", () => {
    it("clear pool from any blockchain transaction", () => {
      const blockchain = new Blockchain();
      const expectingTransaction = {};

      for (let i = 0; i < 6; i++) {
        const transaction =
          new Wallet().createTransaction({
            recipient: "foo",
            amount: 10,
          });

        tranactionPool.setTransaction(
          transaction
        );

        if (i % 2 === 0) {
          blockchain.addBlock({
            data: [transaction],
          });
        } else {
          expectingTransaction[transaction.id] =
            transaction;
        }
      }

      tranactionPool.clearBlockchainTransaction({
        chain: blockchain.chain,
      });
      expect(
        tranactionPool.transactionMap
      ).toEqual(expectingTransaction);
    });
  });
});
