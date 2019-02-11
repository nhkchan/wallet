import React, { Component } from "react";
import styles from "./DatePicker.css";
import DatePickerReact from "react-datepicker";
import moment from "moment";

export default class DatePicker extends Component {
  state = {
    startDate: moment().subtract(1, "years"),
    endDate: moment().add(5, "years")
  };

  handleChangeStart = date => this.setState({ startDate: date });
  handleChangeEnd = date => this.setState({ endDate: date });

  render() {
    return (
      <div className={styles.datePicker}>
        <DatePickerReact
          selected={this.state.startDate}
          selectsStart
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          onChange={this.handleChangeStart}
        />
        <DatePickerReact
          selected={this.state.endDate}
          selectsEnd
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          onChange={this.handleChangeEnd}
        />
      </div>
    );
  }
}
