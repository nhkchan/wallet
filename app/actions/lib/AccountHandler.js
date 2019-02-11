/*******************************************************
 * COPIED FROM https://github.com/TronWatch/TronLink/blob/8afb64518003fb6143f001817bafc949fcbcc1d5/app/lib/AccountHandler.js
 ******************************************************/
import TronWeb from 'tronweb';
import bip39 from 'bip39';
import bip32 from 'bip32';

import {Buffer} from 'safe-buffer';

const BIP44 = {
  INDEX: 195,
  HEXA: 0x800000c3
};

export const ACCOUNT_TYPE = {
  RAW: 0,
  MNEMONIC: 1
};

export default class AccountHandler {
  constructor(input, accountType = ACCOUNT_TYPE.MNEMONIC) {
    switch (accountType) {
      case ACCOUNT_TYPE.RAW:
        this._importFromPrivateKey(input);
        break;
      case ACCOUNT_TYPE.MNEMONIC:
        this._importFromWordList(input);
        break;
      default:
        throw new Error(`ACCOUNT_TYPE ${accountType} invalid`);
    }
  }

  static generateAccount(size = 256) {
    console.log(`Generating new account with size ${size}`);

    const mnemonic = bip39.generateMnemonic(size);

    return new AccountHandler(
      mnemonic
    );
  }

  _importFromPrivateKey(privateKey) {
    console.log('Importing account from private key');

    this._type = ACCOUNT_TYPE.RAW;
    this._privateKey = privateKey;
    this._publicKey = TronWeb.address.fromPrivateKey(privateKey);
  }

  _importFromWordList(wordList) {
    console.log('Importing account from word list');

    if (!bip39.validateMnemonic(wordList))
      throw new Error(`Invalid wordList ${wordList} provided`);

    console.log('Word list was valid');

    this._type = ACCOUNT_TYPE.MNEMONIC;
    this._seed = bip39.mnemonicToSeedHex(wordList);
    this._wordList = wordList;
  }

  getAccountAtIndex(index = 0) {
    console.log(`Getting account at index ${index}`);

    if (this._type !== ACCOUNT_TYPE.MNEMONIC)
      throw new Error('ACCOUNT_TYPE must be of type MNEMONIC to derive account keys');

    console.log('Valid account type, deriving key pair');

    const node = bip32.fromSeed(new Buffer(this._seed, 'hex'));
    const child = node.derivePath(`m/44'/${ BIP44.INDEX }'/${ index }'/0/0`, this._seed);

    const privateKey = child.privateKey.toString('hex');
    const publicKey = TronWeb.address.fromPrivateKey(privateKey);

    console.log(`Generated public key ${publicKey}`);

    return {
      wordList: this._wordList,
      accountType: this._type,
      accountIndex: index,
      name: false,
      internal: false,
      privateKey,
      publicKey
    };
  }

  export() {
    if (this._type === ACCOUNT_TYPE.MNEMONIC)
      return this._wordList;

    if (this._type === ACCOUNT_TYPE.RAW) {
      return {
        privateKey: this._privateKey,
        publicKey: this._publicKey,
        accountType: this._type,
        name: false,
        internal: false
      };
    }

    return false;
  }
}
