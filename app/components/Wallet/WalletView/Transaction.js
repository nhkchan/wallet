import React, { Component } from "react";
import { NavLink, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { FormattedNumber, FormattedDate, FormattedTime } from "react-intl";
import styles from "./Transaction.css";
import {
  TopRightArrow,
  TokensIcon,
  SnowIcon,
  PencilIcon,
  VoteIcon
} from "../../Icons";
import { updateTransactions } from "../../../actions/wallet";
import { dropsToTrx } from "../../../utils/currency";

/*
  ACCOUNTCREATECONTRACT: 0,
  TRANSFERCONTRACT: 1,
  TRANSFERASSETCONTRACT: 2,
  VOTEASSETCONTRACT: 3,
  VOTEWITNESSCONTRACT: 4,
  WITNESSCREATECONTRACT: 5,
  ASSETISSUECONTRACT: 6,
  DEPLOYCONTRACT: 7,
  WITNESSUPDATECONTRACT: 8,
  PARTICIPATEASSETISSUECONTRACT: 9,
  ACCOUNTUPDATECONTRACT: 10,
  FREEZEBALANCECONTRACT: 11,
  UNFREEZEBALANCECONTRACT: 12,
  WITHDRAWBALANCECONTRACT: 13,
  UNFREEZEASSETCONTRACT: 14,
  UPDATEASSETCONTRACT: 15,
  CUSTOMCONTRACT: 20
*/

const enums = {
  Received: 0,
  Sent: 1,
  "Token Created": 2,

  0: "Received",
  1: "Sent",
  2: "Token Created"
};

class Transaction extends Component {
  formattedDate() {
    const date = new Date(this.props.date);
    return date.toLocaleDateString("en-us", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  /*
  <div className={styles.txType}>
    { this.chooseIcon() }
    <div>{enums[this.props.type]}</div>
  </div>
  */

  chooseIcon() {
    if (
      this.props.contract_desc === "TransferContract" ||
      this.props.contract_desc === "TransferAssetContract"
    ) {
      if (this.props.type === enums.Received) {
        return (
          <div className={styles.txType}>
            <TopRightArrow className={styles.iconReceived} />
            <div>Received</div>
          </div>
        );
      }
      return (
        <div className={styles.txType}>
          <TopRightArrow className={styles.iconSent} />
          <div>Sent</div>
        </div>
      );
    }
    if (this.props.contract_desc === "ParticipateAssetIssueContract") {
      return (
        <div className={styles.txType}>
          <TokensIcon className={styles.iconToken} />
          <div>Token Purchased</div>
        </div>
      );
    }
    if (
      this.props.contract_desc === "FreezeBalanceContract" ||
      this.props.contract_desc === "UnfreezeBalanceContract"
    ) {
      return (
        <div className={styles.txType}>
          <SnowIcon className={styles.iconFreeze} />
          <div>Frozen</div>
        </div>
      );
    }
    if (this.props.contract_desc === "AssetIssueContract") {
      return (
        <div className={styles.txType}>
          <PencilIcon className={styles.iconToken} />
          <div>Token Created</div>
        </div>
      );
    }
    if (this.props.contract_desc === "VoteWitnessContract") {
      return (
        <div className={styles.txType}>
          <VoteIcon className={styles.iconToken} />
          <div>
            Vote - {this.props.tx.witness ? this.props.tx.witness.url : ""}
          </div>
        </div>
      );
    }
    if (this.props.contract_desc === "WitnessCreateContract") {
      return (
        <div className={styles.txType}>
          <TopRightArrow className={styles.iconSent} />
          <div>SR Application</div>
        </div>
      );
    }
    if (this.props.contract_desc === "WithdrawBalanceContract") {
      return (
        <div className={styles.txType}>
          <TopRightArrow className={styles.iconReceived} />
          <div>Super Representative Reward</div>
        </div>
      );
    }
    if (this.props.contract_desc === "AccountUpdateContract") {
      return (
        <div className={styles.txType}>
          <div>Update Account Name</div>
        </div>
      );
    }
  }

  txAmount() {
    switch (this.props.contract_desc) {
      case "TransferContract": {
        let amount = dropsToTrx(this.props.amount);
        if (this.props.is_owner) {
          //sent
          return (
            <div className={`${styles.txAmount} ${styles.red}`}>
              - <FormattedNumber value={amount} /> {this.props.asset}
            </div>
          );
        } else {
          return (
            <div className={`${styles.txAmount} ${styles.green}`}>
              + <FormattedNumber value={amount} /> {this.props.asset}
            </div>
          );
        }
      }
      case "TransferAssetContract": {
        if (this.props.is_owner) {
          //sent
          return (
            <div className={`${styles.txAmount} ${styles.red}`}>
              - <FormattedNumber value={this.props.amount} /> {this.props.asset}
            </div>
          );
        } else {
          return (
            <div className={`${styles.txAmount} ${styles.green}`}>
              + <FormattedNumber value={this.props.amount} /> {this.props.asset}
            </div>
          );
        }
      }
      case "ParticipateAssetIssueContract": {
        let contract = this.props.tx.asset_issue_contract;
        return (
          <div>
            <div className={`${styles.txAmount} ${styles.green}`}>
              +{" "}
              <FormattedNumber
                value={dropsToTrx(
                  parseInt(this.props.tx.amount_tokens) *
                    (contract.trx_num / contract.num)
                )}
              />{" "}
              TRX
            </div>
            <div className={`${styles.txAmount} ${styles.red}`}>
              - <FormattedNumber value={this.props.tx.amount_tokens} />{" "}
              {this.props.asset}
            </div>
          </div>
        );
      }
      case "FreezeBalanceContract": {
        return (
          <div>
            <div className={`${styles.txAmount} ${styles.red}`}>
              -{" "}
              <FormattedNumber
                value={dropsToTrx(this.props.tx.frozen_balance)}
              />{" "}
              TRX
            </div>
          </div>
        );
      }
      case "UnfreezeBalanceContract": {
        return (
          <div>
            <div className={`${styles.txAmount} ${styles.red}`}>
              +{" "}
              <FormattedNumber
                value={dropsToTrx(this.props.tx.frozen_balance)}
              />{" "}
              TRX
            </div>
          </div>
        );
      }
      case "AssetIssueContract": {
        return (
          <div>
            <div className={`${styles.txAmount} ${styles.red}`}>
              - <FormattedNumber value={1024} /> TRX
            </div>
            <div className={`${styles.txAmount} ${styles.green}`}>
              + <FormattedNumber value={this.props.tx.total_supply} />{" "}
              {this.props.tx.name}
            </div>
          </div>
        );
      }
      case "VoteWitnessContract": {
        return (
          <div>
            <div className={`${styles.txAmount} ${styles.green}`}>
              <FormattedNumber value={this.props.tx.votes[0].vote_count} /> TP
            </div>
          </div>
        );
      }
      case "WitnessCreateContract": {
        return (
          <div>
            <div className={`${styles.txAmount} ${styles.red}`}>
              - <FormattedNumber value={9999} /> TRX
            </div>
          </div>
        );
      }
      case "AccountUpdateContract": {
        return (
          <div>
            <div className={`${styles.txAmount} ${styles.green}`}>FREE</div>
          </div>
        );
      }
      case "WithdrawBalanceContract": {
        let amount = dropsToTrx(this.props.amount);
        return (
          <div className={`${styles.txAmount} ${styles.green}`}>
            + <FormattedNumber value={amount} />
          </div>
        );
      }
      default:
        return <div>type {this.props.contract_desc} not implemented</div>;
    }
  }

  render() {
    let accountId = this.props.match.params.account;
    let transactions = this.props.wallet.persistent.accounts[accountId]
      .transactions;

    return (
      <NavLink
        to={
          "/wallets/transactionDetails/" +
          accountId +
          "/" +
          this.props.txID +
          "/"
        }
        className={styles.tx}
      >
        {this.chooseIcon()}
        <div className={styles.txInfo}>
          {this.txAmount()}
          <div className={styles.txDate}>
            {" "}
            <FormattedDate value={this.props.date} />{" "}
            <FormattedTime value={this.props.date} />
          </div>
        </div>
      </NavLink>
    );
  }
}

export default withRouter(
  connect(
    state => ({ wallet: state.wallet }),
    dispatch => ({
      updateTransactions: (accountId, transactions) => {
        dispatch(updateTransactions(accountId, transactions));
      }
    })
  )(Transaction)
);
