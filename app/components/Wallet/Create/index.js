import React, { Component } from "react";
import { Tab } from "semantic-ui-react";

import styles from "./Creation.css";

import Header from "../../Header";
import Secondary from "../../Content/Secondary";
import CreationContent from "./Create";
import ImportPhrase from "./ImportPhrase";
import LegacyImportPhrase from "./ImportPhraseLegacy";
import ImportKey from "./ImportKey";
import Ledger from "./Ledger";

const panes = [
  {
    menuItem: "Create New Wallet",
    render: () => (
      <Tab.Pane attached={false}>
        <CreationContent />
      </Tab.Pane>
    )
  },
  {
    menuItem: "Import Phrase",
    render: () => (
      <Tab.Pane attached={false}>
        <ImportPhrase />
      </Tab.Pane>
    )
  },
  {
    menuItem: "Import Key",
    render: () => (
      <Tab.Pane attached={false}>
        <ImportKey />
      </Tab.Pane>
    )
  }
];

export default class Creation extends Component {
  render() {
    return (
      <Secondary className={styles.container}>
        <Header headerName="Wallet Creation" />
        <Tab
          className={styles.tabContainer}
          menu={{ secondary: true }}
          panes={panes}
        />
      </Secondary>
    );
  }
}
