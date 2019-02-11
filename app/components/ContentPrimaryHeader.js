import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import styles from "./ContentPrimaryHeader.css";

export default class ContentPrimaryHeader extends Component {
  render() {
    return (
      <div className={`${styles.bar} ${this.props.className}`}>
        <div>{this.props.text}</div>
        {this.props.children}
      </div>
    );
  }
}
