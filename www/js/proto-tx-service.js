const { google, cosmos, rizonworld } = require('./proto.js');

function createSendMessage (fromAddress, toAddress, amount) {
  const sendMessage = new cosmos.bank.v1beta1.MsgSend({
    from_address: fromAddress,
    to_address: toAddress,
    amount: [{ amount: String(amount), denom: 'uatolo' }],
  });

  return new google.protobuf.Any({
		type_url: '/cosmos.bank.v1beta1.MsgSend',
		value: cosmos.bank.v1beta1.MsgSend.encode(sendMessage).finish()
	});
}

function createTxBody (messages, memo = '') {
  return new cosmos.tx.v1beta1.TxBody({ messages, memo });
}

function createTxRawBytes (txBody, authInfo, signature) {
  const txBodyBytes = cosmos.tx.v1beta1.TxBody.encode(txBody).finish();
  const authInfoBytes = cosmos.tx.v1beta1.AuthInfo.encode(authInfo).finish();
  const txRaw = new cosmos.tx.v1beta1.TxRaw({
    body_bytes: txBodyBytes,
    auth_info_bytes: authInfoBytes,
    signatures: [signature.signature],
  });
  return cosmos.tx.v1beta1.TxRaw.encode(txRaw).finish();
}

function createTxBroadcast (txRawBytes) {
  return { tx_bytes: txRawBytes, mode: cosmos.tx.v1beta1.BroadcastMode.BROADCAST_MODE_SYNC };
}

module.exports = {
  createSendMessage,
  createTxBody,
  createTxRawBytes,
  createTxBroadcast,
};
