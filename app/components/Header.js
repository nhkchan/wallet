import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Header.css";

export default class Header extends Component {
  render() {
    return (
      <div className={styles.viewHeader}>
        <div className={`${styles.headerName} ${this.props.className}`}>
          {this.props.headerName}
        </div>
        {this.props.children}
      </div>
    );
  }
}
