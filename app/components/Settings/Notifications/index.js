import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import styles from "./Notifications.css";

import Secondary from "../../Content/Secondary";
import Header from "../../Header";

import { Checkbox, Button } from "semantic-ui-react";

import { BellIcon } from "../../Icons";
import { setValue, getValue } from "../../../actions/storage";

const STORAGE_NAMESPACE = "settings_notifications";
const KEY_PUSHNOTIF = "PUSHNOTIFICATIONS";
const KEY_NOTIFY_CONFIRM = "NOTIFY_CONFIRMS";

class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pushNotif: true,
      txNotify: false
    };
  }

  componentDidMount() {
    this.state.pushNotif = getValue(
      this.props.storage,
      STORAGE_NAMESPACE,
      KEY_PUSHNOTIF,
      true
    );
    this.state.txNotify = getValue(
      this.props.storage,
      STORAGE_NAMESPACE,
      KEY_NOTIFY_CONFIRM,
      false
    );
  }

  setPushNotif = e => {
    this.props.setValue(this.props, KEY_PUSHNOTIF, e.target.checked);
    this.setState({ pushNotif: e.target.checked });
  };

  setTxNotify = e => {
    this.props.setValue(this.props, KEY_NOTIFY_CONFIRM, e.target.checked);
    this.setState({ txNotify: e.target.checked });
  };

  render() {
    return (
      <Secondary>
        <Header headerName="Notifications" />
        <div className={styles.container}>
          <BellIcon className={styles.icon} />
          <div className={styles.toggleContainer}>
            <div className={styles.toggleLabel}>Enable Push Notifications</div>
            <Checkbox
              toggle
              onChange={this.setPushNotif}
              checked={this.state.pushNotif}
              className={styles.toggle}
            />
          </div>
          <div className={styles.divider} />
          <div className={styles.toggleContainer}>
            <div className={styles.toggleLabel}>
              Notify me when transactions are confirmed
            </div>
            <Checkbox
              toggle
              onChange={this.setTxNotify}
              checked={this.state.txNotify}
              className={styles.toggle}
            />
          </div>
        </div>
      </Secondary>
    );
  }
}

export default withRouter(
  connect(
    state => ({ storage: state.storage }),
    dispatch => ({
      setValue: (props, key, value) => {
        setValue(props.storage, STORAGE_NAMESPACE, key, value, dispatch);
      }
    })
  )(Notifications)
);
