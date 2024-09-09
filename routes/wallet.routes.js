const express = require('express');
const { getWalletInfo } = require('../controllers/wallet.controller');

const router = express.Router()

router.get("/wallet-info", getWalletInfo)

module.exports = router;