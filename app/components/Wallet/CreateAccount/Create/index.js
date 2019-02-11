import React, { Component } from "react";
import styles from "./CreationContent.css";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { createAccount } from "../../../../actions/wallet";

import { Input, Form } from "semantic-ui-react";
import buttonStyles from "../../../Button.css";

class CreationContent extends Component {
  state = {};
  handleChange = (e, { value }) => this.setState({ value });

  constructor() {
    super();
    this.onClickCreate = this.onClickCreate.bind(this);
  }

  onClickCreate() {
    this.props.createAccount(this.props, this.state.value);
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.header}>CREATE A NEW WALLET :</div>
        <Form className={styles.form}>
          <Input placeholder="Enter Wallet Name" onChange={this.handleChange} />
          <Form.Button
            onClick={this.onClickCreate}
            className={`${styles.btn} ${buttonStyles.button} ${
              buttonStyles.black
            }`}
          >
            Send
          </Form.Button>
        </Form>
      </div>
    );
  }
}

export default withRouter(
  connect(
    state => ({ wallet: state.wallet }),
    dispatch => ({
      createAccount: (props, accountName) => {
        dispatch(createAccount(props, accountName));
      }
    })
  )(CreationContent)
);
