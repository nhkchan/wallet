import React, { Component } from "react";
import { Input } from "semantic-ui-react";
import { FormattedNumber } from "react-intl";
import styles from "./VoteAmountSlider.css";

export default class VoteDetails extends Component {
  state = {
    current: 0
  };

  handleChange = (e, { value }) => {
    this.props.onSliderChange(value);
    this.setState({ current: value });
  };

  get sliderWidthCalc() {
    if (this.state.current === 0 || this.props.totalTP === 0) {
      return 0;
    }
    return Math.round((this.state.current / this.props.totalTP) * 100);
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.amount}>
          <FormattedNumber value={parseInt(this.state.current)} /> TP
        </div>
        <div className={styles.sliderContainer}>
          <Input
            className={styles.slider}
            min={0}
            max={this.props.totalTP}
            onChange={this.handleChange}
            type="range"
            value={this.state.current}
          />
          <div
            className={styles.progress}
            style={{ width: this.sliderWidthCalc + "%" }}
          />
          <div className={styles.sliderBG} />
        </div>
        <div className={styles.sliderRange}>
          <span>0 TP</span>
          <span>
            <FormattedNumber value={this.props.totalTP} /> TP
          </span>
        </div>
      </div>
    );
  }
}
