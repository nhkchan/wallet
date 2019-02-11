import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import styles from "./Ledger.css";

import { addAccount, addWatchOnlyAccount } from "../../../../actions/wallet";
import { Checkbox, Input, Form, Button } from "semantic-ui-react";
import buttonStyles from "../../../Button.css";

import {PulseLoader, SyncLoader} from "react-spinners";
import {delay} from "../../../../utils/ledger/utils";
import Transport from "@ledgerhq/hw-transport-node-hid";
import AppTron from "../../../../utils/ledger/Tron";

const TronHttpClient = require("tron-http-client");
const client = new TronHttpClient();

const getTronAddress = async (path, display) => {
  try {
    const transport = await Transport.create();
    const tron = new AppTron(transport);
    const result = await tron.getAddress(path, display);
    return { connected: true, address: result } 
  } catch (error) {
    console.log(error);
    return { connected: false, address: {} } 
  }
};


class Import extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      connected: false,
      addressList: [],
    };
  }

  /*doesn't check checksum*/
  addressIsValid(address) {
    if (!address[0] === "T") return false;
    return address.length === 34;
  }

  importKey = (value) => {
    if (this.addressIsValid(value.address)) {
      let newAccount = {
        watchonly: true,
        ledger: true,
        path: value.path,
        address: value.address
      };
      let accountName = "Ledger " + value.address;
      this.props.addAccount(this.props, accountName, newAccount);
    } else {
      console.log("public key not valid.");
    }
  };

  

  componentDidMount() {
    this._isMounted = true;
    this.checkForConnection();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  checkForConnection = async () => {
    this.setState({ loading: true });
    
    while (this._isMounted) {
      let path = "44'/195'/"+this.state.addressList.length+"'/0/0"
      let {connected, address} = await getTronAddress(path, false);
      if (connected) {
        address.path = path;
        let addressList = this.state.addressList;
        addressList.push(address);
     
        this.setState({
          connected: connected,
          addressList: addressList,
        });
        // Check if address is activated, load next if true, else break
        let acc = await client.getAccount(address.address);
        if ( typeof acc === 'undefined' || acc.trx==0 )
          break;
      }
      await delay(500);
    }
    this.setState({ loading: false });
  };


  createAddressList(start, end) {
    let output = [];
    for (let i = 0; i < this.state.addressList.length; i++) {
      
      output.push(
        <div className={styles.addressContainer}>
                    <div className={styles.addressColumn}>
                      {this.state.addressList[i].address}
                    </div>
                    <div className={styles.addressColumn}>
                      <Button
                        onClick={() => { this.importKey(this.state.addressList[i], i) }}
                        className={`${styles.btn} ${buttonStyles.button} ${
                          buttonStyles.black
                        }`}>
                        Import
                      </Button>
                    </div>
                  </div>
      );
    }
    return output;
  }

  render() {
    let {loading, connected} = this.state;
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <img src={require("../../../../assets/images/ledger-nano-s.png")} style={{ height: 65}} />
        </div>

        { !connected && loading &&
          <div className={styles.header}>
            <p className={styles.header}>Open the Tron app on your Ledger</p>           
            <PulseLoader color="#343a40" loading={true} height={5} width={150} /> 
          </div>
        }
        {
          connected && loading &&
          <div className={styles.header}>
            <p className={styles.header}>Ledger Connected, searching addresses</p>           
            <SyncLoader color="#343a40" loading={true} height={5} width={150} /> 
          </div>
        }
        {
          connected &&
          <Form className={styles.form}>
          { this.createAddressList() }
          </Form>
        }

      </div>
    );
  }
}

export default withRouter(
  connect(
    state => ({
      wallet: state.wallet,
      activeLanguage: state.app.activeLanguage,
      availableLanguages: state.app.availableLanguages
    }),
    dispatch => ({
      addAccount: (props, accountName, newAccount) => {
        return addAccount(props, accountName, dispatch, newAccount);
      },
      addWatchOnlyAccount: (props, accountName, dispatch, publicKey) => {
        return addWatchOnlyAccount(props, accountName, dispatch, publicKey);
      }
    })
  )(Import)
);
