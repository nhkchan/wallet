import React, { Component } from "react";
import styles from "./Creation.css";
import Header from "../../Header";
import CreationContent from "./Create";

export default class Creation extends Component {
  render() {
    return (
      <div className={styles.container}>
        <Header headerName="Wallet Creation" />
        <CreationContent />
      </div>
    );
  }
}
