import React from "react";
import { Route, Switch } from "react-router-dom";
import { routes } from "../routes";
import styles from "../components/ContentMain.css";

class Sidebar extends React.Component {
  render() {
    return (
      <div className={styles.contentPrimary}>
        <Switch>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              component={route.sidebar}
            />
          ))}
        </Switch>
      </div>
    );
  }
}

export default Sidebar;
