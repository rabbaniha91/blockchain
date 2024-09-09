const express = require("express")
const { getBlocks, mineBlocks } = require("../controllers/block.controllers")

const router = express.Router()

router.get("/get", getBlocks)

router.post("/mine", mineBlocks)

module.exports = router