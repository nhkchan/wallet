import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import styles from "./Token.css";
import TokenProgressBar from "./TokenProgressBar";

class Token extends Component {
  // external redirect
  goToSite = () => require("electron").shell.openExternal(this.props.tokenURL);

  render() {
    return (
      <NavLink
        to={"/tokens/tokenDetails/" + this.props.tokenID + "/"}
        className={styles.token}
      >
        <div className={styles.topBar}>
          <div className={styles.tokenName} onClick={this.goToSite}>{this.props.tokenName}</div>
        </div>
        <TokenProgressBar
          className={styles.tokenBar}
          tokenCurrent={this.props.totalIssued}
          tokenMax={this.props.totalSupply}
          startTime={this.props.startTime}
          endTime={this.props.endTime}
        />
      </NavLink>
    );
  }
}

export default connect(state => ({
  tokens: state.tokens.tokens,
  router: state.router
}))(Token);
