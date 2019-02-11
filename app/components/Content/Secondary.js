import React, { Component } from "react";
import styles from "./Secondary.css";

import Background from "../ContentSecondaryBG";

export default class Secondary extends Component {
  render() {
    return (
      <div className={`${styles.container} ${this.props.className}`}>
          <br/>
        <div className={styles.content}>{this.props.children}</div>
        <Background className={styles.bg} />
      </div>
    );
  }
}
