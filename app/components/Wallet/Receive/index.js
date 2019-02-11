import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import * as QRCode from "qrcode";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import styles from "./Receive.css";
import buttonStyles from "../../Button.css";

import MainModal from "../../Content/DarkMainModal";
import { ShareIcon, CopyIcon, SendIcon } from "../../Icons";

class Receive extends Component {
  constructor() {
    super();

    this.state = {
      qrcode: null
    };
  }
  copyAddress() {
    var wallet = document.querySelector("#receiveCode");
    wallet.focus();
    wallet.select();
    document.execCommand("copy");
  }

  render() {
    let { qrcode } = this.state;
    let accountId = this.props.match.params.account;
    let account = this.props.wallet.persistent.accounts[accountId];
    if (account) {
      QRCode.toDataURL(`${account.publicKey}`, (err, url) => {
        this.setState({
          qrcode: url
        });
      });
    }
    return (
      <MainModal header="Receive Code">
        <img src={qrcode} />
        <div className={styles.buttonContainer}>
          <Button
            className={`${buttonStyles.iconButton} ${buttonStyles.gradient}`}
          >
            <ShareIcon />
          </Button>
          <Button
            onClick={this.copyAddress}
            className={`${buttonStyles.iconButton} ${buttonStyles.gradient}`}
          >
            <CopyIcon />
          </Button>
          <Button
            className={`${buttonStyles.iconButton} ${buttonStyles.gradient}`}
          >
            <SendIcon />
          </Button>
        </div>
        <div className={styles.addressContainer}>
          <div className={styles.addressLabel}>Your Wallet Address :</div>
          <input
            onClick={this.copyAddress}
            id="receiveCode"
            className={styles.textBox}
            value={account.publicKey}
            readOnly
          />
          <Button
            onClick={this.copyAddress}
            className={`${styles.copyBtn} ${buttonStyles.button} ${
              buttonStyles.gradient
            }`}
          >
            <CopyIcon /> Copy Address
          </Button>
        </div>
      </MainModal>
    );
  }
}

export default withRouter(
  connect(
    state => ({ wallet: state.wallet }),
    dispatch => ({})
  )(Receive)
);
