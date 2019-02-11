import { SET_CURRENCY } from "../actions/currency";

const initialState = {
  USD: 0
};

export function currencyReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENCY: {
      return {
        ...state,
        ...action.currency
      };
    }

    default:
      return state;
  }
}
