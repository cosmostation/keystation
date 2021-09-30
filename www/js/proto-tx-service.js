const { google, cosmos } = require('./proto.js');
const axios = require('axios');

function createSendMessage(fromAddress, toAddress, amount, denom) {
  const rawMsg = new cosmos.bank.v1beta1.MsgSend({
    from_address: fromAddress,
    to_address: toAddress,
    amount: [{ amount: String(amount), denom: denom }],
  });

  return new google.protobuf.Any({
      type_url: '/cosmos.bank.v1beta1.MsgSend',
      value: cosmos.bank.v1beta1.MsgSend.encode(rawMsg).finish()
  });
}

function createDelegateMessage(delegatorAddress, validatorAddress, amount, denom) {
  const rawMsg = new cosmos.staking.v1beta1.MsgDelegate({
    delegator_address: delegatorAddress,
    validator_address: validatorAddress,
    amount: new cosmos.base.v1beta1.Coin({ denom: denom, amount: String(amount) }),
  });

  return new google.protobuf.Any({
    type_url: '/cosmos.staking.v1beta1.MsgDelegate',
    value: cosmos.staking.v1beta1.MsgDelegate.encode(rawMsg).finish()
  });
}

function createUndelegateMessage(delegatorAddress, validatorAddress, amount, denom) {
  const rawMsg = new cosmos.staking.v1beta1.MsgUndelegate({
    delegator_address: delegatorAddress,
    validator_address: validatorAddress,
    amount: new cosmos.base.v1beta1.Coin({ denom: denom, amount: String(amount) }),
  });

  return new google.protobuf.Any({
    type_url: '/cosmos.staking.v1beta1.MsgUndelegate',
    value: cosmos.staking.v1beta1.MsgUndelegate.encode(rawMsg).finish()
  });
}

function createRedelegateMessage(delegatorAddress, validatorSrcAddress, validatorDstAddress, amount, denom) {
  const rawMsg = new cosmos.staking.v1beta1.MsgBeginRedelegate({
    delegator_address: delegatorAddress,
    validator_src_address: validatorSrcAddress,
    validator_dst_address: validatorDstAddress,
    amount: new cosmos.base.v1beta1.Coin({ denom: denom, amount: String(amount) }),
  });

  return new google.protobuf.Any({
    type_url: '/cosmos.staking.v1beta1.MsgBeginRedelegate',
    value: cosmos.staking.v1beta1.MsgBeginRedelegate.encode(rawMsg).finish()
  });
}

function createWithdrawMessage(delegatorAddress, validatorAddress) {
  const rawMsg = new cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward({
    delegator_address: delegatorAddress,
    validator_address: validatorAddress,
  });

  return new google.protobuf.Any({
    type_url: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
    value: cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward.encode(rawMsg).finish()
  });
}

function createSetWithdrawAddressMessage(delegatorAddress, withdrawAddress) {
  const rawMsg = new cosmos.distribution.v1beta1.MsgSetWithdrawAddress({
    delegator_address: delegatorAddress,
    withdraw_address: withdrawAddress,
  });

  return new google.protobuf.Any({
    type_url: '/cosmos.distribution.v1beta1.MsgSetWithdrawAddress',
    value: cosmos.distribution.v1beta1.MsgSetWithdrawAddress.encode(rawMsg).finish()
  });
}

function createWithdrawValidatorCommissionMessage(validatorAddress) {
  const rawMsg = new cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission({
    validator_address: validatorAddress,
  });

  return new google.protobuf.Any({
    type_url: '/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission',
    value: cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission.encode(rawMsg).finish()
  });
}

// SimulateRequest
function createSimulateRequestMessage(tx, txBytes) {
  const rawMsg = new cosmos.tx.v1beta1.SimulateRequest({
    tx: tx,
    tx_bytes: txBytes,
  });

  return new google.protobuf.Any({
    type_url: '/cosmos.tx.v1beta1.SimulateRequest',
    value: cosmos.tx.v1beta1.SimulateRequest.encode(rawMsg).finish()
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

function broadcastProtoTx (signedTxBytes, broadCastMode = 'BROADCAST_MODE_SYNC') {
  const txBytesBase64 = Buffer.from(signedTxBytes, 'binary').toString('base64');
  const data = { tx_bytes: txBytesBase64, mode: broadCastMode };
  const url = window.lcd + "/cosmos/tx/v1beta1/txs";
  return axios.post(url, data).then((response) => _.get(response, 'data'));
}

module.exports = {
  createSendMessage,
  createDelegateMessage,
  createUndelegateMessage,
  createRedelegateMessage,
  createWithdrawMessage,
  createSetWithdrawAddressMessage,
  createWithdrawValidatorCommissionMessage,
  createSimulateRequestMessage,
  createTxBody,
  createTxRawBytes,
  createTxBroadcast,
  broadcastProtoTx,
};
