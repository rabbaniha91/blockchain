
const hexToBinary = require("hex-to-binary")

const { GENESIS_BLOCK, MINE_RATE } = require("../configs/configs");
const hashFunc = require("../utils/hashFunc");


class Block {
    constructor({ timestamp, hash, lastHash, data, difficulty, nonce }) {
        this.timestamp = timestamp;
        this.hash = hash;
        this.lastHash = lastHash;
        this.data = data;
        this.difficulty = difficulty;
        this.nonce = nonce
    }

    static genesis() {
        return new this(GENESIS_BLOCK)
    }

    static miner({ data, lastBlock }) {
        const lastHash = lastBlock.hash;
        let { difficulty } = lastBlock;

        let timestamp, hash;
        let nonce = 1

        do {

            nonce += 1
            timestamp = Date.now()
            hash = hashFunc(timestamp, lastHash, data, nonce)

        } while (hexToBinary(hash).substring(0, difficulty) !== ("0".repeat(difficulty)));

        difficulty = Block.adjustDifficulty({ originalBlock: lastBlock, timestamp })

        return new this({ timestamp, hash, lastHash, data: data, difficulty, nonce })
    }


    static adjustDifficulty({ originalBlock, timestamp }) {
        let { difficulty } = originalBlock;
        if ((timestamp - originalBlock.timestamp) > MINE_RATE) {
            if (difficulty > 1) return difficulty - 1
            return 1
        }
        return difficulty + 1;
        // let actualMineRate = timestamp - originalBlock.timestamp
        // let deviation = actualMineRate - MINE_RATE
        // let adjustmentFactor = Math.floor((Math.abs(deviation) / MINE_RATE) * 2.7)
        // if (actualMineRate > MINE_RATE) {
        //     difficulty -= adjustmentFactor;
        //     return difficulty < 1 ? 1 : difficulty
        // }
        // return difficulty += adjustmentFactor
    }
}

module.exports = Block