import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Button } from "semantic-ui-react";
import styles from "./Broadcast.css";
import Header from "../Header";
import buttonStyles from "../Button.css";
import { BackArrowIcon } from "../Icons";
import { TextArea } from "semantic-ui-react";
import TronHttpClient from "tron-http-client";
import BackButton from "../Content/BackButton";

const client = new TronHttpClient();
const tools = require("tron-http-tools");

function toHexString(byteArray) {
  return Array.from(byteArray, function(byte) {
    return ("0" + (byte & 0xff).toString(16)).slice(-2);
  }).join("");
}
function isHex(h) {
  let a = parseInt(h, 16);
  return a.toString(16) === h;
}

function hexToBase64(hexstring) {
  return btoa(
    hexstring
      .match(/\w{2}/g)
      .map(function(a) {
        return String.fromCharCode(parseInt(a, 16));
      })
      .join("")
  );
}

class Broadcast extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showFailureModal: false,
      modalFailureText: "",

      inputValueString: "",
      responseString: ""
    };
  }

  async onClickSend() {
    try {
      let b64 = hexToBase64(this.state.inputValueString.trim());
      let response = await client.broadcastBase64Transaction(b64);

      if (response && response.result == true) {
        this.setState({
          responseString: "Successfully broadcasted Transaction"
        });
      } else {
        this.setState({
          responseString:
            "Failed to broadcast Transaction. Response: " +
            JSON.stringify(response)
        });
      }
    } catch (e) {
      this.setState({
        responseString:
          "Something went wrong. Make sure to input a signed Transaction, base64 or hex encoded. " +
          e.toString()
      });
    }
  }

  onSetTransaction(event) {
    this.setState({
      inputValueString: event.target.value
    });
  }

  render() {
    let token = "TRX";
    this.state.tokenStr = token;
    return (
      <div className={styles.container}>
        <BackButton />
        <Header
          className={styles.white}
          headerName="Broadcast Signed Transaction"
        />
        <div onClick={this.props.history.goBack} className={styles.backArrow}>
          <BackArrowIcon />
        </div>
        <div className={styles.subContainer}>
          <p>Use this tool to broadcast signed transactions.</p>
          <TextArea
            onChange={this.onSetTransaction.bind(this)}
            placeholder="Paste signed transaction..."
            class={styles.textArea}
          />
          <TextArea
            placeholder="Response..."
            class={styles.textArea}
            value={this.state.responseString}
          />
          <Button
            onClick={this.onClickSend.bind(this)}
            className={`${buttonStyles.button} ${buttonStyles.black}`}
          >
            Broadcast
          </Button>
        </div>
      </div>
    );
  }
}

export default withRouter(
  connect(state => ({ wallet: state.wallet }))(Broadcast)
);
