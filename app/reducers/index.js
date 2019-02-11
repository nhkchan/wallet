// @flow
import { combineReducers } from "redux";
import { routerReducer as router } from "react-router-redux";
import { walletReducer } from "./wallets";
import { tokensReducer } from "./tokens";
import { witnessesReducer } from "./witnesses";
import { appReducer } from "./app";
import { contactReducer } from "./contacts";
import { storageReducer } from "./storage";
import { currencyReducer } from "./currency";

export default combineReducers({
  wallet: walletReducer,
  tokens: tokensReducer,
  witnesses: witnessesReducer,
  app: appReducer,
  contact: contactReducer,
  storage: storageReducer,
  currency: currencyReducer,
  router
});
