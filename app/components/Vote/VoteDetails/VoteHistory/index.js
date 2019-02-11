import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import styles from "./VoteList.css";
import Vote from "./Vote";

//const TronHttpClient = require("tron-http-client");
//import {participationToTokens} from "../../../utils/currency";

//const client = new TronHttpClient();

class voteList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterValue: ""
    };
  }

  render() {
    let addresses = Object.keys(this.props.wallet.persistent.accounts);
    let votes = [];
    for (let i = 0; i < addresses.length; i++) {
      let address = addresses[i];
      let account = this.props.wallet.persistent.accounts[address];
      for (let j = 0; j < account.transactions.length; j++) {
        let transaction = account.transactions[j];
        if (transaction.contract_desc === "VoteWitnessContract") {
          votes.push({
            _id: transaction._id,
            url: transaction.witness
              ? transaction.witness.owner_address +
                " - " +
                transaction.witness.url
              : "-",
            amount:
              transaction.votes.length > 0
                ? transaction.votes[0].vote_count
                : 0,
            date: transaction.timestamp
          });
        } else {
        }
      }
    }

    return (
      <div className={styles.voteList}>
        {votes.map((vote, i) => (
          <Vote
            key={vote._id}
            txID={vote._id}
            url={vote.url}
            amount={vote.amount}
            date={vote.date}
          />
        ))}
      </div>
    );
  }
}

export default withRouter(
  connect(
    state => ({ wallet: state.wallet }),
    dispatch => ({})
  )(voteList)
);
