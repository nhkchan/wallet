import React, { Component } from "react";
import styles from "./DarkMainModal.css";
import { withRouter } from "react-router-dom";
import Header from "../Header";
import BackButton from "./BackButton";

class DarkMainModal extends Component {
  render() {
    return (
      <div className={styles.container}>
        <Header className={styles.white} headerName={this.props.header} />

        <BackButton />
        <div className={`${styles.subContainer} ${this.props.className}`}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default withRouter(DarkMainModal);
