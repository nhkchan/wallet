import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedDate, FormattedNumber, FormattedTime } from "react-intl";
import styles from "./TokenProgressBar.css";

class TokenProgressBar extends Component {
  render() {
    return (
      <div className={`${styles.container} ${this.props.className}`}>
        <div className={styles.top}>
          <div className={styles.green}>
            {((this.props.tokenCurrent / this.props.tokenMax) * 100).toFixed(5)}%
          </div>
          <div className={styles.tokenContainer}>
            <span className={styles.green}>
              <FormattedNumber value={this.props.tokenCurrent} />
            </span>{" "}
            / <FormattedNumber value={this.props.tokenMax} />
          </div>
        </div>
        <progress
          className={styles.progress}
          value={this.props.tokenCurrent}
          max={this.props.tokenMax}
        />
        {Date.now() < this.props.startTime ? (
          <div className={`${styles.bottom} ${styles.green}`}>
            <div className={styles.dateLabel}>Starts on :</div>
            <div className={styles.dateMain}>
              <FormattedDate
                value={this.props.startTime}
                year="numeric"
                month="2-digit"
                day="2-digit"
              />{" "}
              <FormattedTime
                value={this.props.startTime}
                hour="2-digit"
                minute="2-digit"
                second="2-digit"
              />
            </div>
          </div>
        ) : (
          ""
        )}
        <div className={`${styles.bottom} ${styles.green}`}>
          <div className={styles.dateLabel}>Ends on :</div>
          <div className={styles.dateMain}>
            <FormattedDate
              value={this.props.endTime}
              year="numeric"
              month="2-digit"
              day="2-digit"
            />{" "}
            <FormattedTime
              value={this.props.endTime}
              hour="2-digit"
              minute="2-digit"
              second="2-digit"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => ({ tokens: state.tokens.tokens }))(
  TokenProgressBar
);
