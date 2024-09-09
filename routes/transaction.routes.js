const express = require("express");
const {
  transact,
  sendTransactionPool,
  mineTransactions,
} = require("../controllers/transaction.controller");

const router = express.Router();

router.post("/transact", transact);
router.get(
  "/transaction-pool-map",
  sendTransactionPool
);

router.get("/mine-transaction", mineTransactions);

module.exports = router;
