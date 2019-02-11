import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { TextArea, Button } from "semantic-ui-react";
import { connect } from "react-redux";
import styles from "./OfflineSignature.css";

import {
  MoreIcon,
  CalendarIcon,
  SendIcon,
  QRScanIcon,
  DownloadIcon
} from "../../Icons";
import buttonStyles from "../../Button.css";
import BackButton from "../../Content/BackButton";
import Secondary from "../../Content/Secondary";
import Header from "../../Header";

const tools = require("tron-http-tools");
const TronHttpClient = require("tron-http-client");
const client = new TronHttpClient();

function toHexString(byteArray) {
  return Array.from(byteArray, function(byte) {
    return ("0" + (byte & 0xff).toString(16)).slice(-2);
  }).join("");
}

class OfflineSignature extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hex: "",
      hexAfter: ""
    };
  }
  setHex = (e, { value }) => this.setState({ hex: value });

  submitHex = async () => {
    let account = this.props.wallet.persistent.accounts[
      this.props.match.params.account
    ];
    let transaction = tools.transactions.transactionFromBase64(
      new Buffer(this.state.hex, "hex").toString("base64")
    );
    let signed = tools.transactions.signTransaction(
      account.privateKey,
      transaction
    );
    this.setState({
      hexAfter: toHexString(signed.serializeBinary())
    });
  };

  render() {
    return (
      <Secondary>
        <div className={styles.container}>
          <BackButton />
          <Header headerName="Offline Signature" />
          <div className={styles.subContainer}>
            <div className={styles.header}>Sign Transactions:</div>
            <div className={styles["sub-header"]}>
              You can broadcast the ouput using{" "}
              <span className={styles.selectable}>
                https://tronscan.org/#/tools/transaction-viewer
              </span>
            </div>
            <TextArea
              placeholder="Paste unsigned transaction here..."
              className={styles.textArea}
              onChange={this.setHex}
            />
            <TextArea
              placeholder="Output..."
              className={styles.textArea}
              value={this.state.hexAfter}
            />
            <Button
              onClick={this.submitHex.bind(this)}
              className={`${buttonStyles.button} ${buttonStyles.black}`}
            >
              Sign Transaction
            </Button>
          </div>
        </div>
      </Secondary>
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
  )(OfflineSignature)
);
