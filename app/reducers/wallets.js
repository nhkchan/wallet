import {
  UPDATE_TRANSACTIONS,
  UPDATE_ALL_ACCOUNTS,
  FINISH_INITIALIZATION,
  INITIALIZATION_NEED_DECRYPTION,
  WALLET_STATE,
  INIT
} from "../actions/wallet";

const initialState = {
  persistent: {
    accounts: {}
  },
  persistent_encrypted: null,
  wallet_state: WALLET_STATE.NEEDS_LOADING,
  pw: null
};

export function walletReducer(state = initialState, action) {
  switch (action.type) {
    case INIT: {
      return {
        ...state,
        ...action
      };
    }

    case INITIALIZATION_NEED_DECRYPTION: {
      return {
        ...state,
        persistent_encrypted: action.persistent_encrypted,
        wallet_state: action.wallet_state
      };
    }

    case FINISH_INITIALIZATION: {
      if (action.pw !== undefined) {
        return {
          ...state,
          persistent: action.persistent,
          wallet_state: action.wallet_state,
          pw: action.pw
        };
      } else {
        return {
          ...state,
          persistent: action.persistent,
          wallet_state: action.wallet_state
        };
      }
    }

    case UPDATE_ALL_ACCOUNTS: {
      console.log("update all accounts");
      console.log(action);
      return {
        ...state,
        persistent: action.persistent
      };
    }

    case UPDATE_TRANSACTIONS: {
      let newState = {
        ...state
      };
      newState.persistent.accounts[action.accountId].transactions =
        action.transactions;
      return newState;
    }

    default:
      return state;
  }
}
