const bip39 = require('bip39');
const bip32 = require('bip32');
const bech32 = require('bech32');
const _ = require('lodash');
const { google, cosmos } = require('./proto.js');
const crypto = require('crypto');
const secp256k1 = require('secp256k1');

function sortedObject (obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(sortedObject);
  }
  const sortedKeys = Object.keys(obj).sort();
  const result = {};
  sortedKeys.forEach((key) => {
    result[key] = sortedObject(obj[key]);
  });
  return result;
}

function sortedJsonStringify (obj) {
  return JSON.stringify(sortedObject(obj));
}

async function createKeys (mnemonic, hdPath) {
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const node = bip32.fromSeed(seed);
  const child = node.derivePath(hdPath);
  return [child.privateKey, child.publicKey];
}

async function generateAddress (mnemonic, hdPath, prefix, checkSum = true) {
  if (typeof mnemonic !== 'string') {
      throw new Error('mnemonic expects a string')
  }
  if (checkSum) {
    if (!bip39.validateMnemonic(mnemonic)) throw new Error("mnemonic phrases have invalid checksums");
  }
  const seed = bip39.mnemonicToSeed(mnemonic);
  const node = bip32.fromSeed(seed)
  const child = node.derivePath(hdPath)
  const words = bech32.toWords(child.identifier);
  return bech32.encode(prefix, words);
}

class PostIbcSigner {
  constructor (mnemonic, chainId, prefix, hdPath) {
    this.chainId = chainId;
    this.prefix = prefix;
    this.hdPath = hdPath;

    this.initialized = createKeys(mnemonic, hdPath)
      .then(([privateKey, publicKey]) => {
        this.privateKey = privateKey;
        this.publicKey = publicKey;
        return generateAddress(mnemonic, hdPath, prefix);
      }).then((address) => {
        this.address = address;
      })
  }

  async getPublicKey () {
    await this.initialized;
    return this.publicKey;
  }

  async getAddress () {
    await this.initialized;
    return this.address;
  }

  getSignDoc (txBody, authInfo, accountNumber) {
    const bodyBytes = cosmos.tx.v1beta1.TxBody.encode(txBody).finish();
    const authInfoBytes = cosmos.tx.v1beta1.AuthInfo.encode(authInfo).finish();
    const signDoc = new cosmos.tx.v1beta1.SignDoc({
      chain_id: this.chainId,
      body_bytes: bodyBytes,
      auth_info_bytes: authInfoBytes,
      account_number: Number(accountNumber)
    });
    return signDoc;
  }

  async getAuthInfo (sequence, feeAmount, feeDenom, gasLimit, mode = 'direct') {
    let _mode = cosmos.tx.signing.v1beta1.SignMode.SIGN_MODE_DIRECT;
    if (mode === 'amino') {
      _mode = cosmos.tx.signing.v1beta1.SignMode.SIGN_MODE_LEGACY_AMINO_JSON;
    }

    const publicKey = await this.getPublicKey();
    const publicKeyProto = new cosmos.crypto.secp256k1.PubKey({ key: publicKey });

    const signerInfo = new cosmos.tx.v1beta1.SignerInfo({
      public_key: new google.protobuf.Any({
        type_url: '/cosmos.crypto.secp256k1.PubKey',
        value: cosmos.crypto.secp256k1.PubKey.encode(publicKeyProto).finish(),
      }),
      mode_info: { single: { mode: _mode } },
      sequence: Number(sequence),
    });

    const fee = new cosmos.tx.v1beta1.Fee({
      amount: [{ denom: feeDenom, amount: String(feeAmount) }],
      gas_limit: Number(gasLimit),
    });

    return new cosmos.tx.v1beta1.AuthInfo({ signer_infos: [signerInfo], fee });
  }

  getDirectSignature (signDoc) {
    const signDocBytes = cosmos.tx.v1beta1.SignDoc.encode(signDoc).finish();
    const messageHash = crypto.createHash('sha256').update(signDocBytes).digest();
    const signature = secp256k1. sign(messageHash, this.privateKey);
    return signature;
  }

  getAminoSignature (signDoc) {
    const messageHash = crypto.createHash('sha256').update(sortedJsonStringify(signDoc)).digest();
    const signature = secp256k1.sign(messageHash, this.privateKey);
    return signature;
  }
}

module.exports = PostIbcSigner;
