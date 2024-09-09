const Wallet = require("../wallet/wallet");
const Transaction = require("../wallet/transaction");
const Blockchain = require("../blockchain/blockchain");
const verifySignature = require("../utils/verifySignature");
const {
  STARTING_BALANCE,
} = require("../configs/configs");

describe("Wallet", () => {
  let wallet;

  beforeEach(() => {
    wallet = new Wallet();
  });

  describe("check for require property", () => {
    it("should has `balance` property", () => {
      expect(wallet).toHaveProperty("balance");
    });

    it("should has `publicKey` property", () => {
      expect(wallet).toHaveProperty("publicKey");
    });
  });

  describe("singing data", () => {
    const data = "some-data";
    it("valid signature", () => {
      expect(
        verifySignature({
          publicKey: wallet.publicKey,
          data,
          signature: wallet.sign(data),
        })
      ).toBe(true);
    });
    it("invalid signature", () => {
      expect(
        verifySignature({
          publicKey: wallet.publicKey,
          data,
          signature: new Wallet().sign(data),
        })
      ).toBe(false);
    });
  });

  describe("createTransaction()", () => {
    describe("and the amount exceeds balance", () => {
      it("throw an error", () => {
        expect(() =>
          wallet.createTransaction({
            amount: 999999,
            recipient: "fake-recipient",
          })
        ).toThrow("amount exceeds balance");
      });
    });

    describe("and the amount is valid", () => {
      let transaction, amount, recipient;

      beforeEach(() => {
        amount = 50;
        recipient = "foo-recipinet";
        transaction = wallet.createTransaction({
          amount,
          recipient,
        });
      });
      it("create an instance of `Transaction`", () => {
        expect(
          transaction instanceof Transaction
        ).toBe(true);
      });
      it("matches the tranaction input with the wallet", () => {
        expect(transaction.input.address).toEqual(
          wallet.publicKey
        );
      });
      it("outputs the amount the recipient", () => {
        expect(
          transaction.outputMap[recipient]
        ).toEqual(amount);
      });
    });

    describe("and the chain is passed", () => {
      it("the Wallet.calcualteBalance should be called", () => {
        const calculateBalanceMock = jest.fn();
        const originalCalculateBalance =
          Wallet.calculateBalance;
        Wallet.calculateBalance =
          calculateBalanceMock;

        wallet.createTransaction({
          recipient: "foo",
          amount: 90,
          chain: new Blockchain().chain,
        });

        expect(
          calculateBalanceMock
        ).toHaveBeenCalled();

        Wallet.calculateBalance =
          originalCalculateBalance;
      });
    });
  });

  describe("calculateBalance()", () => {
    let blockchain;

    beforeEach(() => {
      blockchain = new Blockchain();
    });

    describe("and there are no outputs for the wallet", () => {
      it("returns the starting balance", () => {
        expect(
          Wallet.calculateBalance({
            chain: blockchain.chain,
            address: wallet.publicKey,
          })
        ).toEqual(STARTING_BALANCE);
      });
    });

    describe("and there are output for the wallet", () => {
      let transactionOne, transactionTwo;
      beforeEach(() => {
        transactionOne =
          new Wallet().createTransaction({
            recipient: wallet.publicKey,
            amount: 50,
          });
        transactionTwo =
          new Wallet().createTransaction({
            recipient: wallet.publicKey,
            amount: 60,
          });

        blockchain.addBlock({
          data: [transactionOne, transactionTwo],
        });
      });

      it("adds the sum of all outputs to the wallet balance", () => {
        expect(
          Wallet.calculateBalance({
            chain: blockchain.chain,
            address: wallet.publicKey,
          })
        ).toEqual(
          STARTING_BALANCE +
            transactionOne.outputMap[
              wallet.publicKey
            ] +
            transactionTwo.outputMap[
              wallet.publicKey
            ]
        );
      });
    });

    describe("and the wallet has made a transaction", () => {
      let recentTransaction;

      beforeEach(() => {
        recentTransaction =
          wallet.createTransaction({
            recipient: "foo",
            amount: 10,
          });

        blockchain.addBlock({
          data: [recentTransaction],
        });
      });

      it("retruns the output amount of the recent transaction", () => {
        expect(
          Wallet.calculateBalance({
            chain: blockchain.chain,
            address: wallet.publicKey,
          })
        ).toEqual(
          recentTransaction.outputMap[
            wallet.publicKey
          ]
        );
      });

      describe("and there are outputs next to and after the recent transaction", () => {
        let sameBlockTransaction,
          nextBlockTransaction;

        beforeEach(() => {
          recentTransaction =
            wallet.createTransaction({
              recipient: "later-foo-address",
              amount: 70,
            });

          sameBlockTransaction =
            Transaction.rewardTransaction({
              minerWallet: wallet,
            });

          blockchain.addBlock({
            data: [
              recentTransaction,
              sameBlockTransaction,
            ],
          });

          nextBlockTransaction =
            new Wallet().createTransaction({
              recipient: wallet.publicKey,
              amount: 40,
            });

          blockchain.addBlock({
            data: [nextBlockTransaction],
          });
        });

        it("inclides the output amounts in the returned balance", () => {
          expect(
            Wallet.calculateBalance({
              chain: blockchain.chain,
              address: wallet.publicKey,
            })
          ).toEqual(
            recentTransaction.outputMap[
              wallet.publicKey
            ] +
              sameBlockTransaction.outputMap[
                wallet.publicKey
              ] +
              nextBlockTransaction.outputMap[
                wallet.publicKey
              ]
          );
        });
      });
    });
  });
});
