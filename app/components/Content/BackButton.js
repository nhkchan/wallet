import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import styles from "./BackButton.css";
import { BackArrowIcon } from "../Icons";

class BackButton extends Component {
  goBack() {
    if (this.props.target !== undefined) {
      this.props.history.push(this.props.target);
    } else if (this.props.match.params.account !== undefined) {
      this.props.history.push(
        "/wallets/walletDetails/" + this.props.match.params.account
      );
    } else {
      throw "back button has no target defined, and account parameter not found in match";
    }
  }

  render() {
    return (
      <div onClick={this.goBack.bind(this)} className={styles.backArrow}>
        <BackArrowIcon />
      </div>
    );
  }
}

export default withRouter(
  connect(
    state => ({}),
    dispatch => ({})
  )(BackButton)
);
