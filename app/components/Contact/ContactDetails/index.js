import React, { Component } from "react";
import styles from "../../Wallet/Send/Send.css";

import Secondary from "../../Content/Secondary";
import Header from "../../Header";

export default class ContactDetails extends Component {
  render() {
    return (
      <Secondary className={styles.container}>
        <Header headerName="ContactName" />
      </Secondary>
    );
  }
}
