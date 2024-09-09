const Blockchain = require("../blockchain/blockchain")
const { MINE_RATE } = require("../configs/genesisBlock")

const blockchain = new Blockchain()

blockchain.addBlock({ data: "initail block" })

let previusTimestamp, nextTimestamp, nextBlock, diffTime, average, deviation;
const times = []

for (let i = 0; i < 1000; i++) {
    previusTimestamp = blockchain.chain[blockchain.chain.length - 1].timestamp;
    blockchain.addBlock({ data: `block "${i}"` });
    nextBlock = blockchain.chain[blockchain.chain.length - 1];
    nextTimestamp = nextBlock.timestamp;
    diffTime = nextTimestamp - previusTimestamp;
    times.push(diffTime)
    average = times.reduce((total, time) => total + time) / times.length
    deviation = diffTime - MINE_RATE

    console.log(`Time to mine block: '${diffTime} ms', difficulty: '${nextBlock.difficulty}'. average: '${average} ms'`)
}