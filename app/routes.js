/* eslint flowtype-errors/show-errors: 0 */
import React from "react";

import WalletList from "./components/Wallet/";
import VoteList from "./components/Vote/";
import TokenList from "./components/Tokens/";
import TokenView from "./components/Tokens/View";
import ContactList from "./components/Contact/";
import SettingList from "./components/Settings/";
import SendAmount from "./components/Wallet/Send/SendAmount";
import Receive from "./components/Wallet/Receive/";
import Freeze from "./components/Wallet/Freeze";
import Create from "./components/Wallet/Create/";
import CreateAccount from "./components/Wallet/CreateAccount/";
import WalletView from "./components/Wallet/WalletView/";
import ViewTransaction from "./components/Wallet/WalletView/View";
import WalletBackup from "./components/Wallet/Backup/";
import Share from "./components/Settings/Share";
import ContactDetails from "./components/Contact/ContactDetails";
import VoteDetails from "./components/Vote/VoteDetails";
import Feedback from "./components/Settings/Feedback";
import AddressBook from "./components/Settings/AddressBook";
import Language from "./components/Settings/Language";
import Notifications from "./components/Settings/Notifications";
import Announcements from "./components/Settings/Announcements";
import Node from "./components/Settings/Node";
import CreateToken from "./components/Tokens/CreateToken";
import OfflineSignature from "./components/Wallet/OfflineSignature";
import Transfer from "./components/Transactions/Transfer";
import Broadcast from "./components/Transactions/Broadcast";
import VoteMultiple from "./components/Vote/Votes/";
import DashboardList from "./components/Dashboard/DashboardList";
import Representatives from "./components/Dashboard/Representatives";
import SignUp from "./components/User/SignUp";
import SignIn from "./components/User/SignIn";
import ValidateOtp from "./components/User/ValidateOtp";
import TronStatistics from "./components/Dashboard/TronStatistics";
import TronAnnouncements from "./components/Dashboard/TronAnnouncements";
import TATMStatistics from "./components/Dashboard/TATMStatistics";
import TronChart from "./components/Dashboard/TronChart";
import Exchange from "./components/Dashboard/Exchange";



export const routes = [
  {
    path: "/dashboard/",
    sidebar: () => <DashboardList />
  },
  {
    path: "/wallets/",
    sidebar: () => <WalletList />
  },
  {
    path: "/games/",
    sidebar: () => <WalletList />
  },
  {
    path: "/wallets/walletDetails/:account/:token?",
    main: () => <WalletView />
  },
  {
    path: "/wallets/walletBackup/:account",
    main: () => <WalletBackup />
  },
  {
    path: "/dashboard/tronAnnouncements",
    main: () => <TronAnnouncements />
  },
  {
    path: "/dashboard/tronChart",
    main: () => <Exchange />
  },
  {
    path: "/dashboard/tatmStatistics",
    main: () => <TATMStatistics />
  },
  {
    path: "/dashboard/tronStatistics",
    main: () => <TronStatistics />
  },
  {
    path: "/dashboard/representatives",
    main: () => <Representatives />
  },
  {
    path: "/dashboard/validateOtp/:email/:password",
    main: () => <ValidateOtp />
  },
  {
    path: "/dashboard/signIn",
    main: () => <SignIn />
  },
  {
    path: "/dashboard/signUp",
    main: () => <SignUp />
  },
  {
    path: "/wallets/create",
    main: () => <Create />
  },
  {
    path: "/wallets/createAccount",
    main: () => <CreateAccount />
  },
  {
    path: "/wallets/send/:account/:token?",
    main: () => <SendAmount />
  },
  {
    path: "/wallets/receive/:account",
    main: () => <Receive />
  },
  {
    path: "/wallets/offline/:account",
    main: () => <OfflineSignature />
  },
  {
    path: "/wallets/freeze/:account",
    main: () => <Freeze />
  },
  {
    path: "/wallets/transactionDetails/:account/:txid",
    main: () => <ViewTransaction />
  },
  {
    path: "/settings/",
    sidebar: () => <SettingList />,
  },
  {
    path: "/settings/addressbook",
    main: () => <AddressBook />
  },
  {
    path: "/settings/Feedback",
    main: () => <Feedback />
  },
  {
    path: "/settings/share",
    main: () => <Share />
  },
  {
    path: "/settings/notifications",
    main: () => <Notifications />
  },
  {
    path: "/settings/announcements",
    main: () => <Announcements />
  },
  {
    path: "/settings/language",
    main: () => <Language />
  },
  {
    path: "/settings/node",
    main: () => <Node />
  },
  {
    path: "/vote/",
    sidebar: () => <VoteList />,
  },
  {
    path: "/vote/voteDetails/:rep",
    main: () => <VoteDetails />
  },
  {
    path: "/vote/voting/",
    main: () => <VoteMultiple />
  },
  {
    path: "/tokens/",
    sidebar: () => <TokenList />,
  },
  {
    path: "/tokens/TokenDetails/:token/",
    main: () => <TokenView />
  },
  {
    path: "/tokens/createtoken/",
    main: () => <CreateToken />
  },
  {
    path: "/contacts",
    sidebar: () => <ContactList />,
    main: () => <ContactDetails />
  },
  /* OFFLINE SIGNING STUFF*/
  {
    path: "/wallets/createtransfer/:account?",
    main: () => <Transfer />
  },
  {
    path: "/wallets/broadcast/",
    main: () => <Broadcast />
  },
  {
    path: "/wallets/createassettransfer/:account?/:token?",
    main: () => <SendAmount isCold="true" />
  },
  {
    path: "/wallets/createfreeze/:account?",
    main: () => <Freeze isCold="true" />
  }
];
