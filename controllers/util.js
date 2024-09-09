const Blockchain = require("../blockchain/blockchain");
const Pubsub = require("../app/pubsub");
const Wallet = require("../wallet/wallet");
const TransactionPool = require("../wallet/transactionPool");
const TransactionMiner = require("../app/transactionMiner");

const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new Pubsub({
  blockchain,
  transactionPool,
});

const transactionMiner = new TransactionMiner({
  blockchain,
  transactionPool,
  wallet,
  pubsub,
});

// const walletFoo = new Wallet();
// const walletBar = new Wallet();

// const generateWalletTransaction = ({
//   wallet,
//   recipient,
//   amount,
// }) => {
//   const transaction = wallet.createTransaction({
//     recipient,
//     amount,
//     chain: blockchain.chain,
//   });

//   transactionPool.setTransaction(transaction);
// };

// const walletAction = () =>
//   generateWalletTransaction({
//     wallet,
//     recipient: walletFoo.publicKey,
//     amount: 5,
//   });

// const walletFooAction = () =>
//   generateWalletTransaction({
//     wallet: walletFoo,
//     recipient: walletBar.publicKey,
//     amount: 10,
//   });

// const walletBarAction = () =>
//   generateWalletTransaction({
//     wallet: walletBar,
//     recipient: wallet.publicKey,
//     amount: 15,
//   });

// for (let i = 0; i < 10; i++) {
//   if (i % 3 === 0) {
//     walletAction();
//     walletFooAction();
//   } else if (i % 3 === 1) {
//     walletAction();
//     walletBarAction();
//   } else {
//     walletFooAction();
//     walletBarAction();
//   }

//   transactionMiner.mineTransaction();
// }

module.exports = {
  blockchain,
  transactionPool,
  wallet,
  pubsub,
  transactionMiner,
};
