const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const sha256 = require("crypto-js/sha256")

// localhost can have cross origin errors
// depending on the browser you use!


app.use(cors());
app.use(express.json());

const key1 = ec.genKeyPair()
const key2 = ec.genKeyPair()
const key3 = ec.genKeyPair()

const address1 = key1.getPublic().encode('hex')
const address2 = key2.getPublic().encode('hex')
const address3 = key3.getPublic().encode('hex')

const privKey1 = key1.getPrivate().toString(16);
const privKey2 = key2.getPrivate().toString(16);
const privKey3 = key3.getPrivate().toString(16);

const balances = {
  [address1] : 100,
  [address2] : 50,
  [address3] : 75,
}


app.get('/balance/:address', (req, res) => {
  const {address} = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', (req, res) => {
  const { signature, sender, recipient, amount, messageToVerify} = req.body;

  console.log(req.body)

  const senderPubkey = ec.keyFromPublic(sender, 'hex');
  
  const messageToVerifyHash = sha256(messageToVerify).toString()

  const signatureVerify = senderPubkey.verify(messageToVerifyHash, signature)
  console.log("signed: ", signatureVerify)

  if (signatureVerify) {
    balances[sender] -= amount;
    balances[recipient] = (balances[recipient] || 0) + +amount;
    res.send({ balance: balances[sender] });
  } else {
    console.log('try again chief')
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
  console.log("this is the public key", balances)
  console.log("private key 1", privKey1)
}); 
