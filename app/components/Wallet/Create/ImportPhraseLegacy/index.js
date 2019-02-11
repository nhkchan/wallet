import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import styles from "./Import.css";

import { Input, Form } from "semantic-ui-react";
import buttonStyles from "../../../Button.css";
import { addAccount } from "../../../../actions/wallet";

const bip39 = require("bip39");
const tools = require("tron-http-tools");

class Import extends Component {
  constructor() {
    super();

    this.state = {
      words: []
    };
  }

  isWordValid(word) {
    for (var i = 0; i < bip39.wordlists.EN.length; i++) {
      if (bip39.wordlists.EN[i] == word) return true;
    }
    return false;
  }

  changeWord(event) {
    let word = event.target.value.toLowerCase().trim();
    this.state.words[this.id] = word;
    /*
        let valid = this._this.isWordValid(word);
        event.target.addClass(styles.invalid);
        */
  }

  createWordSpans(start, end) {
    let output = [];
    for (let i = start; i <= end; i++) {
      this.state.words.push("");

      output.push(
        <div key={i} className={styles.word}>
          <span>{i} : </span>
          <Input
            onChange={this.changeWord.bind({
              state: this.state,
              id: i-1,
              _this: this
            })}
          />
        </div>
      );
    }

    return output;
  }

  onImport() {
    let mnemonic = this.state.words.join(" ");
    let newAccount = tools.accounts.accountFromMnemonicString(mnemonic);
    this.props.addAccount(this.props, "Imported Account", newAccount);
  }

  render() {
    return (
      <div className={styles.container}>
        <Form className={styles.form}>
          <div className={styles.wordContainer}>
            <div className={styles.wordColumn}>
              {this.createWordSpans(1, 12)}
            </div>
            <div className={styles.wordColumn}>
              {this.createWordSpans(13, 24)}
            </div>
          </div>
          <Form.Button
            onClick={this.onImport.bind(this)}
            className={`${styles.btn} ${buttonStyles.button} ${
              buttonStyles.black
            }`}
          >
            Import
          </Form.Button>
        </Form>
      </div>
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
      addAccount: (props, accountName, newAccount) => {
        addAccount(props, accountName, dispatch, newAccount);
      }
    })
  )(Import)
);
