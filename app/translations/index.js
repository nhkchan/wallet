import { addLocaleData } from "react-intl";
import frLocaleData from "react-intl/locale-data/fr";

import * as messagesEn from "./en";
import * as messagesFr from "./fr";

addLocaleData([...frLocaleData]);

export const languages = {
  en: messagesEn.messages,
  fr: messagesFr.messages
};
