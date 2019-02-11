import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import styles from "./Announcements.css";

import Secondary from "../../Content/Secondary";
import Header from "../../Header";

import { Checkbox, Button } from "semantic-ui-react";

import { BellIcon } from "../../Icons";
import { setValue, getValue } from "../../../actions/storage";

const STORAGE_NAMESPACE = "settings_announcements";
const KEY_ANNOUNCEMENT = "ANNOUNCEMENT";
const KEY_ANNOUNCEMENT_CUSTOM = "ANNOUNCEMENT_CUSTOM";

class Announcements extends Component {
  constructor(props) {
    super(props);
    this.state = {
      announcements: true,
      announcementsCustom: true
    };
  }

  componentDidMount() {
  }

  setAnnouncements = e => {
   if(e.target.checked === true){
     window.localStorage.setItem(KEY_ANNOUNCEMENT, "Y");
   }else{
     window.localStorage.setItem(KEY_ANNOUNCEMENT, "N");
   }
    this.setState({ announcements: e.target.checked });
  };

  setAnnouncementsCustom = e => {
    if(e.target.checked === true){
      window.localStorage.setItem(KEY_ANNOUNCEMENT_CUSTOM, "Y");
    }else{
      window.localStorage.setItem(KEY_ANNOUNCEMENT_CUSTOM, "N");
    }
    this.setState({ announcementsCustom: e.target.checked });
  };

  render() {
    if("Y" == window.localStorage.getItem(KEY_ANNOUNCEMENT)){
      this.state.announcements = true;
    }else{
      this.state.announcements = false;
    }
    if("Y" == window.localStorage.getItem(KEY_ANNOUNCEMENT_CUSTOM)){
      this.state.announcementsCustom = true;
    }else{
      this.state.announcementsCustom = false;
    }

    return (
      <Secondary>
        <Header headerName="Announcements" />
        <div className={styles.container}>
          <BellIcon className={styles.icon} />
          <div className={styles.toggleContainer}>
            <div className={styles.toggleLabel}>Enable Announcements</div>
            <Checkbox
              toggle
              onChange={this.setAnnouncements}
              checked={this.state.announcements}
              className={styles.toggle}
            />
          </div>
          <div className={styles.divider} />
          <div className={styles.toggleContainer}>
            <div className={styles.toggleLabel}>
              Notify custom announcements
            </div>
            <Checkbox
              toggle
              onChange={this.setAnnouncementsCustom}
              checked={this.state.announcementsCustom}
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
    state => ({ storage: state.storage })
  )(Announcements)
);
