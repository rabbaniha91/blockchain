const Block = require("../blockchain/block");
const Blockchain = require("../blockchain/blockchain");
const Wallet = require("../wallet/wallet");
const Transaction = require("../wallet/transaction");

describe("Blockchain", () => {
  let blockchain;
  let newChain;
  let originalChain;
  let errorMock;
  let logMock;

  beforeEach(() => {
    blockchain = new Blockchain();
    newChain = new Blockchain();
    originalChain = blockchain.chain;

    errorMock = jest.fn();
    logMock = jest.fn();

    global.console.error = errorMock;
    global.console.log = logMock;
  });

  it("`chain` should be a instance of Array", () => {
    expect(
      blockchain.chain instanceof Array
    ).toBe(true);
  });
  it("chain should starts with genesis block", () => {
    expect(blockchain.chain[0]).toEqual(
      Block.genesis()
    );
  });
  it("adds a new block to chain", () => {
    const data = "foo";
    blockchain.addBlock({ data });
    expect(
      blockchain.chain[
        blockchain.chain.length - 1
      ].data
    ).toEqual(data);
  });

  describe("isValidChain", () => {
    describe("when this chain does not starts with genesis block", () => {
      it("returns false", () => {
        blockchain.chain[0] = {
          data: "fake-genesis",
        };
        expect(
          Blockchain.isValidChain(
            blockchain.chain
          )
        ).toBe(false);
      });
    });

    describe("when this chain does starts with genesis block and has multiple blocks", () => {
      beforeEach(() => {
        blockchain.addBlock({ data: "one" });
        blockchain.addBlock({ data: "two" });
        blockchain.addBlock({ data: "three" });
      });
      describe("and the lasthash refrence has change", () => {
        it("returns false", () => {
          blockchain.chain[2].lastHash =
            "broken-lastHash";
          expect(
            Blockchain.isValidChain(
              blockchain.chain
            )
          ).toBe(false);
        });
      });
      describe("and the chain contains a block with invalid field", () => {
        it("returns false", () => {
          blockchain.chain[1].hash =
            "invalid-hash";
          expect(
            Blockchain.isValidChain(
              blockchain.chain
            )
          ).toBe(false);
        });
      });
      describe("and the all block of chain is valid", () => {
        it("returns true", () => {
          expect(
            Blockchain.isValidChain(
              blockchain.chain
            )
          ).toBe(true);
        });
      });
    });
  });

  describe("replaceChain()", () => {
    describe("when new chain is not longer", () => {
      beforeEach(() => {
        newChain.chain[0] = {
          hash: "fake-genesis",
        };
        blockchain.replaceChain(newChain.chain);
      });

      it("does not replace", () => {
        expect(blockchain.chain).toEqual(
          originalChain
        );
      });

      it("does not replace", () => {
        expect(errorMock).toHaveBeenCalled();
      });
    });

    describe("when new chain is longer", () => {
      beforeEach(() => {
        newChain.addBlock({ data: "one" });
        newChain.addBlock({ data: "two" });
        newChain.addBlock({ data: "three" });
      });
      describe("and the chain is invalid", () => {
        beforeEach(() => {
          newChain.chain[2].hash = "fake-hash";
          blockchain.replaceChain(newChain.chain);
        });

        it("does not replace chain", () => {
          expect(blockchain.chain).toEqual(
            originalChain
          );
        });

        it("does not replace chain", () => {
          expect(errorMock).toHaveBeenCalled();
        });
      });
      describe("and the chain is valid", () => {
        it("does replace chain", () => {
          blockchain.replaceChain(newChain.chain);
          expect(blockchain.chain).toEqual(
            newChain.chain
          );
          expect(logMock).toHaveBeenCalled();
        });
      });
    });
  });

  describe("validTransactionData", () => {
    let transaction, rewardTransaction, wallet;

    beforeEach(() => {
      wallet = new Wallet();

      transaction = wallet.createTransaction({
        recipient: "bar",
        amount: 80,
      });

      rewardTransaction =
        Transaction.rewardTransaction({
          minerWallet: wallet,
        });
    });

    describe("and the transaction data is valid", () => {
      it("return's true", () => {
        newChain.addBlock({
          data: [transaction, rewardTransaction],
        });

        expect(
          blockchain.validTransactionData({
            chain: newChain.chain,
          })
        ).toBe(true);
      });
    });

    describe("and the transaction data has multiple rewards", () => {
      it("return's false and log's an error", () => {
        newChain.addBlock({
          data: [
            transaction,
            rewardTransaction,
            rewardTransaction,
          ],
        });
        expect(
          blockchain.validTransactionData({
            chain: newChain.chain,
          })
        ).toBe(false);

        expect(errorMock).toHaveBeenCalled();
      });
    });
    describe("and the transaction data has at least one malformed `outputMap`", () => {
      describe("and transaction is not reward transaction", () => {
        it("return's false and log's an error", () => {
          transaction.outputMap[
            wallet.publicKey
          ] = 99999;
          newChain.addBlock({
            data: [
              transaction,
              rewardTransaction,
            ],
          });
          expect(
            blockchain.validTransactionData({
              chain: newChain.chain,
            })
          ).toBe(false);

          expect(errorMock).toHaveBeenCalled();
        });
      });
      describe("and transaction is  reward transaction", () => {
        it("return's false and log's an error", () => {
          rewardTransaction.outputMap[
            wallet.publicKey
          ] = 999999;
          newChain.addBlock({
            data: [
              transaction,
              rewardTransaction,
            ],
          });
          expect(
            blockchain.validTransactionData({
              chain: newChain.chain,
            })
          ).toBe(false);

          expect(errorMock).toHaveBeenCalled();
        });
      });
    });

    describe("and the transaction data has at least one malformed `input`", () => {
      it("return's false", () => {
        wallet.balance = 9000;
        const evilOutputMap = {
          fooRecipient: 100,
          [wallet.publicKey]: 8900,
        };

        const evilTransaction = {
          input: {
            timestamp: Date.now(),
            amount: wallet.balance,
            address: wallet.publicKey,
            signature: wallet.sign(evilOutputMap),
          },

          outputMap: evilOutputMap,
        };

        newChain.addBlock({
          data: [
            evilTransaction,
            rewardTransaction,
          ],
        });

        expect(
          blockchain.validTransactionData({
            chain: newChain.chain,
          })
        ).toBe(false);
        expect(errorMock).toHaveBeenCalled();
      });
    });
    describe("and blocks contains mutiple identical transaction", () => {
      it("return's false", () => {
        newChain.addBlock({
          data: [
            transaction,
            transaction,
            rewardTransaction,
          ],
        });

        expect(
          blockchain.validTransactionData({
            chain: newChain.chain,
          })
        ).toBe(false);
        expect(errorMock).toHaveBeenCalled();
      });
    });
  });
});
