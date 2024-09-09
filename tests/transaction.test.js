const {
  REWARD_INPUT,
  MINING_REWARD,
} = require("../configs/configs");
const verifySignature = require("../utils/verifySignature");
const Transaction = require("../wallet/transaction");
const Wallet = require("../wallet/wallet");

describe("Transaction", () => {
  let transaction,
    senderWallet,
    recipient,
    amount;
  let errorMock;
  let logMock;

  beforeEach(() => {
    senderWallet = new Wallet();
    recipient = "fake-recipient";
    amount = 50;
    transaction = new Transaction({
      senderWallet,
      recipient,
      amount,
    });

    errorMock = jest.fn();
    logMock = jest.fn();

    global.console.error = errorMock;
    global.console.log = logMock;
  });

  it("has an `id` property", () => {
    expect(transaction).toHaveProperty("id");
  });

  describe("outputMap", () => {
    it("has a `transaction` property", () => {
      expect(transaction).toHaveProperty(
        "outputMap"
      );
    });

    it("outputs the amount to the recipient", () => {
      expect(
        transaction.outputMap[recipient]
      ).toEqual(amount);
    });

    it("outputs the remaining balance for the senderWallet", () => {
      expect(
        transaction.outputMap[
          senderWallet.publicKey
        ]
      ).toEqual(senderWallet.balance - amount);
    });
  });

  describe("input", () => {
    it("has an input", () => {
      expect(transaction).toHaveProperty("input");
    });

    describe("input's property", () => {
      it("has a `timestamp`", () => {
        expect(transaction.input).toHaveProperty(
          "timestamp"
        );
      });
      it("sets `amount` to the `senderWallet` balance", () => {
        expect(transaction.input.amount).toEqual(
          senderWallet.balance
        );
      });
      it("sets `address` to the `senderWallet` publicKey", () => {
        expect(transaction.input.address).toEqual(
          senderWallet.publicKey
        );
      });

      it("sings the input", () => {
        expect(
          verifySignature({
            publicKey: senderWallet.publicKey,
            data: transaction.outputMap,
            signature:
              transaction.input.signature,
          })
        );
      });
    });
  });

  describe("valid transaction", () => {
    describe("valid transaction", () => {
      it("return true", () => {
        expect(
          Transaction.validTransaction(
            transaction
          )
        ).toBe(true);
      });
    });
    describe("invalid transaction", () => {
      describe("and the transaction outputMap value is invalid", () => {
        it("return false", () => {
          transaction.outputMap[
            senderWallet.publicKey
          ] = 999999999;
          expect(
            Transaction.validTransaction(
              transaction
            )
          ).toBe(false);
          expect(errorMock).toHaveBeenCalled();
        });
      });
      describe("and the transaction input signature is invalid", () => {
        it("return false", () => {
          transaction.input.signature =
            new Wallet().sign("data");
          expect(
            Transaction.validTransaction(
              transaction
            )
          ).toBe(false);
          expect(errorMock).toHaveBeenCalled();
        });
      });
    });
  });

  describe("update()", () => {
    describe("and the amount is invalid", () => {
      it("throw an error", () => {
        expect(() => {
          transaction.update({
            senderWallet,
            recipient: "foo",
            amount: 999999,
          });
        }).toThrow("amount exceeds balance");
      });
    });
    describe("and the amount is valid", () => {
      let originalSignature,
        originalSenderOutput,
        nextRecipient,
        nextAmount;

      beforeEach(() => {
        originalSignature =
          transaction.input.signature;
        originalSenderOutput =
          transaction.outputMap[
            senderWallet.publicKey
          ];
        nextRecipient = "next-recipinet";
        nextAmount = 50;

        transaction.update({
          senderWallet,
          recipient: nextRecipient,
          amount: nextAmount,
        });
      });

      it("outputs the amount to the next recipient", () => {
        expect(
          transaction.outputMap[nextRecipient]
        ).toEqual(nextAmount);
      });

      it("substracts the amount from the original sender output", () => {
        expect(
          transaction.outputMap[
            senderWallet.publicKey
          ]
        ).toEqual(
          originalSenderOutput - nextAmount
        );
      });

      it("maintains a total output that matches the input amount", () => {
        expect(
          Object.values(
            transaction.outputMap
          ).reduce(
            (total, outputAmount) =>
              total + outputAmount
          )
        ).toEqual(transaction.input.amount);
      });

      it("re-signs the transaction", () => {
        expect(
          transaction.input.signature
        ).not.toEqual(originalSignature);
      });

      describe("and the another update for the same recipient", () => {
        let addedAmount;
        beforeEach(() => {
          addedAmount = 90;
          transaction.update({
            senderWallet,
            recipient: nextRecipient,
            amount: addedAmount,
          });
        });

        it("adds to the recipient amount", () => {
          expect(
            transaction.outputMap[nextRecipient]
          ).toEqual(nextAmount + addedAmount);
        });

        it("subtracts the amount from the original sender wallet", () => {
          expect(
            transaction.outputMap[
              senderWallet.publicKey
            ]
          ).toEqual(
            originalSenderOutput -
              nextAmount -
              addedAmount
          );
        });
      });
    });
  });

  describe("rewardTransaction()", () => {
    let rewardTransaction, minerWallet;

    beforeEach(() => {
      minerWallet = new Wallet();

      rewardTransaction =
        Transaction.rewardTransaction({
          minerWallet,
        });
    });

    it("creates a transaction with reward input's", () => {
      expect(rewardTransaction.input).toEqual(
        REWARD_INPUT
      );
    });

    it("creates one transaction for the miner with the `MINING_REWARD`", () => {
      expect(
        rewardTransaction.outputMap[
          minerWallet.publicKey
        ]
      ).toEqual(MINING_REWARD);
    })
  });
});
