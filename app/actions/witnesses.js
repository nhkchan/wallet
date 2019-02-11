const TronHttpClient = require("tron-http-client");
const client = new TronHttpClient();

export const SET_WITNESSES = "SET_WITNESSES";

export const setWitnesses = (witnesses = []) => ({
  type: SET_WITNESSES,
  witnesses
});

export const loadWitnesses = () => async (dispatch, getState) => {
  dispatch(setWitnesses(await client.listWitnesses()));
};
