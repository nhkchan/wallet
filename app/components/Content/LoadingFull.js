import React, { Component } from "react";
import styles from "./LoadingFull.css";

import { SquareLoadingIcon } from "../Icons";

export default class LoadingFull extends Component {
  render() {
    return (
      <div className={`${styles.container} ${this.props.className}`}>
        <div className={styles.loadingContainer}>
          <SquareLoadingIcon className={styles.loading} />
          <div className={styles.loadingText}>LOADING</div>
        </div>
      </div>
    );
  }
}
