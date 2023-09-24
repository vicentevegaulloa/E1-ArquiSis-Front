import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";

import FetchDataComponent from "./components/FetchDataComponent";

import CompanyList from "./pages/CompanyList/CompanyList";
import HistoryCompanies from './pages/HistoryRecord/HistoryCompanies';
import HistoryRecord from './pages/HistoryRecord/HistoryRecord';
import UserWallet from './pages/UserWallet/UserWallet';
import PurchasesList from './pages/PurchasesList/PurchasesList';
import Homepage from './pages/Homepage/Homepage';

import awsExports from "./aws-exports";

import '@aws-amplify/ui-react/styles.css'


Amplify.configure(awsExports);

const HomePage = ({signOut, user}) => (
  <div>
    {console.log(user)}
    <h1>Welcome Home {user.email}</h1>
    <button onClick={() => signOut()}>Sign out</button>
  </div>
);

const App = ({ signOut, user }) => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage user={user} signOut={signOut}/>} />
        <Route
          path="/data"
          element={<FetchDataComponent/>}
        />
        <Route path="/stocks" element={<CompanyList/>}></Route>
        <Route path="/history/:symbol" element={<HistoryRecord />} />
        <Route path="/history" element={<HistoryCompanies/>}></Route>
        <Route path="/wallets/:userId" element={<UserWallet />} />
        <Route path="/purchases/:userId" element={<PurchasesList />} />
        <Route path="/home" element={<Homepage />} />
      </Routes>
    </Router>
  );
};

export default withAuthenticator(App);
