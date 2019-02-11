import React, { Component } from "react";
import styles from "./Info.css";
import Header from "../../Header";
import { TronIcon } from "../../Icons";

export default class Info extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: {
        name: "SuperCoolToken",
        url: "http://google.com/",
        totalSupply: 1000,
        issuer: "27bPtyJH26gKgLzhGCGuzmvmNJWGVgPkCAN",
        startDate: Date.now()
      }
    };
  }

  render() {
    let { token } = this.state;
    return (
      <div className={styles.container}>
        <Header className={styles.white} headerName="Token Information" />
        <div className={`${styles.subContainer} ${this.props.className}`}>
          <div className={styles.headerBG} />
          <TronIcon className={styles.logo} />
          <div className={styles.tokenName}>{token.name}</div>
          <div className={styles.tokenInfoContainer}>
            <div className={styles.tokenHeader}>Website :</div>
            <div className={styles.tokenHeaderText}>{token.url}</div>
            <div className={styles.divider} />
            <div className={styles.tokenHeader}>Total Supply :</div>
            <div className={styles.tokenHeaderText}>
              {token.totalSupply.toLocaleString()}
            </div>
            <div className={styles.divider} />
            <div className={styles.tokenHeader}>Issuer :</div>
            <div className={styles.tokenHeaderText}>{token.issuer}</div>
            <div className={styles.divider} />
            <div className={styles.tokenHeader}>Start Date :</div>
            <div className={styles.tokenHeaderText}>
              {new Date(token.startDate).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
