import React, { Component } from "react";
import styles from "./ValidateOtp.css";
import { connect } from "react-redux";
import OWASP from "owasp-password-strength-test";
import { Input, Button } from "semantic-ui-react";
import buttonStyles from "../../Button.css";
import {NavLink, withRouter} from "react-router-dom";
import { LockIcon } from "../../Icons";


var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;

export default class ValidateOtp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      otp: ""
    };
    alert(JSON.stringify(props));
  }

  onClick() {
      if (this.state.pw === this.state.confirm) {
        this.setState({
          matcherror: ""
        });
        this.renderEnterPassword();
      } else {
        this.setState({
          matcherror: " -- Passwords don't match."
        });
      }
  }

  handleKeyPress(e) {
    if (e.key === "Enter") {
      this.onClick();
    }
  }

  setOTP(e) {
    this.setState({
      otp: e.target.value.trim()
    });
  }

  onWrongPassword() {}

  renderResetPart() {
    return (
      <Button
        onClick={this.onUserPwReset.bind(this)}
        className={`${styles.btn} ${buttonStyles.button} ${buttonStyles.black}`}
      >
        Reset Password
      </Button>
    );
  }

  getPasswordEvaluation(pw) {
    let result = OWASP.test(this.state.pw);
    if (result.failedTests.length === 0)
      return <span className={styles.perfect}>100%</span>;
    if (result.failedTests.length === 1)
      return <span className={styles.good}>75%</span>;
    if (result.failedTests.length === 2)
      return <span className={styles.good}>50%</span>;
    if (result.failedTests.length === 3)
      return <span className={styles.ok}>25%</span>;
    else return <span className={styles.weak}>0%</span>;
  }

  renderCreatePassword() {
    return (
      <div className={styles.container}>
        <div className={styles.subContainer}>
          <div className={styles.modalHeader}>Sign Up</div>
          <div className={styles.modalContainer}>
            <div id="validateOTPForm">
              <Input
                  onChange={this.setOTP.bind(this)}
                  id="otp"
                  type="number"
                  placeholder="One Time Password"
                  className={styles.passwordInput2}
              />
              <NavLink to="/dashboard/signup">
                <Button
                    onClick={this.onClick.bind(this)} id="submitButton"
                    className={`${styles.btn} ${buttonStyles.button} ${
                        buttonStyles.black
                        }`}
                >
                  Submit
                </Button>
              </NavLink>
            </div>
            <NavLink to="/dashboard/">
            <Button
                className={`${styles.btn} ${buttonStyles.button} ${
                    buttonStyles.black
                    }`}
            >
              Cancel
            </Button>
            </NavLink>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {


  }

  render() {
      return this.renderCreatePassword();
  }
}