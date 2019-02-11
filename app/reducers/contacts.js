import {
  ADD_CONTACT,
  REMOVE_CONTACT,
  UPDATE_CONTACT
} from "../actions/contacts";

const initialState = {
  contactID: "",
  contactName: "",
  contactAddress: "",
  contactImage: ""
};

export function contactReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_CONTACT: {
      return {
        ...state
      };
    }
    case REMOVE_CONTACT: {
      return {
        ...state
      };
    }
    case UPDATE_CONTACT: {
      return {
        ...state
      };
    }
    default:
      return state;
  }
}
