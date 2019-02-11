import React, { Component } from "react";
import styles from "./AmountDisplay.css";
import AmountInput from "./AmountInput";

export default class AmountDisplay extends Component {
  renderUsd(amount) {
    if (amount <= 0) return "";

    return (
      <div className={styles.amountSub}>
        {parseFloat(amount).toLocaleString()} USD
      </div>
    );
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.amountTag}>Amount :</div>
        <div className={styles.amountInput}>
          <div className={styles.amountMain}>
            <AmountInput onSetAmount={this.props.onSetAmount} />
            <span>{this.props.token}</span>
          </div>
          {this.renderUsd(this.props.usd)}
        </div>
      </div>
    );
  }
}
