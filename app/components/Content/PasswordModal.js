import React, { Component } from "react";
import styles from "./PasswordModal.css";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import OWASP from "owasp-password-strength-test";
import { Input, Button } from "semantic-ui-react";
import buttonStyles from "../Button.css";
import { LockIcon } from "../Icons";

class PasswordModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pw: "",
      confirm: "",
      matcherror: ""
    };
  }

  onClick() {
    if (this.props.newPass !== undefined) {
      if (this.state.pw === this.state.confirm) {
        this.props.onPassword(this.state.pw);
        this.setState({
          matcherror: ""
        });
      } else {
        this.setState({
          matcherror: " -- Passwords don't match."
        });
      }
    } else {
      this.props.onPassword(this.state.pw);
    }
  }

  handleKeyPress(e) {
    if (e.key === "Enter") {
      this.onClick();
    }
  }

  setPw(e) {
    this.setState({
      pw: e.target.value.trim()
    });
  }

  setConfirm(e) {
    this.setState({
      confirm: e.target.value.trim()
    });
  }

  onUserPwReset() {
    this.props.onUserPwReset();
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
  renderEnterPassword() {
    return (
      <div className={styles.container}>
        <div className={styles.subContainer}>
      <br/>
        <div className={styles.modalHeader}>Login</div>
          <div className={styles.modalContainer}>
            <LockIcon className={styles.icon} />
            <Input
              onChange={this.setPw.bind(this)}
              type="email"
              placeholder="Enter your Email..."
              className={styles.passwordInput}
              onKeyPress={this.handleKeyPress.bind(this)}
            />
            <br/>
            <Input
              onChange={this.setPw.bind(this)}
              type="password"
              placeholder="Enter your Password..."
              className={styles.passwordInput}
              onKeyPress={this.handleKeyPress.bind(this)}
            />
            <p className={styles.status}>
              {this.props.userHasEnteredWrongPw ? "Wrong Password" : ""}
            </p>
            <div className={styles.buttonContainer}>
              <Button
                onClick={this.onClick.bind(this)}
                className={`${styles.btn} ${buttonStyles.button} ${
                  buttonStyles.black
                }`}
              >
                Submit
              </Button>
              {this.props.userHasEnteredWrongPw ? this.renderResetPart() : ""}
            </div>
          </div>
        </div>
      </div>
    );
  }

  getPasswordEvaluation(pw) {
    let result = OWASP.test(this.state.pw);
    if (result.failedTests.length === 0)
      return <span className={styles.perfect}>PERFECT</span>;
    if (result.failedTests.length === 1)
      return <span className={styles.strong}>BETTER</span>;
    if (result.failedTests.length === 2)
      return <span className={styles.good}>GOOD</span>;
    if (result.failedTests.length === 3)
      return <span className={styles.ok}>OK</span>;
    else return <span className={styles.weak}>WEAK</span>;
  }

  renderCreatePassword() {
    return (
      <div className={styles.container}>
        <div className={styles.subContainer}>
          <div className={styles.modalHeader}>Set a secure Password</div>
          <div className={styles.modalContainer}>
            <p className={styles.status}>
              Password Strength: {this.getPasswordEvaluation(this.state.pw)}{" "}
              {this.state.matcherror}
            </p>
            <Input
              onChange={this.setPw.bind(this)}
              type="password"
              placeholder="Enter your Password..."
              className={styles.passwordInput2}
            />
            {this.props.newPass !== undefined ? (
              <Input
                onChange={this.setConfirm.bind(this)}
                type="password"
                placeholder="Repeat Password"
                className={styles.passwordInput2}
              />
            ) : (
              ""
            )}
            <Button
              onClick={this.onClick.bind(this)}
              className={`${styles.btn} ${buttonStyles.button} ${
                buttonStyles.black
              }`}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    );
  }

  render() {
    if (!this.props.render) {
      return <div />;
    }

    if (this.props.newPass !== undefined) {
      return this.renderCreatePassword();
    } else {
      return this.renderEnterPassword(this.props);
    }
  }
}

export default withRouter(
  connect(
    state => ({ wallet: state.wallet }),
    dispatch => ({})
  )(PasswordModal)
);
