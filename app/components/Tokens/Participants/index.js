import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Participants.css";

import { Button } from "semantic-ui-react";
import buttonStyles from "../../Button.css";

import Token from "./Token";

export default class Participants extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterValue: "",
      tokens: this.props.tokens
    };
  }

  filterTokens = e => {
    alert(e.target.value);
    let filtered = this.props.tokens.filter(token => {
      return token.name.includes(e.target.value);
    });

    this.setState({
      tokens: filtered
    });
  };

  render() {
    return (
      <div className={styles.container}>
        <input
          className={styles.input}
          placeholder="Search for a token here..."
          onChange={this.filterTokens}
        />
        <div className={styles.tokensContainer}>
          {this.state.tokens.length < 1 ? (
            <div className={styles.noResults}>No Tokens Found</div>
          ) : (
            ""
          )}
          {this.state.tokens.map((token, index) => {
            return (
              <Token
                key={index}
                tokenName={token.name}
                tokenURL={token.url}
                totalIssued={token.totalIssued}
                totalSupply={token.totalSupply}
                endTime={Date.now() + 5000000000}
              />
            );
          })}
        </div>
        <div className={styles.buttonContainer}>
          <NavLink to="/tokens/createtoken">
            <Button
              className={`${buttonStyles.button} ${buttonStyles.gradient}`}
            >
              Create New Token
            </Button>
          </NavLink>
        </div>
      </div>
    );
  }
}
