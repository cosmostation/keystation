const { google, cosmos, rizonworld } = require('./proto.js');
const PostIbcSigner = require('./post-ibc-signer');
const protoTxService = require('./proto-tx-service');

console.log(protoTxService);

const signer = new PostIbcSigner('mnemonic', 'chainid', 'band', '1802/adf')

