import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { FormattedDate, FormattedNumber, FormattedTime } from "react-intl";
import { connect } from "react-redux";
import styles from "./ViewTransaction.css";
import DarkMainModal from "../../../Content/DarkMainModal";
import { TopRightArrow, WalletIcon } from "../../../Icons";
import { updateTransactions } from "../../../../actions/wallet";

import { dropsToTrx, dropsToFiat } from "../../../../utils/currency";

class ViewTransaction extends Component {
  state = {};

  renderHeaderLabel() {
    let { tx } = this.state;
    if (
      tx.contract_desc === "TransferContract" ||
      tx.contract_desc === "TransferAssetContract"
    ) {
      if (tx.type === 0) {
        return "Received";
      }
      return "Sent";
    }
    if (tx.contract_desc === "ParticipateAssetIssueContract") {
      return "Token Purchased";
    }
    if (
      tx.contract_desc === "FreezeBalanceContract" ||
      tx.contract_desc === "UnfreezeBalanceContract"
    ) {
      return "Frozen";
    }
    if (tx.contract_desc === "AssetIssueContract") {
      return "Token Created";
    }
    if (tx.contract_desc === "VoteWitnessContract") {
      return "Vote";
    }
    if (tx.contract_desc === "WitnessCreateContract") {
      return "Super Representative Application";
    }
    if (tx.contract_desc === "WithdrawBalanceContract") {
      return "Super Representative Rewards";
    }
    if (tx.contract_desc === "AccountUpdateContract") {
      return "Account Name Update";
    }
    return "Not Implemented yet";
  }

  renderHeaderAmount() {
    let { tx } = this.state;
    if (tx.frozen_balance) {
      return (
        <div className={styles.headerAmount}>
          <FormattedNumber value={dropsToTrx(tx.frozen_balance)} />
          {" " + tx.asset}
        </div>
      );
    }
    if (tx.contract_desc === "VoteWitnessContract") {
      return (
        <div className={styles.headerAmount}>
          <FormattedNumber value={tx.votes[0].vote_count} /> TP
        </div>
      );
    }
    if (tx.contract_desc === "ParticipateAssetIssueContract") {
      let contract = tx.asset_issue_contract;
      return (
        <div className={styles.headerAmount}>
          <FormattedNumber value={tx.amount_tokens} /> {tx.asset}
        </div>
      );
    }
    if (tx.contract_desc === "AssetIssueContract") {
      return (
        <div className={styles.headerAmount}>
          <FormattedNumber value={tx.total_supply} /> {tx.name}
        </div>
      );
    }
    if (tx.contract_desc === "WitnessCreateContract") {
      return (
        <div className={styles.headerAmount}>
          <FormattedNumber value={9999} /> TRX
        </div>
      );
    }
    if (tx.contract_desc === "AccountUpdateContract") {
      return (
        <div className={styles.headerAmount}>
          <FormattedNumber value={0} /> TRX
        </div>
      );
    }
    if (tx.amount) {
      if (tx.asset === "TRX") {
        return (
          <div className={styles.headerAmount}>
            <FormattedNumber value={tx.amount / 1000000} />
            {" " + tx.asset}
          </div>
        );
      }
      return (
        <div className={styles.headerAmount}>
          <FormattedNumber value={tx.amount} />
          {" " + tx.asset}
        </div>
      );
    }
    return (
      <div className={styles.headerAmount}>
        {tx.asset === "TRX" ? (
          <FormattedNumber value={tx.amount / 1000000} />
        ) : (
          <FormattedNumber value={tx.amount} />
        )}
        {" " + tx.asset}
      </div>
    );
  }

  render() {
    let accountId = this.props.match.params.account;
    let txID = this.props.match.params.txid;
    let account = this.props.wallet.persistent.accounts[accountId];
    if (!account) {
      this.props.history.push("/wallets/walletDetails/" + accountId);
      return <div />;
    }
    let transactions = account.transactions;

    let tx = transactions.find(tx => tx._id === txID);
    let usdValue = dropsToFiat(this.props.currency, tx.amount || 0);
    if (tx.asset !== "TRX") {
      let token = this.props.tokens.find(token => token.name === tx.asset);
      usdValue = dropsToFiat(this.props.currency, tx.amount * token.trx_num);
    }

    if (tx.contract_desc === "ParticipateAssetIssueContract") {
      let token = this.props.tokens.find(token => token.name === tx.asset);
      usdValue = dropsToFiat(
        this.props.currency,
        parseInt(tx.amount_tokens) * (token.trx_num / token.num)
      );
    }

    this.state.tx = tx;
    /*
    goToBlockchain = () =>
      require("electron").shell.openExternal("https://tronscan.org/#/transaction/");
*/
    return (
      <DarkMainModal className={styles.container}>
        <div className={`${styles.subContainer} ${this.props.className}`}>
          <div className={styles.headerBG}>
            <TopRightArrow
              className={
                tx.type === 0
                  ? styles.headerIcon
                  : `${styles.headerIcon} ${styles.rotate}`
              }
            />
            <div className={styles.headerType}>
              {this.renderHeaderLabel()} :
            </div>
            {this.renderHeaderAmount()}
            <div className={styles.headerCurrency}>{usdValue} USD</div>
          </div>
          <div className={styles.tokenInfoContainer}>
            <div className={styles.tokenHeader}>Fee :</div>
            <div className={styles.feeContainer}>
              <div className={styles.feeAmount}>
                <FormattedNumber value={tx.txsize} /> Bandwidth
              </div>
            </div>
            <div className={styles.divider} />
            <div className={styles.tokenHeader}>
              {tx.type === 0 ? "Sent to" : "Received From"} :
            </div>
            <div className={styles.tokenHeaderText}>{tx.owner_address}</div>
            <div className={styles.divider} />
            <div className={styles.tokenHeader}>
              {tx.type === 0 ? "Sent From" : "Received in"} :
            </div>
            <div className={styles.walletContainer}>
              <WalletIcon className={styles.walletIcon} />
              <div>{this.props.wallet.persistent.accounts[accountId].name}</div>
            </div>
            <div className={styles.divider} />
            <div className={styles.tokenHeader}>Date :</div>
            <div className={styles.tokenHeaderText}>
              <FormattedDate value={tx.date} />{" "}
              <FormattedTime value={tx.date} />
            </div>
            {/*
              <div>
                <button>
                  View On Blockchain
                </button>
              </div>
            */}
          </div>
        </div>
      </DarkMainModal>
    );
  }
}

export default withRouter(
  connect(
    state => ({
      wallet: state.wallet,
      currency: state.currency,
      tokens: state.tokens.tokens
    }),
    dispatch => ({
      updateTransactions: (accountId, transactions) => {
        dispatch(updateTransactions(accountId, transactions));
      }
    })
  )(ViewTransaction)
);
