const { google, cosmos } = require('./proto.js');
const PostIbcSigner = require('./post-ibc-signer');
const protoTxService = require('./proto-tx-service');

testHandler = function () {
    console.log("test11111");
}

function findAllByKey(obj, keyToFind) {
    return Object.entries(obj)
        .reduce((acc, [key, value]) => (key === keyToFind)
                ? acc.concat(value)
                : (typeof value === 'object')
                    ? acc.concat(findAllByKey(value, keyToFind))
                    : acc
            , [])
}

signTxByProto = async function (mnemonic, hdPath, chainId, stdSignMsg) {
    console.log("band sign test 333");

    if (stdSignMsg.json.msgs.length != 1) {
        try {
            console.log("TxMsgsLengthIsNotOne");
            window.opener.postMessage("", "*");
        } catch(event) {
            console.log(event);
        }
        window.close();
    }

    var prefix = "";
    if (chainId.indexOf("cosmos") != -1) {
        prefix = "cosmos";
    } else if (chainId.indexOf("iris") != -1) {
        prefix = "iaa";
    } else if (chainId.indexOf("kava") != -1) {
        prefix = "kava";
    } else if (chainId.indexOf("band") != -1 || chainId.indexOf("laozi") != -1) {
        prefix = "band";
    } else if (chainId.indexOf("iov") != -1 || chainId.indexOf("stargatenet") != -1) {
        prefix = "star";
    } else if (chainId.indexOf("secret") != -1) {
        prefix = "secret";
    } else if (chainId.indexOf("akash") != -1) {
        prefix = "akash";
    } else if (chainId.indexOf("shentu") != -1) {
        prefix = "certik";
    } else if (chainId.indexOf("stargate-final") != -1) {
        prefix = "cosmos";
    } else if (chainId.indexOf("bifrost") != -1) {
        prefix = "iaa";
    } else if (chainId.indexOf("edgenet") != -1) {
        prefix = "akash";
    } else if (chainId.indexOf("core-1") != -1) {
        prefix = "persistence";
    } else if (chainId.indexOf("sentinel") != -1) {
        prefix = "sent";
    } else if (chainId.indexOf("fetchhub") != -1) {
        prefix = "fetch";
    } else if (chainId.indexOf("sifchain") != -1) {
        prefix = "sif";
    } else if (chainId.indexOf("crypto-org-chain-mainnet") != -1) {
        prefix = "cro";
    } else if (chainId.indexOf("kichain") != -1) {
        prefix = "ki";
    } else if (chainId.indexOf("panacea") != -1) {
        prefix = "panacea";
    } else if (chainId.indexOf("titan") != -1) {
        prefix = "rizon";
    } else if (chainId.indexOf("juno") != -1) {
        prefix = "juno";
    } else if (chainId.indexOf("bitcanna") != -1) {
        prefix = "bcna";
    } else if (chainId.indexOf("regen") != -1) {
        prefix = "regen";
    }
    } else if (chainId.indexOf("moonbys") != -1) {
        prefix = "pan";
    }
    const signer = new PostIbcSigner(mnemonic, chainId, prefix, hdPath)

    // tx 생성에 필요한 값 추출
    let messages;
    console.log("messages: ", messages);
    if ((stdSignMsg.json.msgs[0].type).indexOf("MsgSend") != -1) {
        // MsgSend
        const fromAddress = findAllByKey(stdSignMsg.json, "from_address")[0];
        const toAddress = findAllByKey(stdSignMsg.json, "to_address")[0];
        let amountArr = findAllByKey(stdSignMsg.json.msgs, "amount")[0];
        const amount = amountArr.amount;
        const denom = amountArr.denom;

        console.log("fromAddress: ", fromAddress);
        console.log("toAddress: ", toAddress);
        console.log("amount: ", amount);
        console.log("denom: ", denom);

        const sendMessage = protoTxService.createSendMessage(fromAddress, toAddress, amount, denom);
        messages = [sendMessage];
    } else if ((stdSignMsg.json.msgs[0].type).indexOf("MsgDelegate") != -1) {
        // MsgDelegate
        const delegatorAddress = findAllByKey(stdSignMsg.json, "delegator_address")[0];
        const validatorAddress = findAllByKey(stdSignMsg.json, "validator_address")[0];
        let amountArr = findAllByKey(stdSignMsg.json.msgs, "amount")[0];
        const amount = amountArr.amount;
        const denom = amountArr.denom;

        console.log("delegatorAddress: ", delegatorAddress);
        console.log("validatorAddress: ", validatorAddress);
        console.log("amount: ", amount);
        console.log("denom: ", denom);

        const sendMessage = protoTxService.createDelegateMessage(delegatorAddress, validatorAddress, amount, denom);
        messages = [sendMessage];
    } else if ((stdSignMsg.json.msgs[0].type).indexOf("MsgUndelegate") != -1) {
        // MsgUndelegate
        const delegatorAddress = findAllByKey(stdSignMsg.json, "delegator_address")[0];
        const validatorAddress = findAllByKey(stdSignMsg.json, "validator_address")[0];
        let amountArr = findAllByKey(stdSignMsg.json.msgs, "amount")[0];
        const amount = amountArr.amount;
        const denom = amountArr.denom;

        console.log("delegatorAddress: ", delegatorAddress);
        console.log("validatorAddress: ", validatorAddress);
        console.log("amount: ", amount);
        console.log("denom: ", denom);

        const sendMessage = protoTxService.createUndelegateMessage(delegatorAddress, validatorAddress, amount, denom);
        messages = [sendMessage];
    } else if ((stdSignMsg.json.msgs[0].type).indexOf("MsgBeginRedelegate") != -1) {
        // MsgBeginRedelegate
        const delegatorAddress = findAllByKey(stdSignMsg.json, "delegator_address")[0];
        const validatorSrcAddress = findAllByKey(stdSignMsg.json, "validator_src_address")[0];
        const validatorDstAddress = findAllByKey(stdSignMsg.json, "validator_dst_address")[0];
        let amountArr = findAllByKey(stdSignMsg.json.msgs, "amount")[0];
        const amount = amountArr.amount;
        const denom = amountArr.denom;

        console.log("delegatorAddress: ", delegatorAddress);
        console.log("validatorSrcAddress: ", validatorSrcAddress);
        console.log("validatorDstAddress: ", validatorDstAddress);
        console.log("amount: ", amount);
        console.log("denom: ", denom);

        const sendMessage = protoTxService.createRedelegateMessage(delegatorAddress, validatorSrcAddress, validatorDstAddress, amount, denom);
        messages = [sendMessage];
    } else if ((stdSignMsg.json.msgs[0].type).indexOf("MsgWithdrawDelegationReward") != -1) {
        // MsgWithdrawDelegatorReward
        const delegatorAddress = findAllByKey(stdSignMsg.json, "delegator_address")[0];
        const validatorAddress = findAllByKey(stdSignMsg.json, "validator_address")[0];

        console.log("delegatorAddress: ", delegatorAddress);
        console.log("validatorAddress: ", validatorAddress);

        const sendMessage = protoTxService.createWithdrawMessage(delegatorAddress, validatorAddress);
        messages = [sendMessage];
    } else if ((stdSignMsg.json.msgs[0].type).indexOf("MsgModifyWithdrawAddress") != -1) {
        // MsgSetWithdrawAddress
        const delegatorAddress = findAllByKey(stdSignMsg.json, "delegator_address")[0];
        const withdrawAddress = findAllByKey(stdSignMsg.json, "withdraw_address")[0];

        console.log("delegatorAddress: ", delegatorAddress);
        console.log("withdrawAddress: ", withdrawAddress);

        const sendMessage = protoTxService.createSetWithdrawAddressMessage(delegatorAddress, withdrawAddress);
        messages = [sendMessage];
    } else if ((stdSignMsg.json.msgs[0].type).indexOf("MsgWithdrawValidatorCommission") != -1) {
        // MsgWithdrawValidatorCommission
        const validatorAddress = findAllByKey(stdSignMsg.json, "validator_address")[0];

        console.log("validatorAddress: ", validatorAddress);

        const sendMessage = protoTxService.createWithdrawValidatorCommissionMessage(validatorAddress);
        messages = [sendMessage];
    }

    // 공통
    let memo = stdSignMsg.json.memo;
    let feeAmount = stdSignMsg.json.fee.amount[0].amount;
    let feeDenom = stdSignMsg.json.fee.amount[0].denom;
    let gasLimit = stdSignMsg.json.fee.gas;
    let account_number = stdSignMsg.json.account_number;
    let sequence = stdSignMsg.json.sequence;

    console.log("memo: ", memo);
    console.log("feeAmount: ", feeAmount);
    console.log("feeDenom: ", feeDenom);
    console.log("gasLimit: ", gasLimit);
    console.log("account_number: ", account_number);
    console.log("sequence: ", sequence);

    console.log("messages: ", messages);
    if (messages == undefined) {
        try {
            console.log("txMessagesIsUndefined");
            window.opener.postMessage("", "*");
        } catch(event) {
            console.log(event);
        }
        window.close();
    }

    const txBody = protoTxService.createTxBody(messages, memo);
    const authInfo = await signer.getAuthInfo(sequence, feeAmount, feeDenom, gasLimit);
    const signDoc = signer.getSignDoc(txBody, authInfo, account_number);
    const signature = signer.getDirectSignature(signDoc);
    const txRawBytes = protoTxService.createTxRawBytes(txBody, authInfo, signature);
    const txBroadcast = protoTxService.createTxBroadcast(txRawBytes);

    try {
        // const result = await protoTxService.broadcastTx(txBroadcast);
        const result = await protoTxService.broadcastProtoTx(txRawBytes);
        window.opener.postMessage(result, "*");
        console.log("result: " + JSON.stringify(result));


    } catch (e) {
        console.log(e);
    }
    window.close();
}
