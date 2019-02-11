/* eslint flowtype-errors/show-errors: 0 */
import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { IntlProvider } from "react-intl";
import axios from "axios";

import Navbar from "./Navbar/";
import Sidebar from "./Sidebar";
import Main from "./Main";
import WebsocketContainer from "./WebsocketContainer";
import PasswordModal from "./Content/PasswordModal";

import { languages } from "../translations";
import { setLanguage } from "../actions/app";
import { initFromStorage, decryptPersistent } from "../actions/wallet";
import { loadTokens } from "../actions/tokens";
import { loadWitnesses } from "../actions/witnesses";
import { loadStorage } from "../actions/storage";
import { PopupModal } from "./Content/PopupModal";
import { onSetPassword } from "../actions/wallet";

import styles from "../components/ContentMain.css";
import { WALLET_STATE } from "../actions/wallet";

let myPackage = require("../package");
require('dotenv').config();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showEnterPw: false,
      showCreatePw: false,

      userHasEnteredWrongPw: false,
      showResetModal: false,
      onlineAppVersion: null,
      myVersion: null,
      isOutdated: false
      //the current app version, fetched from github
    };
  }

  componentDidMount() {
    let language = "en";
    this.props.setLanguage(language);
    this.props.initFromStorage(this.props);
    this.props.loadTokens();
    this.props.loadWitnesses();
    this.props.loadStorage(this.props);
    this.fetchAppVersion();
    window.localStorage.setItem("SCREEN_NO", JSON.stringify(0));
  }

  isOutdated(myVersion, onlineVersion) {
    let mine = myVersion.split(".");
    let theirs = onlineVersion.split(".");

    for (let i = 0; i < theirs.length && i < mine.length; i++) {
      let m = parseInt(mine[i]);
      let t = parseInt(theirs[i]);

      if (t > m) return true;
    }
    return theirs.length > mine.length;
  }

  async fetchAppVersion() {
    try {
      let onlinePackage = await axios
        .get(
          "https://raw.githubusercontent.com/TronWatch/Desktop-Wallet/master/app/package.json"
        )
        .then(x => x.data);
      let theirVersion = onlinePackage.version;
      let myVersion = myPackage.version;
      let outdated = this.isOutdated(myVersion, theirVersion);

      this.setState({
        myVersion: myVersion,
        onlineAppVersion: theirVersion,
        isOutdated: outdated
      });
    } catch (e) {
      console.log("error fetching version");
      console.log(e);
    }
  }

  async onEnterPassword(pw) {
    let result = await this.props.decryptPersistent(
      this.props.wallet.persistent_encrypted,
      pw
    );
    if (result === false) {
      this.setState({
        userHasEnteredWrongPw: true
      });
    } else {
      this.setState({
        userHasEnteredWrongPw: false
      });
    }
  }

  onCreatePassword(pw) {
    this.props.onSetPassword(this.props, pw);
  }

  onUserPwReset() {
    this.setState({
      showResetModal: true
    });
  }

  onUserAcceptsReset() {
    this.setState({
      showResetModal: false
    });

    window.localStorage.clear();
    window.location.reload();
  }

  onUserDeclinesReset() {
    this.setState({
      showResetModal: false
    });
  }

  renderVersionCheck() {
    //if out of date, then
    if (this.state.isOutdated) {
      return (
        <div className={styles.importantMsg} onClick={this.updateApp}>
          Your App is out of date. Please click here and install latest release.
          Your version {this.state.myVersion} new version{" "}
          {this.state.onlineAppVersion}
        </div>
      );
    }
  }

  updateApp = () =>
    require("electron").shell.openExternal(
      "https://github.com/TronWatch/Desktop-Wallet/releases"
    );

  render() {
    let { activeLanguage } = this.props;
    return (
      <IntlProvider
        locale={activeLanguage}
        messages={languages[activeLanguage]}
      >
        <div className={styles.appContainer}>
          {this.renderVersionCheck()}
          <div className={styles.interface}>
            <div className={styles.container}>
              <Sidebar />
              <Main />

              <PasswordModal
                render={
                  this.props.wallet.wallet_state ===
                    WALLET_STATE.NEEDS_USER_UNLOCK && !this.state.showResetModal
                }
                onPassword={this.onEnterPassword.bind(this)}
                userHasEnteredWrongPw={this.state.userHasEnteredWrongPw}
                onUserPwReset={this.onUserPwReset.bind(this)}
              />

              <PasswordModal
                newPass
                render={
                  this.props.wallet.wallet_state ===
                  WALLET_STATE.NEEDS_USER_PASSWORD
                }
                onPassword={this.onCreatePassword.bind(this)}
              />

              <PopupModal
                confirmation
                modalVis={this.state.showResetModal}
                modalText="Are you sure? This will reset TronATM and delete all data."
                modalConfirm={this.onUserAcceptsReset.bind(this)}
                modalDecline={this.onUserDeclinesReset.bind(this)}
              />
            </div>
          </div>
          <Navbar />
        </div>
      </IntlProvider>
    );
  }
}

export default withRouter(
  connect(
    state => ({
      wallet: state.wallet,
      activeLanguage: state.app.activeLanguage,
      availableLanguages: state.app.availableLanguages
    }),
    dispatch => ({
      initFromStorage: props => {
        dispatch(initFromStorage(props, dispatch));
      },
      setLanguage: props => {
        dispatch(setLanguage(props, dispatch));
      },
      loadWitnesses: props => {
        dispatch(loadWitnesses(props, dispatch));
      },
      loadTokens: props => {
        dispatch(loadTokens(props, dispatch));
      },
      loadStorage: props => {
        dispatch(loadStorage(props));
      },
      decryptPersistent: (persistentEncrypted, password) => {
        return decryptPersistent(persistentEncrypted, password, dispatch);
      },
      onSetPassword: (props, password) => {
        dispatch(onSetPassword(props, password));
      }
    })
  )(App)
);
