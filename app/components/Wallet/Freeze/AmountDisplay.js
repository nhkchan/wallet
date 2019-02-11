import React, { Component } from "react";
import styles from "./AmountDisplay.css";

import AmountInput from "./AmountInput";

export default class AmountDisplay extends Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.amountTag}>Amount :</div>
        <div className={styles.amountInput}>
          <div className={styles.amountMain}>
            <AmountInput onSetAmount={this.props.onSetAmount} />
            <span>TRX</span>
          </div>
        </div>
      </div>
    );
  }
}
