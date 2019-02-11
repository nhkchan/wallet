import React, { Component } from "react";
import styles from "./Node.css";

import Secondary from "../../Content/Secondary";
import Header from "../../Header";

import { Input, Button } from "semantic-ui-react";
import buttonStyles from "../../Button.css";

import { WifiIcon } from "../../Icons";

export default class Node extends Component {
  state = {};

  updateValue = (e, { value }) => this.setState({ value });

  setNode = e => {
    // handle changeNode here
    console.log(this.state.value);
  };

  render() {
    return (
      <Secondary>
        <Header headerName="Node" />
        <div className={styles.container}>
          <WifiIcon className={styles.icon} />
          <div className={styles.warningHeader}>WARNING</div>
          <div className={styles.warningText}>
            TronATM depends on our Tron Wallet Service for the blockchain
            information, networking and synchronization.
          </div>
          <div className={styles.warningText}>
            The default configuration points to:
          </div>
          <div className={styles.warningLink}>https://api.tron.watch</div>
          <div className={styles.warningSubText}>
            (Tron public instance)
          </div>
          <div className={styles.divider} />
          <div className={styles.subText}>
            Change the Wallet Service URL below.
          </div>
          <Input
            className={styles.input}
            placeholder="https://api.tron.watch"
            onChange={this.updateValue}
          />
          <Button
            onClick={this.setNode}
            className={`${styles.btn} ${buttonStyles.button} ${
              buttonStyles.black
            }`}
          >
            Update
          </Button>
        </div>
      </Secondary>
    );
  }
}
