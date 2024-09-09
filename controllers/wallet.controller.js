const Wallet = require("../wallet/wallet");
const { wallet, blockchain } = require("./util");

const getWalletInfo = async (req, res) => {
  try {
    res.json({
      address: wallet.publicKey,
      balance: Wallet.calculateBalance({
        chain: blockchain.chain,
        address: wallet.publicKey,
      }),
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: error.message });
  }
};

module.exports = {getWalletInfo}
