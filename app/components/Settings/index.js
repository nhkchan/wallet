import React, { Component } from "react";
import styles from "./SettingList.css";
import Header from "../ContentPrimaryHeader";
import CategoryHeader from "./CategoryHeader";
import CategoryChild from "./CategoryChild";
import LogoIco from '../Tokens/Logo-icon.ico';
import {
  ShareIcon,
  BellIcon,
  WebGlobeIcon,
  WifiIcon,
  PencilIcon
} from "../Icons";

export default class SettingList extends Component {
  goToSupport = () =>
    require("electron").shell.openExternal("https://support.tron.watch/");
  render() {
    return (
      <div className={styles.container}>
        <br/>
        <div align="center"><img align="center" src={LogoIco}  width="36" height="36"/></div>
        <br/>
        <Header text="Configurations :" />
        <CategoryHeader text="General">
          <CategoryChild
            text="Share Tron Wallet"
            icon={<ShareIcon />}
            routeTo="/settings/share"
          />
          <CategoryChild
            text="Feedback"
            icon={<PencilIcon />}
            routeTo="/settings/feedback"
          />
        </CategoryHeader>
        <CategoryHeader text="Preferences">
          <CategoryChild
            text="Notifications"
            icon={<BellIcon />}
            routeTo="/settings/notifications"
          />
        <CategoryChild
            text="Announcements"
            icon={<BellIcon />}
            routeTo="/settings/announcements"
        />
          <CategoryChild
            text="Language"
            subText="English"
            icon={<WebGlobeIcon />}
            routeTo="/settings/language"
          />
        </CategoryHeader>
      </div>
    );
  }
}
