import React, { Component } from "react";
import { NavLink, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Button } from "semantic-ui-react";
import { filter, sortBy } from "lodash";
import styles from "./Overview.css";
import buttonStyles from "../../Button.css";
import Token from "./Token";
import { loadTokens } from "../../../actions/tokens";

class Overview extends Component {
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

  componentDidMount() {
    this.props.loadTokens();
  }

  renderToken() {
    let { tokens, searchString } = this.props;
    if (tokens === null || tokens.length === 0) {
      return (
        <div>
          <h1>LOADING</h1>
        </div>
      );
    }

    tokens = filter(
      tokens,
      t => t.name.toUpperCase().indexOf(searchString) !== -1
    );
    tokens = sortBy(tokens, t => t.name);

    return (
      <div className={styles.tokensContainer}>
        {this.state.tokens.length < 1 ? (
          <div className={styles.noResults}>No Tokens Found</div>
        ) : (
          ""
        )}
        {this.state.tokens.map((token, index) => (
          <Token
            key={index}
            tokenName={token.name}
            totalSupply={token.total_supply}
            registered={token.start_time}
          />
        ))}
      </div>
    );
  }

  render() {
    return (
      <div className={styles.container}>
        <input
          className={styles.input}
          placeholder="Search for a token here..."
          onChange={this.filterTokens}
        />
        {this.renderToken()}
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

export default withRouter(
  connect(
    state => ({
      tokens: state.tokens.tokens,
      searchString: state.app.searchString
    }),
    dispatch => ({
      loadTokens: props => {
        dispatch(loadTokens(props));
      }
    })
  )(Overview)
);
