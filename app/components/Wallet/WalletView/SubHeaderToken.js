import React, { Component } from "react";
import { FormattedNumber } from "react-intl";
import { NavLink, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import styles from "./SubHeaderToken.css";

class SubHeaderToken extends Component {
  render() {
    return (
      <NavLink
        to={
          "/wallets/walletDetails/" +
          this.props.match.params.account +
          "/" +
          this.props.token
        }
        className={styles.coinContainer}
        activeClassName={styles.active}
      >
        <div className={styles.coinAmount}>
          <FormattedNumber value={this.props.amount} />
        </div>
        <div className={styles.coinType}>{this.props.token}</div>
      </NavLink>
    );
  }
}
export default withRouter(
  connect(state => ({ wallet: state.wallet }))(SubHeaderToken)
);
