const Block = require("./block");
const Transaction = require("../wallet/transaction");
const hashFunc = require("../utils/hashFunc");
const {
  REWARD_INPUT,
  MINING_REWARD,
} = require("../configs/configs");
const Wallet = require("../wallet/wallet");

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock({ data }) {
    const lastBlock =
      this.chain[this.chain.length - 1];
    this.chain.push(
      Block.miner({ data, lastBlock })
    );
  }

  static isValidChain(chain) {
    if (
      JSON.stringify(chain[0]) !==
      JSON.stringify(Block.genesis())
    )
      return false;

    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const ActualLastHash = chain[i - 1].hash;
      const {
        timestamp,
        hash,
        lastHash,
        data,
        nonce,
      } = block;

      if (lastHash !== ActualLastHash)
        return false;
      if (
        hash !==
        hashFunc(timestamp, lastHash, data, nonce)
      )
        return false;
    }
    return true;
  }

  replaceChain(
    newChain,
    validTransaction,
    onSuccess
  ) {
    if (this.chain.length >= newChain.length) {
      console.error(
        "the incoming chain must be longer"
      );
      return;
    }
    if (!Blockchain.isValidChain(newChain)) {
      console.error(
        "the incoming chain must be valid"
      );
      return;
    }

    if (
      validTransaction &&
      !this.validTransactionData({
        chain: newChain,
      })
    ) {
      console.error(
        "the incoming chain has invalid data"
      );
      return;
    }

    if (onSuccess) onSuccess();
    this.chain = newChain;
    console.log(
      `replacing done. new blockchain: ${JSON.stringify(
        newChain
      )}`
    );
  }

  validTransactionData({ chain }) {
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const transactionSet = new Set();
      let rewardTransactionCount = 0;
      for (let transaction of block.data) {
        if (
          transaction.input.address ===
          REWARD_INPUT.address
        ) {
          rewardTransactionCount += 1;
          if (rewardTransactionCount > 1) {
            console.error(
              "Miner reward exceed limit"
            );
            return false;
          }
          if (
            Object.values(
              transaction.outputMap
            )[0] !== MINING_REWARD
          ) {
            console.error(
              "Miner reward is invalid"
            );
            return false;
          }
        } else {
          if (
            !Transaction.validTransaction(
              transaction
            )
          ) {
            console.error("invalid transaction");
            return false;
          }

          const mergedChain = [
            ...this.chain,
            ...chain.slice(this.chain.length),
          ];

          const trueBalance =
            Wallet.calculateBalance({
              chain: mergedChain.slice(0, i),
              address: transaction.input.address,
            });


          if (
            transaction.input.amount !==
            trueBalance
          ) {
            console.error("invalid input amount");
            return false;
          }

          if (transactionSet.has(transaction)) {
            console.error(
              "repeat transaction not allowd"
            );
            return false;
          } else {
            transactionSet.add(transaction);
          }
        }
      }
    }
    return true;
  }
}

module.exports = Blockchain;
