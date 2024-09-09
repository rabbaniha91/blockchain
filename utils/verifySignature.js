const { ec } = require("./ec")
const hashFunc = require("./hashFunc")

const verifySignature = ({ publicKey, data, signature }) => {
    const keyFromPublic = ec.keyFromPublic(publicKey, "hex")
    return keyFromPublic.verify(hashFunc(data), signature)
}

module.exports = verifySignature;