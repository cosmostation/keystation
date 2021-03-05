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
<img width="200" alt="keystation1" src="https://user-images.githubusercontent.com/34641838/65948271-e3298880-e474-11e9-9453-b49f6dd678b9.png">
<img width="200" alt="keystation2" src="https://user-images.githubusercontent.com/34641838/65948277-e886d300-e474-11e9-8042-a2027247605a.png">
<img width="200" alt="keystation3" src="https://user-images.githubusercontent.com/34641838/65948289-ec1a5a00-e474-11e9-943d-2828b01c8bed.png">
</div>

## Import

#### NPM

```bash
npm install @cosmostation/keystation-es6
```

#### Yarn

```bash
yarn add @cosmostation/keystation-es6
```

#### ES6 module

```js
import Keystation from "@cosmostation/keystation-es6";
```

#### Browser
```
<script src="https://keystation.cosmostation.io/lib/keystation.js"></script>
```

## Usage with React

```js
const Wallet = (props) => {
	const [myKeystation, setMyKeystation] = React.useState(new Keystation);

	const connectKeystation = React.useCallback(() => {

            let myKeystation = new Keystation();
            
            setMyKeystation(myKeystation);
            
            myKeystation.client = "YOUR_WEB_URL";
            myKeystation.lcd = "https://lcd-cosmos-free.cosmostation.io";
            myKeystation.path = "44/118/0/0/0";

	    let prefix = "cosmos";
	    let popup = keystation1.openWindow("signin", prefix);
	    let popupTick = setInterval(function() {
                if (popup.closed) {
                    clearInterval(popupTick);
                    console.log("window closed!");
                }
	    }, 500);
	}, [])

	window.addEventListener("message", function(e) {
	    if (e.origin != "https://keystation.cosmostation.io") return;
	    console.log(e.data);
	    // e.data.account : User's keychain account. Remember this account!
	} , false);
}
```

## Usage with browser

```js
// initializing configuration
var keystation = new Keystation();
keystation.client = "YOUR_WEB_URL";
keystation.lcd = "https://lcd-cosmos-free.cosmostation.io";
keystation.path = "44/118/0/0/0";

// The account parameter is required for users having multiple keychain accounts.
var keystationAccount = "";

// open popup window for sign-in
var prefix = "cosmos";  // Cosmos prefix: cosmos, Iris prefix: iaa
var popup = keystation.openWindow("signin", prefix);

// generate a transaction
// You can get account_number and sequence from https://lcd-cosmos-free.cosmostation.io/auth/accounts/[YOUR_COSMOS_ADDRESS]
var txJson = {"account_number":"18012","chain_id":"cosmoshub-3","fee":{"amount":[{"amount":"5000","denom":"uatom"}],"gas":"200000"},"memo":"","msgs":[{"type":"cosmos-sdk/MsgSend","value":{"amount":[{"amount":"10000","denom":"uatom"}],"from_address":"cosmos1z67fshyr48pa9a6htdz4qd0zullfk6y0fgvxv7","to_address":"cosmos10nv3yj0jdxf02vxyc0tavf97fdvppdth6wmcn3"}}],"sequence":"24"};

var txJsonStr = JSON.stringify(txJson);
var popup = keystation.openWindow("transaction", txJsonStr, keystationAccount);

// add an EventListener
window.addEventListener("message", function(e) {
    if (e.origin != "https://keystation.cosmostation.io") return;
    console.log(e.data);
    // e.data.account : User's keychain account. Remember this account!
    keystationAccount = e.data.account;
} , false);
```
If the user is log in as Alice, he or she should use Alice account to sign transaction.

## Supporting Transaction Message Types

You can find currently supporting meesage types in [our CosmosJS library](https://github.com/cosmostation/cosmosjs/tree/master/docs/msg_types)

## How to Create txJson

```js
// CosmosJS supports to create tx for Cosmos
cosmos.getAccounts(address).then(data => {
	let stdSignMsg = cosmos.newStdMsg({
        msgs: [
            {
                type: "cosmos-sdk/MsgSend",
                value: {
                    amount: [
                        {
                            amount: String(100000),
                            denom: "uatom"
                        }
                    ],
                    from_address: address,
                    to_address: "cosmos18vhdczjut44gpsy804crfhnd5nq003nz0nf20v"
                }
            }
        ],
        chain_id: chainId,
        fee: { amount: [ { amount: String(5000), denom: "uatom" } ], gas: String(200000) },
        memo: "",
        account_number: String(data.account.account_number),
        sequence: String(data.account.sequence)
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