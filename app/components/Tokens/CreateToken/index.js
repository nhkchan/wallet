import React, { Component } from "react";
import { Input, Button, Dropdown } from "semantic-ui-react";
import buttonStyles from "../../Button.css";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import moment from "moment";
import DatePicker from "react-datepicker";

import { loadTokens } from "../../../actions/tokens";
import styles from "./CreateToken.css";
import Secondary from "../../Content/Secondary";
import Header from "../../Header";
import { PopupModal } from "../../Content/PopupModal";
import { ArrowRightIcon } from "../../Icons";

const TronHttpClient = require("tron-http-client");

const client = new TronHttpClient();

class CreateToken extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      isTokenCreated: false,
      showSuccessModal: false,
      selectedWallet: {
        text: "Select a Wallet",
        value: "",
        frozenBalance: 0
      },
      formValues: {
        assetName: "",
        assetAbbr: "",
        totalSupply: 0,
        num: 0,
        trxNum: 0,
        endTime: moment(),
        startTime: moment(),
        description: "",
        url: "",
        frozenSupply: 0,
        frozenDuration: 0
      },
      showUserHasTokenWarning: false,
      modalUserHasTokenText : "This account already created a token. Chose a different one."
    };
  }

  setDateStart = date =>
    this.setState({
      formValues: { ...this.state.formValues, startTime: date }
    });
  setDateEnd = date =>
    this.setState({ formValues: { ...this.state.formValues, endTime: date } });

  isValid = ({
    assetName,
    assetAbbr,
    totalSupply,
    num,
    trxNum,
    endTime,
    startTime,
    description,
    url,
    frozenSupply,
    frozenDuration
  }) => {
    let { loading, selectedWallet } = this.state;

    console.log(assetName);
    if (!selectedWallet) return "Select a Wallet";
    if (loading) return "Still loading";
    if (!/^([A-Za-z0-9]{3,32})$/.test(assetName) || assetName.length <= 0)
      "Invalid Asset Name";
    if (!/^([A-Za-z]{1,5})$/.test(assetAbbr)) return "Invalid Abbreviation";
    if (totalSupply <= 0) return "Invalid Supply";
    if (num <= 0) return "Invalid num per Trx";
    if (trxNum <= 0) return "Invalid Trx";
    if (Date.parse(endTime._d) <= Date.now()) return "Invalid end time";
    if (Date.parse(startTime._d) <= Date.now()) return "Invalid start time";
    if (description.length === 0) return "Invalid description";
    if (url.length === 0) return "invalid url";
    return true;
  };

  inputAlphanumeric(e) {
    if (!/^[a-zA-Z0-9]+$/.test(e.key)) {
      e.preventDefault();
    }
  }

  handleInputChange = (e, { name, value }) => {
    this.setState({ formValues: { ...this.state.formValues, [name]: value } });
  };

  selectWallet = (e, { value }) => {
    let accounts = this.props.wallet.persistent.accounts;
    let wallet = Object.keys(accounts).filter(
      wallet => accounts[wallet].publicKey === value
    );
    this.setState({ selectedWallet: accounts[wallet[0]] });
    for(let i = 0;i<this.props.tokens.length;i++){
      if(this.props.tokens[i].owner_address == value){
        this.setState({
          showUserHasTokenWarning:true
        });
      }
    }
  };

  hideUserHasTokenWarning(){
    this.setState({
      showUserHasTokenWarning:false
    });
  }

  submitHandler = async () => {
    let { accounts } = this.props;
    let { selectedWallet, formValues } = this.state;

    let valid = this.isValid(formValues);
    if (valid === true) {
      this.setState({ loading: true });
      this.setState({
        showConfirmModal: true,
        modalConfirmText: "create?"
      });
    } else {
      this.setState({
        showFailureModal: true,
        modalFailureText: "Invalid field Inputs: " + valid
      });
    }
  };

  async modalConfirm() {
    console.log(this.state.formValues);

    let { formValues } = this.state;

    let obj = {
      ...formValues,
      startTime: Date.parse(formValues.startTime._d),
      endTime: Date.parse(formValues.endTime._d),
      frozenSupply: parseInt(formValues.frozenSupply),
      frozenDuration: parseInt(formValues.frozenDuration),
      trxNum: formValues.trxNum * 1000000
    };

    console.log(obj);

    let response = await client.issueAsset(
      this.state.selectedWallet.privateKey,
      obj
    );
    console.log("res", response);

    if (response === null) {
      this.setState({
        showConfirmModal: false,
        showFailureModal: true,
        modalFailureText: "Creating Token failed"
      });
    } else if (response.result != true) {
      this.setState({
        showConfirmModal: false,
        showFailureModal: true,
        modalFailureText: "Creating Token failed: " + response.message
      });
    } else {
      this.setState({
        showConfirmModal: false,
        showSuccessModal: true,
        modalSuccessText: "Token created successully!!",
        isTokenCreated: true
      });
    }

    console.log(response);
  }

  modalDecline() {
    this.setState({ showConfirmModal: false, loading: false });
  }

  modalFailureClose() {
    this.setState({ showFailureModal: false, loading: false });
  }

  modalSuccessClose() {
    this.props.history.push(
      "/wallets/walletDetails/" + this.state.selectedWallet.publicKey
    );
    this.setState({ showSuccessModal: false });
  }

  modalClose() {
    this.state.showConfirmModal = false;
  }

  testNotif() {}

  render() {
    let accountId = this.props.match.params.account;
    let accounts = this.props.wallet.persistent.accounts;

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
        <Header headerName="Create New Token" />
        <div className={styles.createContainer}>
          <div className={styles.mainHeader}>ISSUE A NEW TOKEN :</div>
          <div className={styles.headerCost}>
            Creating a token consumes 1024 TRX and bandwidth.
          </div>
          <div className={styles.textBoxContainer}>
            <span>Token Name</span>
            <Input
              name="assetName"
              onChange={this.handleInputChange}
              className={styles.input}
              onKeyPress={this.inputAlphanumeric}
            />
          </div>
          <div className={styles.textBoxContainer}>
            <span>Token Abbreviation</span>
            <Input
              name="assetAbbr"
              onChange={this.handleInputChange}
              className={styles.input}
              onKeyPress={this.inputAlphanumeric}
            />
          </div>
          <div className={styles.textBoxContainer}>
            <span>Total Supply</span>
            <Input
              name="totalSupply"
              type="number"
              onChange={this.handleInputChange}
              className={styles.input}
            />
          </div>
          <div className={styles.inputSubText}>
            Total amount of tokens which will be in circulation.
          </div>
          <div className={styles.divider} />
          <div className={styles.textBoxContainer}>
            <span>Description</span>
            <Input
              name="description"
              onChange={this.handleInputChange}
              className={styles.input}
            />
          </div>
          <div className={styles.inputSubText}>
            A short description of the purpose of the token.
          </div>
          <div className={styles.textBoxContainer}>
            <span>URL</span>
            <Input
              name="url"
              onChange={this.handleInputChange}
              className={styles.input}
            />
          </div>
          <div className={styles.inputSubText}>
            A website where users can find more information about the token.
          </div>
          <div className={styles.divider} />
          <div className={styles.header}>Frozen Supply :</div>
          <div className={styles.headerSubText}>
            The amount of supply can be specified and must be frozen for a
            minimum of 1 day. The frozen supply can manually be unfrozen after
            start date + frozen days has been reached.
            <div className={styles.divider} />
            <div className={styles.headerSubText}>
              Freezing supply is not required.
            </div>
            <div className={styles.textBoxContainer}>
              <span>Amount</span>
              <Input
                name="frozenSupply"
                type="number"
                onChange={this.handleInputChange}
                className={styles.input}
              />
            </div>
            <div className={styles.textBoxContainer}>
              <span>Days to Freeze</span>
              <Input
                name="frozenDuration"
                type="number"
                onChange={this.handleInputChange}
                className={styles.input}
              />
            </div>
          </div>
          <div className={styles.divider} />
          <div className={styles.header}>EXCHANGE RATE :</div>
          <div className={styles.headerSubText}>
            Specify the price of a single token by defining how many tokens a
            participant will receive for every TRX they spend.
          </div>
          <div className={styles.divider} />
          <div className={styles.headerSubText}>
            Participants will receive{" "}
            <span>
              {this.state.formValues.num ? this.state.formValues.num : "-"}
            </span>
            <span>Token</span> for every{" "}
            <span>
              {this.state.formValues.trxNum
                ? this.state.formValues.trxNum
                : "-"}
            </span>
            <span> TRX</span>.
          </div>
          <div className={styles.divider} />
          <div className={styles.textBoxContainer}>
            <span>TRX Amount</span>
            <Input
              name="trxNum"
              type="number"
              onChange={this.handleInputChange}
              className={styles.input}
            />
          </div>
          <div className={styles.textBoxContainer}>
            <span>Token Amount</span>
            <Input
              name="num"
              type="number"
              onChange={this.handleInputChange}
              className={styles.input}
            />
          </div>
          <div className={styles.dateHeaderCont}>
            <div className={styles.dateHeader}>Start Date</div>
            <div className={styles.dateHeader}>End Date</div>
          </div>
          <div className={styles.datePicker}>
            <DatePicker
              selected={this.state.formValues.startTime}
              onChange={this.setDateStart}
              minDate={moment().add(5, "minutes")}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="LLL"
              timeCaption="time"
            />
            <DatePicker
              selected={this.state.formValues.endTime}
              onChange={this.setDateEnd}
              minDate={moment().add(5, "minutes")}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="LLL"
              timeCaption="time"
            />
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
          <Button
            onClick={this.submitHandler}
            className={`${buttonStyles.button} ${buttonStyles.gradient}`}
          >
            Create New Token
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
          failure
          modalVis={this.state.showUserHasTokenWarning}
          modalText={this.state.modalUserHasTokenText}
          closeModalFunction={this.hideUserHasTokenWarning.bind(this)}
          modalConfirm={this.hideUserHasTokenWarning.bind(this)}
        />

        <PopupModal
          success
          modalVis={this.state.showSuccessModal}
          modalText={this.state.modalSuccessText}
          closeModalFunction={this.modalSuccessClose.bind(this)}
          modalConfirm={this.modalSuccessClose.bind(this)}
        />
      </Secondary>
    );
  }
}

export default withRouter(
  connect(
    state => ({ tokens: state.tokens.tokens, wallet: state.wallet }),
    dispatch => ({
      loadTokens: () => {
        dispatch(loadTokens(dispatch));
      }
    })
  )(CreateToken)
);
