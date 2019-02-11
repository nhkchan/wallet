import React, {Component} from "react";
import {NavLink, withRouter} from "react-router-dom";
import {Button, Dropdown} from "semantic-ui-react";

import {connect} from "react-redux";
import styles from "./DashboardList.css";
import buttonStyles from "../Button.css";
import LogoIco from '../Tokens/Logo-icon.ico';
import axios from "axios";


class DashboardList extends Component {

  constructor(props){
    super(props);
  }

  componentDidMount() {
    axios.get('https://apilist.tronscan.org/api/stats/overview')
        .then(res => window.localStorage.setItem("TRON_STATISTICS",JSON.stringify(res.data.data)))
        .catch(err => console.log(err))

    axios.get('https://apilist.tronscan.org/api/token?id=1001457')
        .then(res => window.localStorage.setItem("TATM_STATISTICS",JSON.stringify(res.data.data)))
        .catch(err => console.log(err))

    axios.get('https://graphs2.coinmarketcap.com/currencies/tron/')
        .then(res => window.localStorage.setItem("VOLUME",JSON.stringify(res.data)))
        .catch(err => console.log(err))
  }

  render() {
    return (
      <div className={styles.container}>
        <br/>
        <div align="center"><img align="center" src={LogoIco}  width="36" height="36"/></div>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <div className={styles.buttonContainer}>
          <NavLink to="/dashboard/signUp">
            <Button className={`${buttonStyles.button} ${buttonStyles.gradient}`}
            >
              Sign Up
            </Button>
          </NavLink>
          <br/>
          <br/>
          <NavLink to="/dashboard/tatmStatistics">
            <Button className={`${buttonStyles.button} ${buttonStyles.gradient}`}
            >
              TATM Statistics
            </Button>
          </NavLink>
          <br/>
          <br/>
          <NavLink to="/dashboard/tronStatistics">
            <Button className={`${buttonStyles.button} ${buttonStyles.gradient}`}
            >
              Tron Statistics
            </Button>
          </NavLink>
          <br/>
          <br/>
          <NavLink to="/dashboard/representatives">
            <Button className={`${buttonStyles.button} ${buttonStyles.gradient}`}
            >
              Service Representatives
            </Button>
          </NavLink>
          <br/>
          <br/>
          <NavLink to="/dashboard/tronChart">
            <Button className={`${buttonStyles.button} ${buttonStyles.gradient}`}
            >
              Exchange
            </Button>
          </NavLink>
          <br/>
          <br/>
          <NavLink to="/dashboard/tronAnnouncements">
            <Button className={`${buttonStyles.button} ${buttonStyles.gradient}`}
            >
              Announcements
            </Button>
          </NavLink>
        </div>
      </div>
    );
  }
}



export default withRouter(
    connect(
        dispatch => ({})
    )(DashboardList)
);
