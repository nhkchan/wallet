import React, { Component } from "react";
import styles from "./Vote.css";

import { FormattedDate, FormattedTime } from "react-intl";

import { VoteIcon } from "../../../Icons";

export default class Vote extends Component {
  formattedDate() {
    const date = new Date(this.props.date);
    return date.toLocaleDateString("en-us", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  render() {
    /*
    let accountId = this.props.match.params.account;
    let transactions = this.props.wallet.persistent.accounts[accountId]
      .transactions;
    */
    let amount = 0;
    if (this.props.amount) amount = this.props.amount.toLocaleString();
    return (
      <div className={styles.vote}>
        <div className={styles.voteType}>
          <VoteIcon className={styles.icon} />
          <div>Vote for {this.props.url}</div>
        </div>
        <div className={styles.voteInfo}>
          <div className={styles.voteAmount}> {amount} TP</div>
          <div className={styles.voteDate}>
            <FormattedDate value={this.props.date} />{" "}
            <FormattedTime value={this.props.date} />
          </div>
        </div>
      </div>
    );
  }
}
