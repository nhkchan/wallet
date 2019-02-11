import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import styles from "./CategoryChild.css";

import { MoreIcon, WalletIcon, DownloadIcon } from "../Icons";

export default class CategoryChild extends Component {
  render() {
    return (
      <NavLink
        to={this.props.routeTo}
        activeClassName={styles.active}
        className={styles.container}
      >
        {this.props.icon}
        <div>
          <div className={styles.text}>{this.props.text}</div>
          <div className={styles.subText}>{this.props.subText}</div>
        </div>
      </NavLink>
    );
  }
}
