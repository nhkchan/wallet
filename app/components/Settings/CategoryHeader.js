import React, { Component } from "react";
import styles from "./CategoryHeader.css";

export default class CategoryHeader extends Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.header}>{this.props.text}</div>
        {this.props.children}
      </div>
    );
  }
}
