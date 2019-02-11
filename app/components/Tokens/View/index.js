import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Dropdown, Button } from "semantic-ui-react";
import { FormattedNumber } from "react-intl";
import styles from "./TokenView.css";
import buttonStyles from "../../Button.css";
import Secondary from "../../Content/Secondary";
import Header from "../../Header";
import AmountSlider from "./AmountSlider";
import { ArrowRightIcon } from "../../Icons";
import { loadTokens } from "../../../actions/tokens";
import { PopupModal } from "../../Content/PopupModal";
import { dropsToFiat, dropsToTrx } from "../../../utils/currency";

import { toHexString } from "../../../utils/hex";
import Transport from "@ledgerhq/hw-transport-node-hid";
import AppTron from "../../../utils/ledger/Tron";
const { hexToBase64 } = require("../../../utils/ledger/utils");
const tools = require("tron-http-tools");

const TronHttpClient = require("tron-http-client");

class TokenView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      wallets: [],
      current: 0,
      selectedWallet: {
        text: "Select a Wallet",
        value: "",
        trx: 0
      },
      sendProperties: {},
      usdAmount: 0
    };
  }

  componentDidMount() {
    this.props.loadTokens();
  }

  getDropFromCurrent() {
    return parseInt(this.state.amount) * this.state.ratio;
  }

  async submitTokenPurchase() {
    let { amount, ratio } = this.state;
    let drops = this.getDropFromCurrent();
    let tokens = {
      recipient: this.state.token.owner_address,
      assetName: this.state.token.name,
      amount: (amount / ratio) * 1000000
    };
    let { token } = this.state;
    this.setState({
      ...this.state,
      sendProperties: tokens,
      showConfirmModal: true,
      modalConfirmText: `Are you sure you want to buy ${amount} ${
        token.abbr ? token.abbr : token.name
      } ${this.props.match.params.token} for ${amount / ratio} TRX?`
    });
  }

  selectWallet = (e, { value }) => {
    let accounts = this.props.wallet.persistent.accounts;
    let wallet = Object.keys(accounts).filter(
      wallet => accounts[wallet].publicKey === value
    );
    this.setState({ selectedWallet: accounts[wallet[0]] });
  };

  onSliderChange(amount, ratio) {
    this.setState({
      amount: amount,
      ratio: ratio,
      usdAmount: dropsToFiat(this.props.currency, parseInt(amount) * 1000000)
    });
  }

  async ledgerSign(path, rawTxHex, address) {
    while (this.state.showLedgerModal){
      try {
        console.log(path);
        const transport = await Transport.create();
        const tron = new AppTron(transport);
        const result = await tron.getAddress(path, false);
        if (result.address !== address)
          return {error: true, message: "Address does not match!"}

        const signature = await tron.signTransaction(path, rawTxHex);

        return { error: false, message: new Uint8Array(signature) }
      } catch (error) {
        console.log(error);

        if( (this.state.showLedgerModal) && (error.message.indexOf("denied by the user") > -1)) {
          return {error: true, message: "Canceled by user on ledger!"}
        }
        //return {error: true, message: "error"}
      }
    }
  }


  async purchaseWithLedger(){
    let client = new TronHttpClient();
    let response = null;
    let hex = null;
    let transaction = null;
    try {
      // Get Transaction hash
      transaction = await tools.transactions.createUnsignedParticipateAssetIssueTransaction(
        {
          sender: this.state.selectedWallet.publicKey,
          recipient: this.state.sendProperties.recipient,
          amount: this.state.sendProperties.amount,
          assetName: this.state.sendProperties.assetName
        },
          await client.getLastBlock()
        );

      // Convert to HEX string
      hex = toHexString(transaction.getRawData().serializeBinary());
      // Sign on Ledger
      let result = await this.ledgerSign(this.state.selectedWallet.ledgerPath, hex, this.state.selectedWallet.publicKey)
      // Transmit
      if (typeof result === 'undefined') return;
      if (!result.error){
        if (!this.state.showLedgerModal) return;
        // Add signature
        transaction.addSignature(result.message);
        hex = toHexString(transaction.serializeBinary());
        let b64 = hexToBase64(hex);
        response = await client.broadcastBase64Transaction(b64);
      }else{
        this.setState({
          ...this.state,
          sendProperties: {},
          showConfirmModal: false,
          showFailureModal: true,
          showLedgerModal: false,
          modalFailureText: result.message,
        });
        return;
      }

    } catch (e) {
      console.log(e);
    }
    this.updateTransferResponse(response);
  }

  async modalConfirm() {
    console.log(this.state);
    if (this.state.selectedWallet.ledger){
      this.setState({
        ...this.state,
        showConfirmModal: false,
        showLedgerModal: true,
      });
      this.purchaseWithLedger();
    }else {
      let client = new TronHttpClient();
      let response = await client.participateToken(
        this.state.selectedWallet.privateKey,
        this.state.sendProperties
      );
      updateTransferResponse(response);
    }
  }

  updateTransferResponse(response){
    if (response === null) {
      this.setState({
        ...this.state,
        sendProperties: {},
        showConfirmModal: false,
        showFailureModal: true,
        showLedgerModal: false,
        modalFailureText: "Buy failed"
      });
    } else if (response.result != true) {
      this.setState({
        ...this.state,
        sendProperties: {},
        showConfirmModal: false,
        showFailureModal: true,
        showLedgerModal: false,
        modalFailureText: "Buy failed: " + response.message
      });
    } else {
      this.setState({
        ...this.state,
        sendProperties: {},
        showConfirmModal: false,
        showSuccessModal: true,
        showLedgerModal: false,
        modalSuccessText: "Buy Successful!"
      });
    }
  }

  modalDecline() {
    this.setState({
      ...this.state,
      sendProperties: {},
      showConfirmModal: false
    });
  }

  modalFailureClose() {
    this.setState({
      ...this.state,
      showFailureModal: false
    });
  }

  modalLedgerCancel() {
    this.setState({
      ...this.state,
      showFailureModal: true,
      modalFailureText: "Buy failed",
      showLedgerModal: false
    });
  }

  modalSuccessClose() {
    this.props.history.push(
      "/wallets/walletDetails/" + this.state.accountAddress
    );
    this.setState({
      ...this.state,
      showSuccessModal: false
    });
  }

  modalClose() {
    this.state.showConfirmModal = false;
  }
  render() {
    let { selectedWallet } = this.state;

    let accountId = this.props.match.params.account;
    let accounts = this.props.wallet.persistent.accounts;

    let currentToken = this.props.match.params.token;
    let token = this.props.tokens.tokens.find(t => t._id === currentToken);
    this.state.token = token;

    if (!token) {
      return <div>not loaded</div>;
    }

    let wallets = [];
    Object.keys(accounts).forEach((wallet, i) => {
      let formattedObj = {
        text: accounts[wallet].name,
        value: accounts[wallet].publicKey
      };
      wallets.push(formattedObj);
    });

    return (
      <Secondary className={styles.container}>
        <div className={styles.headerContainer}>
          <Header headerName="Buy Token" />
          <div className={styles.headerTP}>
            <FormattedNumber value={dropsToTrx(selectedWallet.trx)} />
            <span>TRX</span>
          </div>
          <div className={styles.headerText}>
            Use TRX to purchase tokens below.
          </div>
        </div>
        <div className={styles.subContainer}>
          <div className={styles.votingFor}>
            TOKEN NAME : <span>{token.name}</span>
          </div>
          <div className={styles.dropdown}>
            <ArrowRightIcon />
            <Dropdown
              fluid
              selection
              onChange={this.selectWallet}
              placeholder="Choose Wallet"
              options={wallets}
            />
          </div>
          <AmountSlider
            usd={this.state.usdAmount}
            onSliderChange={this.onSliderChange.bind(this)}
            tokenLabel={token.abbr ? token.abbr : token.name}
            assetNum={token.num}
            trxNum={token.trx_num}
            totalTRX={selectedWallet.trx}
          />
          <Button
            onClick={this.submitTokenPurchase.bind(this)}
            className={`${styles.btn} ${buttonStyles.button} ${
              buttonStyles.black
            }`}
          >
            Purchase
          </Button>
        </div>

        <PopupModal
          confirmation
          modalVis={this.state.showConfirmModal}
          modalText={this.state.modalConfirmText}
          closeModalFunction={this.modalClose.bind(this)}
          modalConfirm={this.modalConfirm.bind(this)}
          modalDecline={this.modalDecline.bind(this)}
        />

        <PopupModal
          failure
          modalVis={this.state.showFailureModal}
          modalText={this.state.modalFailureText}
          closeModalFunction={this.modalFailureClose.bind(this)}
          modalConfirm={this.modalFailureClose.bind(this)}
        />

        <PopupModal
          success
          modalVis={this.state.showSuccessModal}
          modalText={this.state.modalSuccessText}
          closeModalFunction={this.modalSuccessClose.bind(this)}
          modalConfirm={this.modalSuccessClose.bind(this)}
        />

        <PopupModal
            waitForLedger
            modalVis={this.state.showLedgerModal}
            modalText="Please open Tron App and confirm transaction on ledger"
            modalLedgerCancel={this.modalLedgerCancel.bind(this)}
          />
      </Secondary>
    );
  }
}

export default withRouter(
  connect(
    state => ({
      wallet: state.wallet,
      tokens: state.tokens,
      currency: state.currency
    }),
    dispatch => ({
      loadTokens: props => {
        dispatch(loadTokens(props));
      }
    })
  )(TokenView)
);
