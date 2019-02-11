import React, { Component } from "react";
import styles from "./Language.css";

import Secondary from "../../Content/Secondary";
import Header from "../../Header";

import { Form, TextArea, Button } from "semantic-ui-react";

import { TranslateIcon, ArrowRightIcon } from "../../Icons";

let languages = [{ text: "English", value: "en" }];

export default class Language extends Component {
  state = {};

  // sets language, returns value, ex. 'en'
  setLanguage = (e, { value }) => this.setState({ value });

  render() {
    return (
      <Secondary>
        <Header headerName="Language" />
        <Form className={styles.container}>
          <TranslateIcon className={styles.icon} />
          <div>Select a language below.</div>
          <div className={styles.dropdown}>
            <ArrowRightIcon />
            <Form.Select
              fluid
              onChange={this.setLanguage}
              className={styles.selectLanguage}
              defaultValue={languages.length > 0 ? languages[0].value : ""}
              placeholder="Select Language..."
              options={languages}
            />
          </div>
        </Form>
      </Secondary>
    );
  }
}
