import _ from "lodash";
import React, { Component } from "react";
import styles from "./SearchBar.css";

import { Search } from "semantic-ui-react";
import { QRScanIcon } from "../../Icons";

const contacts = [
  { title: "12336538736hnouihngs", name: "Jake Weary" },
  { title: "1233652jdglksngs978e793", name: "Mom" },
  { title: "1333652jdglksngs978e793", name: "Dad" },
  { title: "1033652jdglksngs978e793", name: "Mag" },
  { title: "1633652jdglksngs978e793", name: "Dog" },
  { title: "1433652jdglksngs978e793", name: "Test" }
];

export default class SearchBar extends Component {
  componentWillMount() {
    this.resetComponent();
  }

  resultRenderer({ title, name }) {
    return (
      <div className={styles.resultContainer}>
        <div className={styles.resultAddress}>
          <span>ADDRESS : </span>
          {title}
        </div>
        <div className={styles.resultName}>
          <span>NAME : </span>
          {name}
        </div>
      </div>
    );
  }

  resetComponent = () =>
    this.setState({ isLoading: false, results: [], value: "" });

  handleResultSelect = (e, { result }) =>
    this.setState({ value: result.title });

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value });

    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetComponent();

      const re = new RegExp(_.escapeRegExp(this.state.value), "i");
      const isMatch = result => re.test(result.title) || re.test(result.name);

      this.setState({
        isLoading: false,
        results: _.filter(contacts, isMatch)
      });
    }, 300);
  };
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.qrScan}>
          <QRScanIcon />
        </div>
        <Search
          className={styles.searchBar}
          loading={this.state.isLoading}
          onResultSelect={this.handleResultSelect}
          onSearchChange={_.debounce(this.handleSearchChange, 500, {
            leading: true
          })}
          results={this.state.results}
          value={this.state.value}
          placeholder="Enter TRX Address to Send to"
          resultRenderer={this.resultRenderer}
        />
      </div>
    );
  }
}
