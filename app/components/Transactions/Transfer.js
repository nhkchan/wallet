import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Button } from "semantic-ui-react";
import styles from "./Transfer.css";
import Header from "../Header";
import AmountDisplay from "./AmountDisplay";
import buttonStyles from "../Button.css";
import { ContactIcon, BackArrowIcon } from "../Icons";
import { PopupModal } from "../Content/PopupModal";
import { TextArea } from "semantic-ui-react";

import { trxToDrops } from "../../utils/currency";

import TronHttpClient from "tron-http-client";
import BackButton from "../Content/BackButton";

const client = new TronHttpClient();
const tools = require("tron-http-tools");

import { toHexString } from "../../utils/hex";

class Transfer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: 0,
      recipientAddress: "",

      showConfirmModal: false,
      modalConfirmText: "",

      target: "",
      tokenStr: "",

      sendProperties: {},

      showFailureModal: false,
      modalFailureText: "Transaction Failed",

      showSuccessModal: false,
      modalSuccessText: "Success",
      accountAddress: "",
      outputText: "",

      userAddress: this.props.match.params.account
    };
  }

  async onClickSend() {
    try {
      let transaction = await tools.transactions.createUnsignedTransferTransaction(
        {
          sender: this.state.userAddress,
          recipient: this.state.recipientAddress,
          amount: parseInt(trxToDrops(this.state.amount))
        },
        await client.getLastBlock()
      );

      let hex = toHexString(transaction.serializeBinary());

      this.setState({
        outputText: hex
      });
    } catch (e) {
      this.setState({
        outputText: "Something went wrong. Make sure to input valid values."
      });
    }
  }

  onSetAmount(amount) {
    this.setState({
      ...this.state,
      amount: amount
    });
  }

  onSetUserAddress(event) {
    this.setState({
      userAddress: event.target.value
    });
  }

  onSetRecipientAddress(event) {
    this.setState({
      recipientAddress: event.target.value
    });
  }

  modalFailureClose() {
    this.setState({
      ...this.state,
      showFailureModal: false
    });
  }

  render() {
    let token = "TRX";
    this.state.tokenStr = token;
    return (
      <div className={styles.container}>
        <BackButton />
        <Header className={styles.white} headerName="Create Raw Transfer" />
        <div onClick={this.props.history.goBack} className={styles.backArrow}>
          <BackArrowIcon />
        </div>
        <div className={styles.subContainer}>
          <p>
            This tool creates raw transfer transactions which you can sign on
            other devices and then broadcast to the network.
          </p>
          <div className={styles.addressContainer}>
            <ContactIcon />
            <input
              onChange={this.onSetUserAddress.bind(this)}
              placeholder="Sender Address"
              className={styles.address}
              value={this.props.match.params.account}
            />
          </div>
          <div className={styles.addressContainer}>
            <ContactIcon />
            <input
              onChange={this.onSetRecipientAddress.bind(this)}
              placeholder="Recipient Address"
              className={styles.address}
              value={this.props.recipientAddress}
            />
          </div>
          <AmountDisplay
            token={token}
            onSetAmount={this.onSetAmount.bind(this)}
          />
          <Button
            onClick={this.onClickSend.bind(this)}
            className={`${buttonStyles.button} ${buttonStyles.black}`}
          >
            Create
          </Button>

          <TextArea
            placeholder="Output..."
            className={styles.textArea}
            value={this.state.outputText}
          />

          <PopupModal
            failure
            modalVis={this.state.showFailureModal}
            modalText={this.state.modalFailureText}
            closeModalFunction={this.modalFailureClose.bind(this)}
            modalConfirm={this.modalFailureClose.bind(this)}
          />
        </div>
      </div>
    );
  }
}

export default withRouter(
  connect(state => ({ wallet: state.wallet }))(Transfer)
);
