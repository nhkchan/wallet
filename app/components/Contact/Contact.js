import React, { Component } from "react";
import styles from "./Contact.css";

class Contact extends Component {
  render() {
    return (
      <div className={styles.vote}>
        <div className={styles.voteLabel}>{`${this.props.voteLabel} -`}</div>
        <div className={styles.container}>
          <div className={styles.title}>{this.props.voteTitle}</div>
          <div className={styles.subContainer}>
            <span className={styles.subTitle}>Last Block : </span>
            <span className={styles.subVal}>
              {this.props.lastBlock.toLocaleString()}
            </span>
          </div>
          <div className={styles.subContainer}>
            <span className={styles.subTitle}>Blocks Produced : </span>
            <span className={styles.subVal}>
              {this.props.blocksProduced.toLocaleString()}
            </span>
          </div>
          <div className={styles.subContainer}>
            <span className={styles.subTitle}>Blocks Missed : </span>
            <span className={styles.subVal}>
              {this.props.blocksMissed.toLocaleString()}
            </span>
          </div>
          <div className={styles.subContainer}>
            <span className={styles.subTitle}> Total Vote :</span>
            <span className={styles.subVal}>
              {this.props.totalVote.toLocaleString()} TRX
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default Contact;
