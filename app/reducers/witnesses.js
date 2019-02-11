import { SET_WITNESSES } from "../actions/witnesses";

const initialState = {
  witnesses: []
};

export function witnessesReducer(state = initialState, action) {
  switch (action.type) {
    case SET_WITNESSES: {
      return {
        ...state,
        witnesses: action.witnesses
      };
    }
    default:
      return state;
  }
}
