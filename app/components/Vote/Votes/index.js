import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { sortBy, isNaN, sumBy } from "lodash";
import Secondary from "../../Content/Secondary";
import Header from "../../Header";
import { Dropdown, Button, Table, Input } from "semantic-ui-react";
import { ArrowRightIcon } from "../../Icons";
import { loadWitnesses } from "../../../actions/witnesses";
import { PopupModal } from "../../Content/PopupModal";
import buttonStyles from "../../Button.css";

import styles from "./style.css";

import Transport from "@ledgerhq/hw-transport-node-hid";
import AppTron from "../../../utils/ledger/Tron";
import { toHexString } from "../../../utils/hex";
const { hexToBase64 } = require("../../../utils/ledger/utils");
const tools = require("tron-http-tools");

const TronHttpClient = require("tron-http-client");

class VoteMultiple extends Component {
  constructor(props) {
    super(props);

    this.state = {
      votes: {},
      witnesses: this.props.witnesses.witnesses,
      wallets: [],
      selectedWallet: {
        text: "Select a Wallet",
        value: "",
        frozenBalance: 0,
        lastVotes: {}
      },
      sendProperties: {}
    };
  }

  setVote = (address, numberOfVotes) => {
    let { votes } = this.state;

    if (numberOfVotes !== "") {
      numberOfVotes = parseInt(numberOfVotes);
      numberOfVotes = isNaN(numberOfVotes) ? "" : numberOfVotes;

      if (numberOfVotes < 0) {
        numberOfVotes = 0;
      }
    }

    let { votesAvailable } = this.getVoteUpdate();
    votesAvailable += votes[address] || 0;

    if (numberOfVotes > votesAvailable) {
      numberOfVotes = votesAvailable;
    }

    votes[address] = numberOfVotes;
    this.setState({
      votes
    });
  };

  getVoteUpdate = () => {
    let { wallets } = this.props;
    let { votes } = this.state;

    let frozenBalance = this.state.selectedWallet.frozenBalance;
    let votesCount = sumBy(Object.values(votes), vote => parseInt(vote));
    let votesAvailable = frozenBalance - votesCount;
    let spendAll = votesCount > 0 && votesAvailable === 0;
    let voteState = 0;

    if (votesAvailable > 0) {
      voteState = 1;
    } else if (votesAvailable < 0) {
      voteState = -1;
    }

    if (frozenBalance === 0) {
      voteState = -2;
    }

    return {
      frozenBalance,
      votesCount,
      votesAvailable,
      spendAll,
      voteState,
      votePercentage: (votesCount / frozenBalance) * 100
    };
  };

  renderVoteUpdate() {
    let { votesAvailable, voteState } = this.getVoteUpdate();
    switch (voteState) {
      case 0:
        return <span>All vote are currently used</span>;

      case 1:
        return (
          <span>
            Votes left:&nbsp;<b>{votesAvailable} TP</b>
          </span>
        );
      case -1:
        return <span>You have to much vote placed</span>;

      case -2:
        return <span>You need TP to vote</span>;
    }
  }

  componentDidMount() {
    this.props.loadWitnesses();
  }

  async clickSubmit() {
    let address = this.state.witnesses.address;
    let count = parseInt(this.state.count);
    this.setState({
      ...this.state,
      sendProperties: {
        address: this.state.witnesses.address,
        count: parseInt(this.state.count)
      },
      showConfirmModal: true,
      modalConfirmText: `You are about to submit your votes do you confirm ?`
    });
  }

  updateCurrentAccountTransactions(account) {
    let votes = {};
    for (let t in account.transactions) {
      let transaction = account.transactions[t];
      if (transaction.contract_desc === "VoteWitnessContract") {
        for (let v in transaction.votes) {
          let vote = transaction.votes[v];
          votes[vote.vote_address] = parseInt(vote.vote_count);
        }
        break;
      }
    }

    this.setState({
      votes
    });
    return account;
  }

  selectWallet = (e, { value }) => {
    let accounts = this.props.wallet.persistent.accounts;
    let wallet = Object.keys(accounts).filter(
      wallet => accounts[wallet].publicKey === value
    );
    let account = this.updateCurrentAccountTransactions(accounts[wallet[0]]);
    this.setState({ selectedWallet: account });
  };

  async ledgerSign(path, rawTxHex, address) {
    while (this.state.showLedgerModal){
      try {
        console.log(path);
        const transport = await Transport.create();
        const tron = new AppTron(transport);
        const result = await tron.getAddress(path, false);
        if (result.address !== address)
          return {error: true, message: "Address does not match!"}
        
        const signature = await tron.signTransaction(path, rawTxHex);
    
        return { error: false, message: new Uint8Array(signature) } 
      } catch (error) {
        console.log(error);

        if( (this.state.showLedgerModal) && (error.message.indexOf("denied by the user") > -1)) {
          return {error: true, message: "Canceled by user on ledger!"}
        }
        //return {error: true, message: "error"}
      }
    }
  }

  async voteWithLedger(witVotes){
    let client = new TronHttpClient();
    let response = null;
    let hex = null;
    let transaction = null;
    try {
        // Get Transaction hash
        transaction = await tools.transactions.createUnsignedVoteWitnessTransaction(
          {
            ownerAddress: this.state.selectedWallet.publicKey,
            votes: witVotes,
          },
          await client.getLastBlock()
        );
        
        // Convert to HEX string
        hex = toHexString(transaction.getRawData().serializeBinary());
        // Sign on Ledger
        let result = await this.ledgerSign(this.state.selectedWallet.ledgerPath, hex, this.state.selectedWallet.publicKey)
        // Transmit
        if (typeof result === 'undefined') return;
        if (!result.error){
          if (!this.state.showLedgerModal) return;
          // Add signature
          transaction.addSignature(result.message);
          hex = toHexString(transaction.serializeBinary());
          let b64 = hexToBase64(hex);
          response = await client.broadcastBase64Transaction(b64);
        }else{
          this.setState({
            ...this.state,
            sendProperties: {},
            showConfirmModal: false,
            showFailureModal: true,
            showLedgerModal: false,
            modalFailureText: result.message,
          });
          return;
        }
       
    } catch (e) {
      console.log(e);
    }
    this.updateTransferResponse(response);
  }

  async modalConfirm() {
    let { votes } = this.state;
    let witVotes = [];

    for (let address of Object.keys(votes)) {
      let count = parseInt(votes[address]);
      if (count > 0) {
        witVotes.push({
          address: address,
          count: count
        });
      }
    }

    if (this.state.selectedWallet.ledger){
      this.setState({
        ...this.state,
        showConfirmModal: false,
        showLedgerModal: true,
      });
      this.voteWithLedger(witVotes);
    } else {
      let client = new TronHttpClient();
      let response = await client
        .vote(this.state.selectedWallet.privateKey, witVotes)
        .catch(x => null);

      updateTransferResponse(response);
    }
  }

  updateTransferResponse(response){
    if (response === null) {
      this.setState({
        ...this.state,
        showConfirmModal: false,
        showFailureModal: true,
        showLedgerModal: false,
        modalFailureText: "Voting failed"
      });
    } else if (response.result !== true) {
      this.setState({
        ...this.state,
        showConfirmModal: false,
        showFailureModal: true,
        showLedgerModal: false,
        modalFailureText: "Voting failed: " + response.message
      });
    } else {
      this.setState({
        ...this.state,
        showConfirmModal: false,
        showSuccessModal: true,
        showLedgerModal: false,
        modalSuccessText: "Vote Successful!"
      });
    }
  }

  modalDecline() {
    this.setState({
      ...this.state,
      sendProperties: {},
      showConfirmModal: false
    });
  }

  modalFailureClose() {
    this.setState({
      ...this.state,
      showFailureModal: false
    });
  }

  modalLedgerCancel() {
    this.setState({
      ...this.state,
      showFailureModal: true,
      modalFailureText: "Voting failed",
      showLedgerModal: false
    });
  }

  modalSuccessClose() {
    this.props.history.push(
      "/wallets/walletDetails/" + this.state.accountAddress
    );
    this.setState({
      ...this.state,
      showSuccessModal: false
    });
  }

  modalClose() {
    this.state.showConfirmModal = false;
  }

  getVotesFor(witnessAddress) {
    if (this.state.selectedWallet.lastVotes[witnessAddress])
      return this.state.selectedWallet.lastVotes[witnessAddress];
  }

  resetVotes = () => {
    this.setState({
      votes: {}
    });
  };

  render() {
    let { selectedWallet, votes, witnesses } = this.state;

    let accountId = this.props.match.params.account;
    let accounts = this.props.wallet.persistent.accounts;
    let wallets = [];
    Object.keys(accounts).forEach((wallet, i) => {
      let formattedObj = {
        text: accounts[wallet].name,
        value: accounts[wallet].publicKey
      };
      wallets.push(formattedObj);
    });

    let { frozenBalance } = this.getVoteUpdate();

    witnesses = sortBy(witnesses, w => w.votecount * -1).map((w, index) => ({
      ...w,
      rank: index
    }));

    return (
      <Secondary className={styles.container}>
        <div className={styles.headerContainer}>
          <Header headerName="Place your vote" />
          <div className={styles.headerTP}>{this.renderVoteUpdate()}</div>
          <div className={styles.headerText}>
            Earn More TronPower by freezing Tron
          </div>
          <div className={styles.headerSubText}>
            You can do this by clicking on "Freeze TRX" after selecting a
            wallet.
          </div>
        </div>
        <div className={styles.voteContainer}>
          <div className={styles.dropdown}>
            <ArrowRightIcon />
            <Dropdown
              fluid
              selection
              onChange={this.selectWallet}
              placeholder="Choose Wallet"
              options={wallets}
            />
          </div>

          <div className={styles.voteTable}>
            <div className={styles.voteHeader}>
              <div className={styles.voteCol1}>#</div>
              <div className={styles.voteCol2}>Name</div>
              <div className={styles.voteCol3}>Current Votes</div>
              <div className={styles.voteCol4}>Your Votes</div>
            </div>
            <div className={styles.voteBody}>
              {witnesses.map(rep => (
                <div className={styles.voteRow} key={rep.address}>
                  <div className={styles.voteCol1}>{rep.rank + 1}-</div>
                  <div className={styles.voteCol2}>
                    <div className={styles.voteName}>
                      {rep.ownerAccount && rep.ownerAccount.account_name
                        ? rep.ownerAccount.account_name
                        : rep.url}
                    </div>
                    <div className={styles.voteAddress}>{rep.address}</div>
                  </div>
                  <div className={styles.voteCol3}>
                    {rep.votecount.toLocaleString()}
                  </div>
                  <div className={styles.voteCol4}>
                    <Input
                      type="text"
                      className={styles.voteInput}
                      value={votes[rep.address] || ""}
                      onChange={event =>
                        this.setVote(rep.address, event.target.value)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.buttonContainer}>
            <Button
              onClick={this.resetVotes.bind(this)}
              className={`${buttonStyles.button} ${buttonStyles.black}`}
            >
              Reset
            </Button>
            <Button
              onClick={this.clickSubmit.bind(this)}
              className={`${buttonStyles.button} ${buttonStyles.gradient}`}
            >
              Submit
            </Button>
          </div>
        </div>
        <PopupModal
          confirmation
          modalVis={this.state.showConfirmModal}
          modalText={this.state.modalConfirmText}
          closeModalFunction={this.modalClose.bind(this)}
          modalConfirm={this.modalConfirm.bind(this)}
          modalDecline={this.modalDecline.bind(this)}
        />
        <PopupModal
          failure
          modalVis={this.state.showFailureModal}
          modalText={this.state.modalFailureText}
          closeModalFunction={this.modalFailureClose.bind(this)}
          modalConfirm={this.modalFailureClose.bind(this)}
        />
        <PopupModal
          success
          modalVis={this.state.showSuccessModal}
          modalText={this.state.modalSuccessText}
          closeModalFunction={this.modalSuccessClose.bind(this)}
          modalConfirm={this.modalSuccessClose.bind(this)}
        />
        <PopupModal
            waitForLedger
            modalVis={this.state.showLedgerModal}
            modalText="Please open Tron App and confirm transaction on ledger"
            modalLedgerCancel={this.modalLedgerCancel.bind(this)}
          />
      </Secondary>
    );
  }
}

export default withRouter(
  connect(
    state => ({
      wallet: state.wallet,
      witnesses: state.witnesses
    }),
    dispatch => ({
      loadWitnesses: props => {
        dispatch(loadWitnesses(props));
      }
    })
  )(VoteMultiple)
);
