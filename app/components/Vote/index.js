import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { CSSTransitionGroup } from "react-transition-group";
import { Button } from "semantic-ui-react";

import { loadWitnesses } from "../../actions/witnesses";

import Header from "../ContentPrimaryHeader";
import Vote from "./Vote";

import styles from "./VoteList.css";
import buttonStyles from "../Button.css";
import LogoIco from '../Tokens/Logo-icon.ico';

class VoteList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterValue: "",
      witnesses: this.props.witnesses.witnesses
    };
  }

  filterWitness = e => {
    let filtered = this.props.witnesses.witnesses.filter(witness => {
      return witness.url.toLowerCase().includes(e.target.value.toLowerCase());
    });

    this.setState({
      witnesses: filtered
    });
  };

  componentDidMount() {
    this.props.loadWitnesses();
  }

  render() {
    let witnesses = this.state.witnesses;
      window.localStorage.setItem("REPRESENTATIVES_LIST",JSON.stringify(witnesses));

    return (
        <div className={styles.container}>
        <br/>
        <div align="center"><img align="center" src={LogoIco}  width="36" height="36"/></div>
        <br/>
        <Header className={styles.header} text="Representatives :" />
        <input
          className={styles.input}
          placeholder="Search for a Witness here..."
          onChange={this.filterWitness}
        />
        <div className={styles.votesContainer}>
          {witnesses.length < 1 ? (
            <div className={styles.noResults}>No Witnesses Found</div>
          ) : (
            ""
          )}
          <CSSTransitionGroup
            transitionName="fade"
            transitionEnterTimeout={300}
            transitionLeaveTimeout={300}
          >
            {witnesses
              .sort((a, b) => {
                return b.votecount - a.votecount;
              })
              .map((rep, i) => (
                  <Vote
                  key={i}
                  voteLabel={i + 1}
                  voteTitle={
                    rep.ownerAccount && rep.ownerAccount.account_name
                      ? rep.ownerAccount.account_name
                      : rep.url
                  }
                  lastBlock={rep.latestblocknum}
                  blocksProduced={rep.totalproduced}
                  blocksMissed={rep.totalmissed}
                  totalVote={rep.votecount}
                  address={rep.address}
                />              
              ))}
          </CSSTransitionGroup>
        </div>
        <div className={styles.buttonContainer}>
          <NavLink to="/vote/voting/">
            <Button
              className={`${buttonStyles.button} ${buttonStyles.gradient}`}
            >
              Start Voting
            </Button>
          </NavLink>
        </div>
        </div>
    );
  }
}

export default connect(
  state => ({
    witnesses: state.witnesses,
    router: state.router
  }),
  dispatch => ({
    loadWitnesses: () => {
      dispatch(loadWitnesses(dispatch));
    }
  })
)(VoteList);
