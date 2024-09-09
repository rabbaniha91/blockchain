const express = require("express");
const { getInfo } = require("../controllers/cryptosInfo.controller");

const router = express.Router()

router.get("/cryptos", getInfo)


module.exports = router;