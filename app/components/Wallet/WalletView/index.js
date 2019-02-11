import React, { Component } from "react";
import { NavLink, withRouter } from "react-router-dom";
import { Dropdown, Button } from "semantic-ui-react";
import { connect } from "react-redux";
import styles from "./WalletView.css";

import { deleteAccount, renameAccount } from "../../../actions/wallet";

import {
  MoreIcon,
  SendIcon,
  QRScanIcon,
  DownloadIcon,
  SnowIcon,
  PencilIcon
} from "../../Icons";
import buttonStyles from "../../Button.css";

import Secondary from "../../Content/Secondary";
import Header from "../../Header";
import SubHeader from "./SubHeader";
import { PopupModal } from "../../Content/PopupModal";
import InputModal from "../../Content/InputModal";
import TxList from "./TxList";

class WalletView extends Component {

  constructor(props){
    super(props);

    this.state = {
      showWalletNameChange : false,

      showDeleteStep1 : false,
      showDeleteStep2 : false,

      modalDeleteStep1Text : "Are you sure you want to delete this wallet? You will not be able to recover it without your backup phrases or seed.",
    modalDeleteStep2Text : "LAST CHANCE. Are you absolutely sure you want to delete this wallet? You NEED the backup phrase or seed to restore the wallet."

    }
  }

  showStep1(){
    this.setState({
      showDeleteStep1:true,
      showDeleteStep2:false,
    });
  }
  acceptStep1(){
    this.setState({
      showDeleteStep1:false,
      showDeleteStep2:true,
    });
  }
  dismissStep1(){
    this.setState({
      showDeleteStep1:false,
      showDeleteStep2:false,
    });
  }
  acceptStep2(){
    this.setState({
      showDeleteStep1:false,
      showDeleteStep2:false,
    });

    deleteAccount(this.props, this.props.match.params.account)
  }
  dismissStep2(){
    this.setState({
      showDeleteStep1:false,
      showDeleteStep2:false,
    });
  }

  confirmWalletNameChange(name){
    this.props.renameAccount(this.props, this.props.match.params.account, name);
    this.setState({
      showWalletNameChange : false
    });
  }

  cancelWalletNameChange(){
    this.setState({
      showWalletNameChange : false
    });
  }

  showWalletNameChange(){
    this.setState({
      showWalletNameChange : true
    });
  }

  render() {
    let accountId = this.props.match.params.account;
    let account = this.props.wallet.persistent.accounts[accountId];

    if (!account) {
      this.props.history.push("/wallets/");
      return <div />;
    }

    let token = this.props.match.params.token
      ? this.props.match.params.token
      : "";

    let sendUrl = "";
    let freezeUrl = "";

    if (account.watchonly && account.ledger!==true) {
      if (this.props.match.params.token && token !== "TRX")
        sendUrl = "/wallets/createassettransfer/" + accountId + "/" + token;
      else sendUrl = "/wallets/createtransfer/" + accountId;
      freezeUrl = "/wallets/createfreeze/" + accountId;
    } else {
      sendUrl = "/wallets/send/" + accountId + "/" + token;
      freezeUrl = "/wallets/freeze/" + accountId + "/" + token;
    }

    return (
      <Secondary>
        <div className={styles.headerContainer}>
          <Header headerName={account.name}>
            <Dropdown className={styles.moreMenu} icon={<MoreIcon />}>
              <Dropdown.Menu>
                {!account.watchonly ? (
                  <NavLink to={"/wallets/walletBackup/" + accountId}>
                    <Dropdown.Item
                      text="Backup Wallet"
                      icon={<DownloadIcon />}
                    />
                  </NavLink>
                ) : (
                  ""
                )}
                <Dropdown.Item
                  text="Delete Wallet"
                  onClick={this.showStep1.bind(this)}
                />
                <Dropdown.Item
                  text="Rename Wallet"
                  onClick={this.showWalletNameChange.bind(this)}
                />
              </Dropdown.Menu>
            </Dropdown>
          </Header>
          <SubHeader account={account} />
        </div>
        <div className={styles.buttonContainer}>
          <NavLink to={sendUrl}>
            <Button className={buttonStyles.button}>
              <SendIcon />Send
            </Button>
          </NavLink>
          <NavLink to={"/wallets/receive/" + accountId + "/"}>
            <Button className={buttonStyles.button}>
              <QRScanIcon />Receive
            </Button>
          </NavLink>
          <NavLink to={freezeUrl}>
            <Button className={buttonStyles.button}>
              <SnowIcon />Freeze TRX
            </Button>
          </NavLink>
          {!account.watchonly ? (
            <NavLink to={"/wallets/offline/" + accountId}>
              <Button className={buttonStyles.button}>
                <PencilIcon />Offline Sign
              </Button>
            </NavLink>
          ) : (
            ""
          )}
        </div>
        {/*<DatePicker/>*/}
        <TxList />

        <PopupModal
          confirmation
          modalVis={this.state.showDeleteStep1}
          modalText={this.state.modalDeleteStep1Text}
          closeModalFunction={this.dismissStep1.bind(this)}
          modalDecline={this.dismissStep1.bind(this)}
          modalConfirm={this.acceptStep1.bind(this)}
        />

        <PopupModal
          confirmation
          modalVis={this.state.showDeleteStep2}
          modalText={this.state.modalDeleteStep2Text}
          closemodalfunction={this.dismissStep2.bind(this)}
          modalDecline={this.dismissStep2.bind(this)}
          modalConfirm={this.acceptStep2.bind(this)}
        />

        <InputModal
          render={this.state.showWalletNameChange}
          onInput={this.confirmWalletNameChange.bind(this)}
          modalDecline={this.cancelWalletNameChange.bind(this)}
        />
      </Secondary>
    );
  }
}

export default withRouter(
  connect(
    state => ({ wallet: state.wallet }),
    dispatch => ({
      deleteAccount: (props, address)=> {
        deleteAccount(props, address);
      },
      renameAccount: (props, address, name)=>{
        renameAccount(props, address, name, dispatch);
      }
    })
  )(WalletView)
);
