import React, { Component } from "react";
import styles from "./SignUp.css";
import { connect } from "react-redux";
import OWASP from "owasp-password-strength-test";
import { Input, Button } from "semantic-ui-react";
import buttonStyles from "../../Button.css";
import {NavLink, withRouter} from "react-router-dom";
import Swal from 'sweetalert2';

var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
var userPool = null;

var status = false;
var error = "";

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pw: "",
      email:"",
      confirm: "",
      matcherror: "",
      otp: "",
      error: "",
      userHasSignedUp: false,
      userHasValidatedOTP: false
    };
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    var pwStatus = false;
    if (this.state.pw === this.state.confirm) {
      this.setState({
        matcherror: ""
      });
      pwStatus = true;
    } else {
      this.setState({
        matcherror: " -- Passwords don't match."
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
  renderEnterOTP() {
    alert("OTP");
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


  async performSignUp(){
    await userPool.signUp(this.state.email, this.state.confirm, null, null, function(err, result){
      if (err.code != null && err.code.trim() != "") {
        status = false;
        Swal.fire({
          type: 'error',
          title: 'Error Occured',
          text: err.message,
          footer: ''
        })
      }else{
        status = true;
        Swal.fire({
          type: 'success',
          title: 'Registered successfully. Please validate OTP.',
          showConfirmButton: true,
          timer: 3000
        })
        document.getElementById("verifyButton").disabled = false;
        document.getElementById("otp").disabled = false;
      }
    })
  }

  async signUpUser(){
    await this.performSignUp().then(this.setState({userHasSignedUp: status}));
  }

  async performOtpValidation(){
    var userData = {
      Username : this.state.email,
      Pool : userPool
    };

    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    await cognitoUser.confirmRegistration(this.state.otp, true, function(err, result) {
      if (err.code != null && err.code.trim() != "") {
        Swal.fire({
          type: 'error',
          title: 'Error Occured',
          text: err.message,
          footer: ''
        })
      }else{
        Swal.fire({
          title: 'Welcome to TronATM',
          text: "Successfully signed up. Please login to begin.",
          type: 'success',
          allowOutsideClick: false,
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Ok'
        }).then((result) => {
          if (result.value) {
            document.getElementById("cancelButton").click();
          }
        })
      }
    });
  }

  async validateOTP(){
    await this.performOtpValidation().then(this.setState({userHasValidatedOTP: true}));
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
              <div id="signUpForm">
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
                <Input
                    onChange={this.setConfirm.bind(this)}
                    id="confirmPassword"
                    type="password"
                    onKeyPress={this.onClick.bind(this)}
                    onKeyUp={this.onClick.bind(this)}
                    placeholder="Repeat Password"
                    className={styles.passwordInput2}
                />
                <p className={styles.status} id="passwordStrength">
                  Password Strength: {this.getPasswordEvaluation(this.state.pw)}{" "}
                  {this.state.matcherror}
                </p>
                <div className={styles.buttonContainer}>
                  <Button onClick={this.signUpUser.bind(this)} id="submitButton"
                          className={`${styles.btn} ${buttonStyles.button} ${
                              buttonStyles.black
                              }`}
                  >
                    Submit
                  </Button>
                </div>
                <Input
                    onChange={this.setOTP.bind(this)}
                    id="otp"
                    type="number"
                    placeholder="One Time Password"
                    className={styles.passwordInput2}
                    disabled={true}
                />
                <div className={styles.buttonContainer}>
                  <Button onClick={this.validateOTP.bind(this)} id="verifyButton"
                          className={`${styles.btn} ${buttonStyles.button} ${
                              buttonStyles.black
                              }`}
                  >
                    Verify
                  </Button>
                </div>
              </div>
              <NavLink to="/dashboard/">
              <Button id="cancelButton"
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
    var userPoolId = process.env.REACT_APP_USER_POOL_ID;
    var clientId = process.env.REACT_APP_CLIENT_ID;
    var poolData = {
      UserPoolId : userPoolId, // Your user pool id here
      ClientId : clientId // Your client id here
    };
    userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    document.getElementById("submitButton").disabled = true;
    document.getElementById("verifyButton").disabled = true;
    document.getElementById("otp").disabled = true;
  }

  render() {
    return this.renderCreatePassword();
  }
}