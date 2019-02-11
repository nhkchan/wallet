import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import * as Icons from "../Icons";
import styles from "./Navbar.css";

var links = [
  { route: "/dashboard", text: "Dashboard", icon: Icons.DashboardIcon },
  { route: "/wallets", text: "Wallets", icon: Icons.WalletIcon },
  { route: "/tokens", text: "Tokens", icon: Icons.TokensIcon },
  { route: "/vote", text: "Vote", icon: Icons.VoteIcon },
  { route: "/games", text: "Vote", icon: Icons.JoystickIcon },
  { route: "/settings", text: "Settings", icon: Icons.SettingsIcon }
];



class Navbar extends Component {

  constructor(props) {
    super(props);
    this.setScreenIdValue = this.setScreenIdValue.bind(this);
  }

  setScreenIdValue(key){
    window.localStorage.setItem("SCREEN_NO", JSON.stringify(key.i));
    }

  render() {

    var isLoggedIn = window.localStorage.getItem("IS_LOGGED_IN");
    if(JSON.stringify(isLoggedIn) === "N"){
      links = [
        { route: "/dashboard", text: "Dashboard", icon: Icons.DashboardIcon }
      ];
    }

    return (
      <nav className={styles.navbar}>

        {links.map((link, i) => (
          <NavLink
            to={link.route}
            key={i}
            activeClassName={styles.active}
            className={styles.link}
            onClick={() => this.setScreenIdValue({i})}
          >
            &nbsp;&nbsp;&nbsp;&nbsp;<link.icon />&nbsp;&nbsp;&nbsp;&nbsp;
            <div className={styles.navBackground} />
          </NavLink>
        ))}
      </nav>
    );
  }
}

export default Navbar;
