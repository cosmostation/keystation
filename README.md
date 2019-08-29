<p align="center">
  <a href="https://www.cosmostation.io" target="_blank" rel="noopener noreferrer"><img width="100" src="https://user-images.githubusercontent.com/20435620/55696624-d7df2e00-59f8-11e9-9126-edf9a40b11a8.png" alt="Cosmostation logo"></a>
</p>
<h1 align="center">
    Keystation 
</h1>

*:star: Developed / Developing by [Cosmostation](https://www.cosmostation.io/)*

키스테이션은 별도의 설치가 필요없는 탈중앙화된 키 인증 서비스입니다. 사용자의 키 정보를 사용자 브라우저의 Keychain에 안전하게 보관하면서 Cosmos 기반의 블록체인의 트랜잭션에 편리하게 서명할 수 있습니다. 웹 로그인, DEX 거래소, dApp 등 다양한 Cosmos SDK 서비스를 편리하고 안전하게 사용할 수 있습니다.

Example session:<br>
<img width="200" alt="keystation1" src="https://user-images.githubusercontent.com/34641838/63916092-a2ec7a00-ca72-11e9-89e9-44c3bce8001d.png">
<img width="200" alt="keystation2" src="https://user-images.githubusercontent.com/34641838/63916099-a7189780-ca72-11e9-8574-b6d0dca4551f.png">
<img width="200" alt="keystation3" src="https://user-images.githubusercontent.com/34641838/63916106-a97af180-ca72-11e9-90da-ebf52526d75b.png">

## Import
```
<script src="https://keystation.cosmostation.io/lib/keystation.js"></script>
```

## Usage
* Class initialization
```js
var keystation = new Keystation();
keystation.client = "YOUR_WEB_URL";
keystation.lcd = "https://lcd-do-not-abuse.cosmostation.io";
keystation.path = "44/118/0/0/0";
```

* Sign in
```js
var prefix = "cosmos";
var popup = keystation.openWindow("signin", prefix);
```

* Transaction
```js
var txJson = {"account_number":"18012","chain_id":"cosmoshub-2","fee":{"amount":[{"amount":"5000","denom":"uatom"}],"gas":"200000"},"memo":"","msgs":[{"type":"cosmos-sdk/MsgSend","value":{"amount":[{"amount":"10000","denom":"uatom"}],"from_address":"cosmos1z67fshyr48pa9a6htdz4qd0zullfk6y0fgvxv7","to_address":"cosmos10nv3yj0jdxf02vxyc0tavf97fdvppdth6wmcn3"}}],"sequence":"24"};

var txJsonStr = JSON.stringify(txJson);
var popup = keystation.openWindow("transaction", txJsonStr);
```

* EventListener
```js
window.addEventListener("message", function(e) {
    console.log(e.data);
} , false);
```

## Supporting Message Types
Go to [CosmosJS](https://github.com/cosmostation/cosmosjs#supporting-message-types-updating)

## How to make to txJson
* CosmosJS supports to create tx for Cosmos.
```js
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
Keystation이 안전한 방식인지 점검해봅시다. 어떻게 Keystation은 사용자의 키를 안전하게 보관할까요?

#### Keychain
Chrome, Safai에서 사이트의 아이디와 비밀번호를 기억하고 보관하는 암호 관리 시스템입니다. Keystation은 별도의 Chrome, Safari의 암호 관리 시스템(키체인)에 사용자의 니모닉을 보관합니다. 이것은 사용자만 접근할 수 있으며 제3자가 접근하기 불가능합니다. 이뿐만 아니라 사용자의 니모닉을 AES 알고리즘으로 암호화하여 보안을 한층 더 강화하였습니다. 사용자의 PIN으로만 암호화된 니모닉에 접근할 수 있습니다.
* [How secure is Chrome storing a password?](https://security.stackexchange.com/questions/170481/how-secure-is-chrome-storing-a-password)
* [Manage saved passwords](https://support.google.com/chrome/answer/95606?co=GENIE.Platform%3DDesktop&hl=en)

## Contribution

- Contributions, suggestions, improvements, and feature requests are always welcome

When opening a PR with a minor fix, make sure to add #trivial to the title/description of said PR.

## Cosmostation's Services and Community

- [Official Website](https://www.cosmostation.io)
- [Mintscan Explorer](https://www.mintscan.io)
- [Web Wallet](https://wallet.cosmostation.io)
- [Android Wallet](https://bit.ly/2BWex9D)
- [iOS Wallet](https://apple.co/2IAM3Xm)
- [Telegram - International](https://t.me/cosmostation)
- [Kakao - Koreans](https://open.kakao.com/o/g6KKSe5)