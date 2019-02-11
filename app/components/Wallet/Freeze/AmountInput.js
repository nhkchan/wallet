import React, { Component } from "react";

export default class AmountInput extends Component {
  onChange(event) {
    this.props.onSetAmount(event.target.value);
  }

  render() {
    return (
      <input
        onChange={this.onChange.bind(this)}
        type="number"
        placeholder="0.00000000"
        required
      />
    );
  }
}
