import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import styles from "./Send.css";
import Secondary from "../../Content/Secondary";
import Header from "../../Header";
import SearchBar from "./SearchBar";

class Send extends Component {
  render() {
    let isToken = this.props.match.token ? true : false;
    let assetName = isToken ? this.props.match.token : "TRX";

    return (
      <Secondary className={styles.container}>
        <Header headerName={"Send " + assetName} />
        <SearchBar />
      </Secondary>
    );
  }
}

export default withRouter(connect(state => ({ wallet: state.wallet }))(Send));
