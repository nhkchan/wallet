import React, {Component} from "react";
import {Input, Form} from "semantic-ui-react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import TronWeb from 'tronweb';
import backupStyles from '../../Backup/Backup.css';

import styles from "./CreationContent.css";
import {createWallet, addAccount, generateTronLinkCompatibleAccount} from "../../../../actions/wallet";
import buttonStyles from "../../../Button.css";

import MainModal from "../../../Content/DarkMainModal";
import axios from 'axios';

const CREATE_STATUS = {
  NEW: 1,
  BACKUP: 2,
  PROVING_BACKUP: 3
};

class CreationContent extends Component {
  state = {};
  toggleRadio = (e, {value}) => this.setState({value});
  setWalletHot = type => this.setState({walletType: 0});
  setWalletCold = type => this.setState({walletType: 1});
  setWalletName = (e, {value}) => this.setState({walletName: this.state.tdnsName + "@tatm"});
  setTDNSName = (e, {value}) => this.setState({setTDNSName: value});

  constructor() {
    super();
    this.onClickCreate = this.onClickCreate.bind(this);

    this.state = {
      newAccount: false,
      walletName: null,
      proofWords: [],
      proofWordsInput: [],
      status: CREATE_STATUS.NEW,
      error: '',
      tdnsName:'',
      walletError:'',
      TDNSError:''
    }
  }

  resetErrors(){
    this.setState({
      error: '',
      walletError:'',
      TDNSError:''
    });
  }

  async onClickCreate() {
    this.resetErrors();
    let validForm=true

    let TDNSName=this.state.setTDNSName;
    if(TDNSName==null||TDNSName==""){
      this.setState({TDNSError:"Please enter a unique address for your wallet.\nEg: johndoe (The address will be xxxx@tatm)"});
      validForm=false;
    }

    if(!validForm){
      return;
    }
    this.state.walletName=TDNSName + "@tatm";

    let URL = process.env.REACT_APP_TDNS_HOSTNAME + "TDNSNAME=" + this.state.setTDNSName + "@tatm";
    var status = false;
    await axios.get(URL, { headers: { "x-api-key": process.env.REACT_APP_X_API_KEY } }).then(response => {
        var resp = response.data;
        if(resp.Count == 0){
          // Need to add a post call here to actually create the TDNS entry. The above one is just a Get call to check if the name exists.

          status = true;
        }else{
          this.setState({TDNSError:"This name is already taken , please try again."});
          status=false;
        }
      })
      .catch((error) => {
        alert('error:' + error);
      });

      if(status == true){

        const newAccount = await generateTronLinkCompatibleAccount();
        this.setState({
          newAccount,
          status: CREATE_STATUS.BACKUP
        });

        var tdnsName = this.state.setTDNSName + "@tatm";
        var walletAddress = this.state.newAccount.publicKey;

        await axios.post(URL, {"tdnsName":tdnsName,"walletAddress":walletAddress, "email":"abc@gmail.com"},{ headers: { "x-api-key": process.env.REACT_APP_X_API_KEY } }).then(response => {

        })
        .catch((error) => {
          alert('error:' + error);
        });
      }
  }

  async onBackedUp() {
    this.setState({
      status: CREATE_STATUS.PROVING_BACKUP,
      error: '',
      proofWords: [],
      proofWordsInput: this.shuffle(this.state.newAccount.words.slice())
    });
  }



  async changeStatus(newStatus) {
    this.setState({
      status: newStatus
    });
  }

  inputAlphanumeric(e) {
    if (!/^[a-zA-Z0-9]+$/.test(e.key)) {
      e.preventDefault();
    }
  }

  onDeselect(word) {
    this.setState({
      proofWords: this.state.proofWords.filter(e => e !== word),
      proofWordsInput: [...this.state.proofWordsInput, word]
    });
  }

  onSelect(word) {
    this.setState({
      proofWords: [...this.state.proofWords, word],
      proofWordsInput: this.state.proofWordsInput.filter(e => e !== word)
    });
  }

  renderProofWords() {
    return this.state.proofWords.map((word, i) => {
      return (
        <span className={styles.proofWord} key={i} onClick={() => this.onDeselect(word)}><span>{i + 1}.</span> {word}</span>
      )
    });
  }

  renderProofWordsInput() {
    return this.state.proofWordsInput.map((word, i) => {
      return (
        <span className={styles.proofWord} key={i} onClick={() => this.onSelect(word)}>{word}</span>
      )
    });
  }

  async finishCreation() {
    const chosenOrderString = this.state.proofWords.join(' ').trim();
    let correctWords = (chosenOrderString === this.state.newAccount.wordList);

    if (correctWords) {
      await this.props.addAccount(this.props, this.state.walletName, this.state.newAccount);
    } else {
      this.setState({
        error: 'Wrong order.'
      });
    }
  }

  renderProveBackup() {
    if (this.state.status !== CREATE_STATUS.PROVING_BACKUP)
      return '';

    return (
      <div className={styles.container}>
        <p className={styles.header}>Please click the words in correct order to verify your backup.</p>
        <p className={styles.error}>{this.state.error}</p>

        <div className={styles.proofWordsContainer}>
          {this.renderProofWordsInput()}
        </div>

        <p className={styles.header}>Selected Order</p>
        <div className={styles.selectedProofWordsContainer}>
          {this.renderProofWords()}
        </div>

        <div className={styles.buttonContainer}>
          <Form.Button
            onClick={() => this.changeStatus(CREATE_STATUS.BACKUP)}
            className={`${styles.btn} ${buttonStyles.button} ${ buttonStyles.black } ${buttonStyles.half}`}>
            Back
          </Form.Button>
          <Form.Button
            onClick={() => this.finishCreation()}
            className={`${styles.btn} ${buttonStyles.button} ${ buttonStyles.black } ${buttonStyles.half}`}>
            Finish
          </Form.Button>
        </div>
      </div>
    )
  }

  /**
   * Shuffles array in place.
   * @param {Array} a items An array containing the items.
   */
  shuffle(a) {
    return a.sort();
  }

  renderBackup() {
    if (this.state.status !== CREATE_STATUS.BACKUP)
      return '';

    return (
      <div className={styles.container}>
        <div className={backupStyles.subHeader}>
          CAREFULLY WRITE DOWN THESE WORDS :
        </div>
        {this.renderWords(this.state.newAccount)}
        <div className={backupStyles.seedHeader}>PRIVATE KEY :</div>
        <div className={backupStyles.privatekey}>{this.state.newAccount.privateKey}</div>
        <div className={styles.buttonContainer}>

          <Form.Button
            onClick={() => this.changeStatus(CREATE_STATUS.NEW)}
            className={`${styles.btn} ${buttonStyles.button} ${ buttonStyles.black } ${buttonStyles.half}`}>
            Back
          </Form.Button>
          <Form.Button
            onClick={() => this.onBackedUp()}
            className={`${styles.btn} ${buttonStyles.button} ${ buttonStyles.black } ${buttonStyles.half}`}>
            Next
          </Form.Button>
        </div>
      </div>
    )
  }

  renderSpan(words, start) {
    let output = [];
    for (let i = 0; i < words.length; i++) {
      output.push(
        <div key={i} className={backupStyles.word}>
          <span>{start + i}: </span>
          {words[i]}
        </div>
      );
    }
    return output;
  }

  renderWords(account) {
    console.log('rendering words for');
    console.log(account);
    if (account.words && account.words.length === 24) {
      return (
        <div className={backupStyles.wordContainer}>
          <div className={backupStyles.wordColumn}>
            {this.renderSpan(account.words.slice(0, 12), 1)}
          </div>
          <div className={backupStyles.wordColumn}>
            {this.renderSpan(account.words.slice(12, 24), 13)}
          </div>
        </div>
      );
    }
  }

  renderCreate() {
    if (this.state.status !== CREATE_STATUS.NEW)
      return '';

    return (
      <div className={styles.container}>
        <div className={styles.header}>CREATE A NEW WALLET :</div>
        <Form className={styles.form}>
          <Form.Field>
            <span className={styles.error}>{this.state.TDNSError}</span>
            <Input
              className={styles.input}
              placeholder="Enter Unique Name for your Wallet Address"
              onKeyPress={this.inputAlphanumeric}
              onChange={this.setTDNSName}
            />
          </Form.Field>
          <Form.Button
            onClick={this.onClickCreate}
            className={`${styles.btn} ${buttonStyles.button} ${
              buttonStyles.black
              }`}
          >
            Create
          </Form.Button>
        </Form>
      </div>);
  }

  render() {
    return (
      <div>
        {this.renderBackup()}
        {this.renderCreate()}
        {this.renderProveBackup()}
      </div>
    );
  }
}

export default withRouter(
  connect(
    state => ({wallet: state.wallet}),
    dispatch => ({
      createWallet: (props, walletName) => {
        dispatch(createWallet(props, walletName));
      },
      addAccount: (props, walletName, newAccount) => {
        addAccount(props, walletName, dispatch, newAccount);
      }
    })
  )(CreationContent)
);
