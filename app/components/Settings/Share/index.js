import React, { Component } from "react";
import styles from "./Share.css";

import Secondary from "../../Content/Secondary";
import Header from "../../Header";

import { Button } from "semantic-ui-react";
import buttonStyles from "../../Button.css";

import { ShareIcon, RedditIcon, TwitterIcon, FacebookIcon } from "../../Icons";

export default class Share extends Component {
  // replace with share links later
  goToTwitter = () =>
    require("electron").shell.openExternal("https://twitter.com/");
  goToFacebook = () =>
    require("electron").shell.openExternal("https://facebook.com/");
  goToReddit = () =>
    require("electron").shell.openExternal("https://reddit.com/");

  render() {
    return (
      <Secondary>
        <Header headerName="Share" />
        <div className={styles.container}>
          <ShareIcon className={styles.icon} />
          <div>Share Tron Wallet on social media.</div>
          <div className={styles.subText}>
            Click one of the buttons below to be taken to it's respective
            website to share a post.
          </div>
          <div className={styles.buttonContainer}>
            <Button
              onClick={this.goToFacebook}
              className={`${buttonStyles.iconButton} ${buttonStyles.gradient}`}
            >
              <FacebookIcon />
            </Button>
            <Button
              onClick={this.goToTwitter}
              className={`${buttonStyles.iconButton} ${buttonStyles.gradient}`}
            >
              <TwitterIcon />
            </Button>
            <Button
              onClick={this.goToReddit}
              className={`${buttonStyles.iconButton} ${buttonStyles.gradient}`}
            >
              <RedditIcon />
            </Button>
          </div>
        </div>
      </Secondary>
    );
  }
}
