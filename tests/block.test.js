const hexToBinary = require("hex-to-binary")
const Block = require("../blockchain/block")
const { GENESIS_BLOCK, MINE_RATE } = require("../configs/configs")
const hashFunc = require("../utils/hashFunc")

describe("Block", () => {
    const timestamp = 2000
    const hash = "foo hash"
    const lastHash = "last hash"
    const data = ['blockchain']
    const difficulty = 3
    const nonce = 1

    const block = new Block({
        timestamp,
        hash,
        lastHash,
        data,
        difficulty,
        nonce
    })

    it("has timestamp, hash, lasthash and data", () => {
        expect(block.timestamp).toEqual(timestamp)
        expect(block.hash).toEqual(hash)
        expect(block.lastHash).toEqual(lastHash)
        expect(block.data).toEqual(data)
        expect(block.difficulty).toEqual(difficulty)
        expect(block.nonce).toEqual(nonce)
    })


    describe("genesis block", () => {
        const genesisBlock = Block.genesis()

        it("returns instance of blocks", () => {
            expect(genesisBlock instanceof Block).toEqual(true)
        })

        it("returns genesis data", () => {
            expect(genesisBlock).toEqual(GENESIS_BLOCK)
        })
    })

    describe("miner", () => {
        const lastBlock = Block.genesis()
        const data = "data-new-block"
        const newBlock = Block.miner({ data, lastBlock })

        it('returns block instance', () => {
            expect(newBlock instanceof Block).toEqual(true)
        })

        it('newBlock `lasthash` should be lastBlock `hash`', () => {
            expect(newBlock.lastHash).toEqual(lastBlock.hash)
        })

        it("newBlock `data` should equal to data", () => {
            expect(newBlock.data).toEqual(data)
        })

        it("create a SHA-256 `hash` based on the proper inputs", () => {
            expect(newBlock.hash).toEqual(hashFunc(
                newBlock.timestamp,
                lastBlock.hash,
                data,
                newBlock.nonce
            ))
        })

        it("sets a hash that matches `difficulty` critria", () => {
            expect(hexToBinary(newBlock.hash).substring(0, newBlock.difficulty)).toEqual("0".repeat(newBlock.difficulty))
        })

        it("adjust the difficulty", () => {
            const possibleResult = [lastBlock.difficulty + 1, lastBlock.difficulty - 1];
            expect(possibleResult.includes(newBlock.difficulty)).toBe(true)
        })
    })


    describe("adjustDifficulty()", () => {
        it('increase the difficulty for a quickliy mined block', () => {

            expect(Block.adjustDifficulty({
                originalBlock: block,
                timestamp: block.timestamp + MINE_RATE - 100
            })).toEqual(difficulty + 1)
        })
        it('decrease the difficulty for a slower mined block', () => {

            expect(Block.adjustDifficulty({
                originalBlock: block,
                timestamp: block.timestamp + MINE_RATE + 100
            })).toEqual(difficulty - 1)
        })

        it("for lower difficulty", () => {
            block.difficulty = 1;
            expect(Block.adjustDifficulty({
                originalBlock: block,
                timestamp: block.timestamp + MINE_RATE + 100
            })).toEqual(1)
        })
    })

})