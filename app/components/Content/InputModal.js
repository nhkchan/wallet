import React, { Component } from "react";
import styles from "./InputModal.css";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Input, Button } from "semantic-ui-react";
import buttonStyles from "../Button.css";
import { LockIcon } from "../Icons";

class InputModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text : ""
    };
  }

  onClick() {
    if (this.state.text !== '') {
      this.props.onInput(this.state.text);
      this.setState({
        text: ""
      });
    }
  }

  handleKeyPress(e) {
    if (e.key === "Enter") {
      this.onClick();
    }
  }

  setInput(e) {
    this.setState({
      text: e.target.value.trim()
    });
  }


  render() {
    if (!this.props.render) {
      return <div />;
    }

    return (
      <div className={styles.container}>
        <div className={styles.subContainer}>
          <div className={styles.modalHeader}>Enter Wallet Name</div>
          <div className={styles.modalContainer}>
            <Input
              value={this.state.text}
              onChange={this.setInput.bind(this)}
              type="text"
              placeholder="Enter Wallet Name..."
              className={styles.textInput}
              onKeyPress={this.handleKeyPress.bind(this)}
            />
            <div className={styles.buttonContainer}>
                <Button
                  onClick={this.props.modalDecline}
                  className={`${buttonStyles.button} ${buttonStyles.black}`}
                >
                  Cancel
                </Button>
                <Button
                  onClick={this.onClick.bind(this)}
                  className={`${buttonStyles.button} ${buttonStyles.gradient}`}
                >
                  Confirm
                </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(
  connect(
    state => ({ wallet: state.wallet }),
    dispatch => ({})
  )(InputModal)
);
