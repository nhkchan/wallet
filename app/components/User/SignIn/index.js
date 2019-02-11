import React, { Component } from "react";
import styles from "./SignIn.css";
import { Input, Button } from "semantic-ui-react";
import buttonStyles from "../../Button.css";
import {NavLink, withRouter} from "react-router-dom";

export default class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pw: "",
      email:"",
      matcherror: "",
    };
  }

  onClick() {
    var pwStatus = false;
      if (this.state.pw.trim() !== "") {
        this.setState({
          matcherror: ""
        });
        pwStatus = true;
      } else {
        this.setState({
          matcherror: " -- Password is missing."
        });
      }

    if (this.state.email.trim() === ""){
      this.setState({
        matcherror: "\n -- Email is missing."
      });
    }else {
      if(pwStatus){
        document.getElementById("submitButton").disabled = false;
      }
    }
  }

  onVerify() {
    if (this.state.pw === this.state.confirm) {
      this.setState({
        matcherror: ""
      });
      //this.renderEnterPassword();
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

  setPw(e) {
    this.setState({
      pw: e.target.value.trim()
    });
  }

  setEmail(e) {
    this.setState({
      email: e.target.value.trim()
    });
  }

  setConfirm(e) {
    this.setState({
      confirm: e.target.value.trim()
    });
  }

  setOTP(e) {
    this.setState({
      otp: e.target.value.trim()
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

  renderCreatePassword() {
    return (
      <div className={styles.container}>
        <div className={styles.subContainer}>
          <div className={styles.modalHeader}>Sign In</div>
          <div className={styles.modalContainer}>
            <div id="signInForm">
            <Input
                onChange={this.setEmail.bind(this)}
                id="email"
                type="email"
                onKeyPress={this.onClick.bind(this)}
                onKeyUp={this.onClick.bind(this)}
                placeholder="Enter your Email..."
                className={styles.passwordInput2}
            />
            <Input
              onChange={this.setPw.bind(this)}
              id="password"
              type="password"
              onKeyPress={this.onClick.bind(this)}
              onKeyUp={this.onClick.bind(this)}
              placeholder="Enter your Password..."
              className={styles.passwordInput2}
            />
            <p className={styles.status} id="passwordStrength">
              {this.state.matcherror}
            </p>
            <NavLink to="/dashboard/">
            <Button disabled={true} id="submitButton"
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
  //document.getElementById("verifyButton").style.visibility = 'hidden';
  }

  render() {
      return this.renderCreatePassword();
  }
}