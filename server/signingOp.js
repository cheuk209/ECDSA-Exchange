const { sha256 } = require("ethereum-cryptography/sha256");
const secp = require("ethereum-cryptography/secp256k1");
const { hexToBytes, concatBytes, toHex, utf8ToBytes } = require("ethereum-cryptography/utils");

async function signingOperation(senderPrivKey, amount){  
        msgHash = sha256(utf8ToBytes(amount));
        signature = await secp.sign(msgHash, senderPrivKey);
        return [signature, msgHash];
}

module.exports = {
    signingOperation,
  };
