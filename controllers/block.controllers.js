const { blockchain, pubsub } = require("./util");

const getBlocks = (req, res) => {
  try {
    res.json(blockchain.chain);
  } catch (error) {
    console.error(error);
    res.json({ message: error });
  }
};

const mineBlocks = (req, res) => {
  try {
    const { data } = req.body;
    blockchain.addBlock({ data });
    pubsub.boardcastChain();
    res.redirect("/api/blocks/get");
  } catch (error) {
    console.error(error);
    res.json({ message: error });
  }
};

module.exports = {
  getBlocks,
  mineBlocks,
  blockchain,
  pubsub,
};
