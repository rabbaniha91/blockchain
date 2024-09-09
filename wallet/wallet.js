const {
  STARTING_BALANCE,
} = require("../configs/configs.js");
const { ec } = require("../utils/ec.js");
const hashFunc = require("../utils/hashFunc.js");
const Transaction = require("./transaction.js");

class Wallet {
  constructor() {
    this.balance = STARTING_BALANCE;
    this.keyPair = ec.genKeyPair();
    this.publicKey = this.keyPair
      .getPublic()
      .encode("hex");
  }

  sign(data) {
    return this.keyPair.sign(hashFunc(data));
  }

  createTransaction({
    recipient,
    amount,
    chain,
  }) {
    if (chain) {
      this.balance = Wallet.calculateBalance({
        chain,
        address: this.publicKey,
      });
    }
    if (amount > this.balance) {
      throw new Error("amount exceeds balance");
    }

    return new Transaction({
      senderWallet: this,
      recipient,
      amount,
    });
  }

  static calculateBalance({ chain, address }) {
    let outputTotal = 0;
    let hasCondectedTransaction = false;
    for (let i = chain.length - 1; i > 0; i--) {
      const block = chain[i];

      for (let transaction of block.data) {
        if (
          transaction.input.address === address
        ) {
          hasCondectedTransaction = true;
        }
        const outputAddress =
          transaction.outputMap[address];
        if (outputAddress) {
          outputTotal += outputAddress;
        }
      }

      if (hasCondectedTransaction) {
        break;
      }
    }

    return hasCondectedTransaction
      ? outputTotal
      : STARTING_BALANCE + outputTotal;
  }

  
}

module.exports = Wallet;
