import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import styles from "./TxList.css";
import Transaction from "./Transaction";
import { updateTransferTransactions } from "../../../actions/wallet";
import { participationToTokens } from "../../../utils/currency";

const TronHttpClient = require("tron-http-client");

const client = new TronHttpClient();

class TxList extends Component {
  getTrxTransactions(transactions) {
    let filteredTransactions = [];
    for (let i = 0; i < transactions.length; i++) {
      let transaction = transactions[i];
      if (transaction.contract_desc === "TransferContract") {
        filteredTransactions.push(transaction);
      }
    }
    return filteredTransactions;
  }
  getTokenTransactions(transactions) {
    let filteredTransactions = [];
    for (let i = 0; i < transactions.length; i++) {
      let transaction = transactions[i];
      if (
        !(
          transaction.contract_desc === "ParticipateAssetIssueContract" ||
          transaction.contract_desc === "TransferAssetContract"
        )
      ) {
        continue;
      }
      if (
        transaction.name === this.props.match.params.token ||
        transaction.asset_name === this.props.match.params.token
      ) {
        filteredTransactions.push(transaction);
      }
    }
    return filteredTransactions;
  }

  getHighlightedTokenTransactions(transactions) {
    if (this.props.match.params.token === "TRX") {
      return this.getTrxTransactions(transactions);
    } else {
      return this.getTokenTransactions(transactions);
    }
  }

  /*adds amount_token to the transactions if they're a participation contract
  * removes invalid participation contracts */
  calculateParticipateAssetIssueContractPrices(filteredTransactions) {
    for (let i = filteredTransactions.length - 1; i >= 0; i--) {
      if (
        filteredTransactions[i].contract_desc ===
        "ParticipateAssetIssueContract"
      ) {
        if (filteredTransactions[i].asset_issue_contract) {
          filteredTransactions[i].amount_tokens = participationToTokens(
            filteredTransactions[i].amount,
            filteredTransactions[i].asset_issue_contract.num,
            filteredTransactions[i].asset_issue_contract.trx_num
          );
        } else {
          filteredTransactions.splice(i, 1);
        }
      }
    }
    return filteredTransactions;
  }

  render() {
    let accountId = this.props.match.params.account;
    let transactions = this.props.wallet.persistent.accounts[accountId]
      .transactions;
    let filteredTransactions = [];

    let highlightedToken = this.props.match.params.token;
    if (highlightedToken) {
      filteredTransactions = this.getHighlightedTokenTransactions(transactions);
    } else {
      filteredTransactions = transactions;
    }
    filteredTransactions = this.calculateParticipateAssetIssueContractPrices(
      filteredTransactions
    );

    return (
      <div className={styles.txList}>
        {filteredTransactions.map((tx, i) => (
          <Transaction
            key={i}
            tx={tx}
            txID={tx._id}
            amount={tx.amount_tokens ? tx.amount_tokens : tx.amount}
            isToken={tx.asset !== "TRX"}
            date={tx.date}
            type={tx.type}
            asset={tx.asset}
            contract_desc={tx.contract_desc}
            is_owner={tx.owner_address === accountId}
          />
        ))}
      </div>
    );
  }
}

export default withRouter(
  connect(
    state => ({ wallet: state.wallet }),
    dispatch => ({
      updateTransactions: address => {
        updateTransferTransactions(address, dispatch);
      }
    })
  )(TxList)
);
