import React, { Component } from "react";
import styles from "../../Wallet/Send/Send.css";

import Secondary from "../../Content/Secondary";
import Header from "../../Header";

export default class AddressBook extends Component {
  render() {
    return (
      <Secondary className={styles.container}>
        <Header headerName="Address Book" />
      </Secondary>
    );
  }
}
