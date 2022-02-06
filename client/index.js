import "./index.scss";
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const sha256 = require("crypto-js/sha256")


const server = "http://localhost:3042";

document.getElementById("exchange-address").addEventListener('input', ({ target: {value} }) => {
  if(value === "") {
    document.getElementById("balance").innerHTML = 0;
    return;
  }

  fetch(`${server}/balance/${value}`).then((response) => {
    return response.json();
  }).then(({ balance }) => {
    document.getElementById("balance").innerHTML = balance;
  });
});

document.getElementById("add-public-address").addEventListener('click', () => {
  const sender = document.getElementById("exchange-address").value
  const newPublicAddress = document.getElementById("public-address").value
  console.log(sender)
  console.log(newPublicAddress)

  const request = new Request(`${server}/send`, { method: 'POST', body });

  fetch(request, { headers: { 'Content-Type': 'application/json' }}).then(response => {
    return response.json();
  }).then(({ balance }) => {
    document.getElementById("balance").innerHTML = balance;
  });
})


document.getElementById("transfer-amount").addEventListener('click', () => {
  const sender = document.getElementById("exchange-address").value;
  const amount = document.getElementById("send-amount").value;
  const recipient = document.getElementById("recipient").value;
  const privateKey = document.getElementById("private-key").value

  // set up signing with privateKey
  const key = ec.keyFromPrivate(privateKey)
  const messageToVerify = `${sender} will send ${recipient} this much money: $${amount}`
  const messageHash = sha256(messageToVerify)
  const signature = key.sign(messageHash.toString())
  console.log('signature ', signature)

  const body = JSON.stringify({
    sender, amount, recipient, signature, messageToVerify
  });

  const request = new Request(`${server}/send`, { method: 'POST', body });

  fetch(request, { headers: { 'Content-Type': 'application/json' }}).then(response => {
    return response.json();
  }).then(({ balance }) => {
    document.getElementById("balance").innerHTML = balance;
  });
});