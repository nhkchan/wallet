import React, { Component } from "react";
import styles from "./Feedback.css";

import Secondary from "../../Content/Secondary";
import Header from "../../Header";

import { TextArea, Button } from "semantic-ui-react";
import buttonStyles from "../../Button.css";

import { CommentIcon } from "../../Icons";

export default class Feedback extends Component {
  state = {};

  setLanguage = (e, { value }) => this.setState({ message: value });

  submitFeedback = () => {
    console.log(this.state.message);
  };

  render() {
    return (
      <Secondary>
        <Header headerName="Send Feedback" />
        <div className={styles.container}>
          <CommentIcon className={styles.icon} />
          <div>
            Write below and click on submit to send the TronATM Team feedback.
          </div>
          <TextArea
            placeholder="Write your message here..."
            className={styles.textArea}
          />
          <Button
            onClick={this.submitFeedback}
            className={`${styles.btn} ${buttonStyles.button} ${
              buttonStyles.black
            }`}
          >
            Submit
          </Button>
        </div>
      </Secondary>
    );
  }
}
