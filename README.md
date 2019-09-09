<p align="center">
  <a href="https://www.cosmostation.io" target="_blank" rel="noopener noreferrer"><img width="100" src="https://user-images.githubusercontent.com/20435620/55696624-d7df2e00-59f8-11e9-9126-edf9a40b11a8.png" alt="Cosmostation logo"></a>
</p>

<h1 align="center">
    Keystation 
</h1>

**:alien: Developed / Developing by** [Cosmostation](https://www.cosmostation.io/)

## Overview

Keystation is a decentralized keychain-based authenticator that **DOES NOT require any installation**. User keys are securely stored in the web browser Keychain, allowing for users to conveniently sign transactions for networks and decentralized applications built with the Cosmos SDK. Keystation can be used as a secure and convenient authentication and key management tool for web login, decentralized exchanges, decentralized applications, and various services built with the Cosmos SDK.

<div align="center">
<img width="200" alt="keystation1_" src="https://user-images.githubusercontent.com/34641838/63918685-1e045f00-ca78-11e9-9e8e-a50388ec7bce.png">
<img width="200" alt="keystation2" src="https://user-images.githubusercontent.com/34641838/63916099-a7189780-ca72-11e9-8574-b6d0dca4551f.png">
<img width="200" alt="keystation3" src="https://user-images.githubusercontent.com/34641838/63916106-a97af180-ca72-11e9-90da-ebf52526d75b.png">
</div>

## Import

```
<script src="https://keystation.cosmostation.io/lib/keystation.js"></script>
```

## Usage

```js
// initializing configuration
var keystation = new Keystation();
keystation.client = "YOUR_WEB_URL";
keystation.lcd = "https://lcd-do-not-abuse.cosmostation.io";
keystation.path = "44/118/0/0/0";
```

```js
// open popup window for sign-in
var prefix = "cosmos";
var popup = keystation.openWindow("signin", prefix);
```

```js
// generate a transaction
var txJson = {"account_number":"18012","chain_id":"cosmoshub-2","fee":{"amount":[{"amount":"5000","denom":"uatom"}],"gas":"200000"},"memo":"","msgs":[{"type":"cosmos-sdk/MsgSend","value":{"amount":[{"amount":"10000","denom":"uatom"}],"from_address":"cosmos1z67fshyr48pa9a6htdz4qd0zullfk6y0fgvxv7","to_address":"cosmos10nv3yj0jdxf02vxyc0tavf97fdvppdth6wmcn3"}}],"sequence":"24"};

var txJsonStr = JSON.stringify(txJson);
var popup = keystation.openWindow("transaction", txJsonStr);
```

```js
// add an EventListener
window.addEventListener("message", function(e) {
    if (e.origin != "https://keystation.cosmostation.io") return;
    console.log(e.data);
} , false);
```

## Supporting Transaction Message Types

You can find currently supporting meesage types in [our CosmosJS library](https://github.com/cosmostation/cosmosjs#supporting-message-types-updating)

## How to Create txJson

```js
// CosmosJS supports to create tx for Cosmos
cosmos.getAccounts(address).then(data => {
	let stdSignMsg = cosmos.NewStdMsg({
		type: "cosmos-sdk/MsgSend",
		from_address: address,
		to_address: "cosmos18vhdczjut44gpsy804crfhnd5nq003nz0nf20v",
		amountDenom: "uatom",
		amount: 100000,		// 6 decimal places
		feeDenom: "uatom",
		fee: 5000,
		gas: 200000,
		memo: "",
		account_number: data.value.account_number,
		sequence: data.value.sequence
	});
    
	console.log(stdSignMsg.json);   // txJson
})
```

## Security

Keystation stores user mnemonic phrase on a key management system, Keychain in Chrome and Safari. A user is the only one who can access the keychain, and no third party is granted access. User mnemonic phrase is encrypted with AES algorithm for higher security before being stored. A PIN set by the user is required in order to access the encrypted mnemonic phrase.

* [How secure is Chrome storing a password?](https://security.stackexchange.com/questions/170481/how-secure-is-chrome-storing-a-password)

* [Manage saved passwords](https://support.google.com/chrome/answer/95606?co=GENIE.Platform%3DDesktop&hl=en)

## Issues

We welcome any type of issues. Please provide information in detail when you post issues or bugs.

## Contribution

We welcome any contributions, suggestions, improvements, or feature requests.

There will be `CONTRIBUTING.md` that describes rules and procedure. 
It will be updated soon.

## Services and Community by Cosmostation

- [Official Website](https://www.cosmostation.io)
- [Mintscan Explorer](https://www.mintscan.io)
- [Web Wallet](https://wallet.cosmostation.io)
- [Android Wallet](https://bit.ly/2BWex9D)
- [iOS Wallet](https://apple.co/2IAM3Xm)
- [Telegram - International](https://t.me/cosmostation)
- [Kakao - Koreans](https://open.kakao.com/o/g6KKSe5)