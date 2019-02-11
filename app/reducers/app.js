import { SEARCH, SET_PRICE, SET_LANGUAGE } from "../actions/app";

const initialState = {
  price: {
    usd: 0,
    percentage: 0
  },
  availableLanguages: {
    en: "English",
    fr: "Français"
  },
  activeLanguage: "en"
  //activeLanguage: window.localStorage.get('language', 'en'),
};

export function appReducer(state = initialState, action) {
  switch (action.type) {
    case SET_PRICE: {
      return {
        ...state,
        price: {
          usd: action.price,
          percentage: action.percentage
        }
      };
    }

    case SEARCH: {
      return {
        ...state,
        searchString: action.searchString
      };
    }

    case SET_LANGUAGE: {
      let language = action.language;

      if (typeof state.availableLanguages[action.language] === "undefined") {
        language = "en";
      }
      //window.localStorage.set('language', language);

      return {
        ...state,
        activeLanguage: language
      };
    }

    default:
      return state;
  }
}
