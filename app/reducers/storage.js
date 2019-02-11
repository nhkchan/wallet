import { SAVE_STORAGE, LOAD_FAILED } from "../actions/storage";

const initialState = {
  settings: {}
};

export function storageReducer(state = initialState, action) {
  switch (action.type) {
    case SAVE_STORAGE: {
      return {
        ...state,
        ...action.storage
      };
    }

    default:
      return state;
  }
}
