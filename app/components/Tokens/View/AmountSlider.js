import React, { Component } from "react";
import { FormattedNumber } from "react-intl";
import { Input } from "semantic-ui-react";
import styles from "./AmountSlider.css";
import { dropsToTrx } from "../../../utils/currency";

export default class AmountSlider extends Component {
  state = {
    current: 0
  };

  handleChange = (e, { value }) => {
    if (value) {
      this.props.onSliderChange(value, this.state.ratio);
      this.setState({ current: value });
    } else {
      this.props.onSliderChange(0);
      this.setState({ current: 0 });
    }
  };

  get sliderWidthCalc() {
    if (this.state.current === 0 || this.props.totalTRX === 0) {
      return 0;
    }
    return Math.round((this.state.current / this.state.assetPossible) * 100);
  }

  renderUsd(amount) {
    if (amount <= 0) return "0.00 USD";
    return (
      <div className={styles.amountSub}>
        {parseFloat(amount).toLocaleString()} USD
      </div>
    );
  }

  render() {
    this.state.ratio =
      this.props.assetNum / parseInt(dropsToTrx(this.props.trxNum));
    this.state.assetPossible =
      this.state.ratio * parseInt(dropsToTrx(this.props.totalTRX));
    return (
      <div className={styles.container}>
        <div className={styles.amount}>
          <Input
            type="number"
            min={0}
            max={this.state.assetPossible}
            className={styles.input}
            value={this.state.current}
            onChange={this.handleChange}
          />
          <div className={styles.amountLabel}>{this.props.tokenLabel}</div>
        </div>
        <div className={styles.price}>{this.renderUsd(this.props.usd)}</div>
        <div className={styles.price}>
          <div className={styles.amountSub}>
            {this.state.current / this.state.ratio} TRX
          </div>
        </div>
        <div className={styles.sliderContainer}>
          <Input
            className={styles.slider}
            min={0}
            max={this.state.assetPossible}
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
          <span>0 {this.props.tokenLabel}</span>
          <span>
            <FormattedNumber value={this.state.assetPossible} />{" "}
            {this.props.tokenLabel}
          </span>
        </div>
      </div>
    );
  }
}
