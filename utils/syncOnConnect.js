const axios = require("axios");
const {
  blockchain,
  transactionPool,
} = require("../controllers/util");

const syncOnConnect = async (port) => {
  let responce = await axios.get(
    `http:localhost:${port}/api/blocks/get`
  );
  blockchain.replaceChain(responce.data);
  responce = await axios.get(
    `http:localhost:${port}/api/transaction/transaction-pool-map`
  );

  transactionPool.setMap(responce.data);
};

module.exports = syncOnConnect;
