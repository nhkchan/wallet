export const SET_CURRENCY = "SET_CURRENCY";

export const CURRENCY = {
  USD: "USD"
};

export const setFiatPrice = (currency, value) => {
  let output = { type: SET_CURRENCY, currency: {} };
  output.currency[currency] = value;
  return output;
};
