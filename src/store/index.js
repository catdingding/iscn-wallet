import { createStore } from "vuex";
import { ElMessage } from "element-plus";
import { ElNotification } from "element-plus";

import mainnet from "./mainnet.js";
import { ISCNQueryClient, ISCNSigningClient, formatISCNPayload } from "@likecoin/iscn-js";
import BigNumber from "bignumber.js";

function sum_fees(fees) {
  var gas = BigNumber("0");
  var denoms_amount = {};
  for (const fee of fees) {
    gas = gas.plus(fee.gas);
    for (const row of fee.amount) {
      denoms_amount[row.denom] = (denoms_amount[row.denom] || BigNumber("0")).plus(row.amount);
    }
  }
  var amount = [];
  for (const denom in denoms_amount) {
    amount.push({ denom, amount: denoms_amount[denom].toFixed(0, 0) });
  }
  return { amount, gas: gas.toFixed(0, 0) };
}

export default createStore({
  state() {
    return {
      signer: null,
      wallet: null,
    };
  },
  mutations: {
    set_signer(state, data) {
      state.signer = data;
    },
    set_wallet(state, data) {
      state.wallet = data;
    },
  },
  actions: {
    async connect_wallet({ commit, state }) {
      if (!window.keplr) {
        ElMessage({
          message: "Keplr wallet not found.",
          type: "warning",
        });
      }
      window.keplr.experimentalSuggestChain(mainnet);
      window.keplr.enable("likecoin-mainnet-2");
      const signer = window.getOfflineSigner("likecoin-mainnet-2");

      const [wallet] = await signer.getAccounts();
      commit("set_signer", signer);
      commit("set_wallet", wallet);
    },
    async transfer_iscn({ commit, state, dispatch }, { receiver_address, iscn_id }) {
      if (!(await dispatch("check_wallet"))) {
        return;
      }

      const client = new ISCNSigningClient();
      await client.connectWithSigner("https://mainnet-node.like.co/rpc/", state.signer);

      try {
        var res = await client.changeISCNOwnership(state.wallet.address, receiver_address, iscn_id);
      } catch (e) {
        ElNotification({
          duration: 10000,
          message: e.message,
          type: "error",
        });
        return;
      }
      const { transactionHash: tx_hash } = res;
      ElNotification({
        duration: 10000,
        message: `${iscn_id} transfered! tx hash:${tx_hash}`,
        type: "success",
      });
    },
    async batch_add_iscn({ state, dispatch }, { payloads, mode }) {
      if (!(await dispatch("check_wallet"))) {
        return;
      }
      ElMessage({
        message: "Processing...please wait.",
      });

      const client = new ISCNSigningClient();
      await client.connectWithSigner("https://mainnet-node.like.co/rpc/", state.signer);

      var messages = [];
      var fees = [];
      for (var payload of payloads) {
        // eslint-disable-next-line no-redeclare
        var { iscn_id, ...payload } = payload;
        const record = formatISCNPayload(payload);
        var value = { from: state.wallet.address, record };
        var typeUrl;
        if (mode === "update") {
          value["iscnId"] = iscn_id;
          typeUrl = "/likechain.iscn.MsgUpdateIscnRecord";
        } else if (mode === "create") {
          typeUrl = "/likechain.iscn.MsgCreateIscnRecord";
        }
        const message = { typeUrl, value };
        messages.push(message);

        const { fee } = await client.estimateISCNTxGas(payload);
        fees.push(fee);
      }

      var fee = sum_fees(fees);

      try {
        var res = await client.signingClient.signAndBroadcast(state.wallet.address, messages, fee);
      } catch (e) {
        ElNotification({
          duration: 10000,
          message: e.message,
          type: "error",
        });
        return;
      }
      const { transactionHash: tx_hash } = res;
      ElNotification({
        duration: 10000,
        dangerouslyUseHTMLString: true,
        message: `ISCN created! tx hash:${tx_hash}`,
        type: "success",
      });
    },
    async batch_send_like({ state, dispatch }, { payloads }) {
      if (!(await dispatch("check_wallet"))) {
        return;
      }
      ElMessage({
        message: "Processing...please wait.",
      });

      const client = new ISCNSigningClient();
      await client.connectWithSigner("https://mainnet-node.like.co/rpc/", state.signer);

      var messages = [];
      for (var payload of payloads) {
        const message = {
          typeUrl: "/cosmos.bank.v1beta1.MsgSend",
          value: {
            fromAddress: state.wallet.address,
            toAddress: payload.address,
            amount: [{ amount: BigNumber(payload.amount).multipliedBy("1000000000").toFixed(0, 0), denom: "nanolike" }],
          },
        };
        messages.push(message);
      }

      var fee = {
        amount: [
          {
            amount: BigNumber("80000").multipliedBy(messages.length).toFixed(0, 0),
            denom: "nanolike",
          },
        ],
        gas: BigNumber("80000").multipliedBy(messages.length).toFixed(0, 0),
      };

      try {
        var res = await client.signingClient.signAndBroadcast(state.wallet.address, messages, fee);
      } catch (e) {
        ElNotification({
          duration: 10000,
          message: e.message,
          type: "error",
        });
        return;
      }
      const { transactionHash: tx_hash } = res;
      ElNotification({
        duration: 10000,
        dangerouslyUseHTMLString: true,
        message: `LIKE transfered! tx hash:${tx_hash}`,
        type: "success",
      });
    },
    async check_wallet({ commit, state }) {
      if (!state.signer) {
        ElMessage({
          message: "Please connect Keplr wallet.",
          type: "warning",
        });
      }
      return !!state.signer;
    },
  },
});
