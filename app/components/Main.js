import React from "react";
import { Route, Switch } from "react-router-dom";
import { routes } from "../routes";
import styles from "../components/ContentMain.css";

class Main extends React.Component {

  render() {
    return (
      <div id="contentSecondary" className={styles.contentSecondary}>
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            exact={route.exact}
            component={route.main}
          />
        ))}
      </div>
    );
  }
}

export default Main;
