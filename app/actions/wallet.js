const TronHttpClient = require("tron-http-client");
const TronHttpTools = require("tron-http-tools");
const crypto = require("crypto");
const client = new TronHttpClient();
const Decimal = require("decimal.js").Decimal;
const fs = require('fs');

import AccountHandler from './lib/AccountHandler';

export const SET_TOKEN_BALANCES = "SET_TOKEN_BALANCES";
export const INIT = "INIT";
export const INITIALIZATION_NEED_DECRYPTION = "AWAITING_DECRYPTION";
export const FINISH_INITIALIZATION = "FINISH_INITIALIZATION";
export const UPDATE_ALL_ACCOUNTS = "UPDATE_ALL_ACCOUNTS";
export const UPDATE_TRANSACTIONS = "UPDATE_TRANSACTIONS";

const LOCALSTORAGE_KEY = "TRON_WATCH";
const algorithm = "aes-256-ctr";

export const WALLET_STATE = {
  NEEDS_LOADING: "NEEDS_LOADING",
  NO_WALLET: "NO_WALLET",
  NEEDS_USER_PASSWORD: "NEEDS_USER_PASSWORD",
  NEEDS_USER_UNLOCK: "NEEDS_USER_UNLOCK",
  READY: "READY"
};

export const setTokenBalances = (tokens = [], frozen = {}) => ({
  type: SET_TOKEN_BALANCES,
  tokens,
  frozen
});

function verifyPersistent(persistent) {
  if (!("accounts" in persistent)) {
    console.log("persistent.accounts missing");
    return false;
  }

  return true;
}

function encrypt(text, password) {
  let cipher = crypto.createCipher(algorithm, password);
  let crypted = cipher.update(text, "utf8", "hex");
  crypted += cipher.final("hex");
  return crypted;
}

function decrypt(text, password) {
  let decipher = crypto.createDecipher(algorithm, password);
  let dec = decipher.update(text, "hex", "utf8");
  dec += decipher.final("utf8");
  return dec;
}

function savePersistent(persistent, password) {
  if (verifyPersistent(persistent)) {

    let persistentCopy = JSON.parse(JSON.stringify(persistent));
    let keys = Object.keys(persistentCopy.accounts);
    keys.forEach(x => {
      persistentCopy.accounts[x].transactions = [];
    });

    let persistentString = JSON.stringify(persistentCopy);
    let encryptedString = encrypt(persistentString, password);
    window.localStorage.setItem(LOCALSTORAGE_KEY, encryptedString);
    return true;
  } else {
    console.log(persistent);
    throw "savePersistent verification failed";
  }
}

export const broadcastPersistent = (persistent, newState, pw) => {
  return {
    type: FINISH_INITIALIZATION,
    persistent: persistent,
    wallet_state: newState
  };
};

export const onSetPassword = (props, newPassword) => {
  savePersistent(props.wallet.persistent, newPassword);
  return {
    type: FINISH_INITIALIZATION,
    persistent: props.wallet.persistent,
    wallet_state: WALLET_STATE.READY,
    pw: newPassword
  };
};

export const deleteAccount = (props, address) => {
  delete props.wallet.persistent.accounts[address];
  savePersistent(props.wallet.persistent, props.wallet.pw);
};

export const renameAccount = (props, address, name, dispatch) => {
  props.wallet.persistent.accounts[address].name = name;
  savePersistent(props.wallet.persistent, props.wallet.pw);
  dispatch(broadcastPersistent(props.wallet.persistent, WALLET_STATE.READY));
};

export const generateTronLinkCompatibleAccount = async () => {
  const newAccount = await AccountHandler.generateAccount().getAccountAtIndex();
  newAccount.tronLinkCompatible = true;
  newAccount.words = newAccount.wordList.split(' ');
  newAccount.address = newAccount.publicKey;
  return newAccount;
};

export const tronLinkCompatibleAccountFromPhrases = async (phrases) => {
  try {
    const newAccount = await new AccountHandler(phrases).getAccountAtIndex();
    newAccount.tronLinkCompatible = true;
    newAccount.words = newAccount.wordList.split(' ');
    newAccount.address = newAccount.publicKey;
    return newAccount;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const addAccount = async (
  props,
  accountName,
  dispatch,
  newAccount = null
) => {
  console.log("adding account with name: " + accountName);
  console.log(newAccount);
  if (!accountName || accountName === "") accountName = "Unnamed Account";
  let persistent = props.wallet.persistent;

  if (newAccount === null)
    newAccount = TronHttpTools.accounts.generateRandomBip39();

  props.history.push("/wallets/walletDetails/" + newAccount.address);

  persistent.accounts[newAccount.address] = {
    trx: 0,
    name: accountName,
    publicKey: newAccount.address,
    privateKey: newAccount.privateKey,
    words: newAccount.words ? newAccount.words : false,
    tronLinkCompatible: (newAccount.tronLinkCompatible === true),

    tokens: [],
    transactions: [],
    votes: [],

    lastSync: 0, //timestamp with last sync

    frozenBalance: 0,
    frozenExpireTime: 0,
    bandwidth: 0,

    watchonly: newAccount.watchonly === true,
    ledger: newAccount.ledger === true,
    ledgerPath: newAccount.ledger ? newAccount.path : "",
  };

  let newWalletState =
    props.wallet.pw === null
      ? WALLET_STATE.NEEDS_USER_PASSWORD
      : WALLET_STATE.READY;
  console.log("HERE!");
  console.log(newWalletState);
  console.log(props.wallet.pw);

  dispatch(broadcastPersistent(persistent, newWalletState));
  if (newWalletState === WALLET_STATE.READY) {
    savePersistent(persistent, props.wallet.pw);
  }
  startUpdateAccountsAsync(persistent, dispatch);
};

async function getAccountsInfo(persistent) {
  console.log(persistent);
  return await client.getAccounts(Object.keys(persistent.accounts));
}

export const updateAllAccounts = persistent => {
  return {
    type: UPDATE_ALL_ACCOUNTS,
    persistent: persistent
  };
};

export const updateTransferTransactions = async (address, dispatch) => {
  let transactions = await client.getTransactionsRelatedToThis(address);

  let cleanedTransactions = [];
  for (let i = 0; i < transactions.length; i++) {
    let transaction = transactions[i];

    let newTransaction = {
      ...transaction,
      amount: transaction.amount,
      date: transaction.timestamp,
      type: transaction.owner_address === address ? 1 : 0,
      asset: transaction.asset_name ? transaction.asset_name : "TRX"
    };

    cleanedTransactions.push(newTransaction);
  }

  dispatch(updateTransactions(address, cleanedTransactions));
};

export const updateTransactions = (accountId, transactions) => {
  return {
    type: UPDATE_TRANSACTIONS,
    accountId: accountId,
    transactions: transactions
  };
};

export const startUpdateAccountsAsync = (persistent, dispatch) => {
  setTimeout(async () => {
    let accountsInfo = await getAccountsInfo(persistent);
    let accountIds = Object.keys(persistent.accounts);
    for (let j = 0; j < accountIds.length; j++) {
      let i = accountIds[j];
      let info = accountsInfo[persistent.accounts[i].publicKey];
      if (info) {
        persistent.accounts[i].trx = info.trx;
        persistent.accounts[i].tokens = info.tokens;
        persistent.accounts[i].frozenBalance = parseInt(
          info.frozen_balance / 1000000
        );
        persistent.accounts[i].frozenExpireTime = info.frozen_expire_time;
        if (info.net) {
          persistent.accounts[i].bandwidth = new Decimal(info.net.netlimit)
            .sub(new Decimal(info.net.netused))
            .toString();
        } else {
          persistent.accounts[i].bandwidth = 0;
        }
      }
    }
    dispatch(updateAllAccounts(persistent));

    for (let j = 0; j < accountIds.length; j++) {
      await updateTransferTransactions(accountIds[j], dispatch);
    }
  }, 0);
};

export const populateDecryptedPersistent = (persistent, pw) => {
  console.log("populatePersistenet");
  return {
    type: FINISH_INITIALIZATION,
    wallet_state: WALLET_STATE.READY,
    persistent: persistent,
    pw: pw
  };
};

export const decryptPersistent = (persistent, password, dispatch) => {
  console.log("decryptPersistent");
  let decrypted = null;
  try {
    decrypted = JSON.parse(decrypt(persistent, password));
    dispatch(populateDecryptedPersistent(decrypted, password));
    startUpdateAccountsAsync(decrypted, dispatch);
  } catch (e) {
    console.log(e);
    return false;
  }
};


export const initFromStorage = (props, dispatch) => {
  let persistent = window.localStorage.getItem(LOCALSTORAGE_KEY);

  if (persistent) {
    try {
      console.log("loaded encrypted persistent:");

      return {
        type: INITIALIZATION_NEED_DECRYPTION,
        wallet_state: WALLET_STATE.NEEDS_USER_UNLOCK,
        persistent_encrypted: persistent
      };
    } catch (e) {
      alert('error loading persistent');
      alert(e.message);
      alert(e.stack);
      alert(persistent);

      let file = '' + e.message + '\n' + e.stack + '\n' + persistent;
      const filename = 'persistent_crash_log' + new Date().getTime() + '.log';
      fs.writeFileSync(filename, file);
      alert('dumped crash log and storage backup to ' + filename);

      throw e;
    }
  } else {
    props.history.push("/wallets/create");
    return {
      type: INIT,
      wallet_state: WALLET_STATE.NO_WALLET
    };
  }
};
