import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";

import FetchDataComponent from "./components/FetchDataComponent";

import AllCompanies from './pages/Stocks/AllCompanies';
import CompanyStocks from './pages/Stocks/CompanyStocks';
import UserWallet from './pages/UserWallet/UserWallet';
import PurchasesList from './pages/PurchasesList/PurchasesList';

import awsExports from "./aws-exports";

import '@aws-amplify/ui-react/styles.css'
import './App.css'


Amplify.configure(awsExports);

const App = ({ signOut, user }) => {
  const navigate = useNavigate();

  const myWallet = (userId) => {
    navigate(`/wallets/${userId}`);
  };

  const myPurchases = (userId) => {
    navigate(`/purchases/${userId}`);
  };

  const seeStocks = () => {
    navigate(`/`);
  };

  return (
    <>
        <div className="content">
          <nav className="navbar">
            <div className="logo">
              <button onClick={() => seeStocks()}>Buy Stonks</button>
            </div>
            <div className="section">
              <button onClick={() => signOut()}>Sign out</button>
            </div>
          </nav>
          <section></section>
          <div className="main">
            {console.log(user)}
            <div className="side">
              <h3>Welcome back {user.email}!</h3>
              <br></br>
              <p><b>My profile</b></p>
              <ul>
                <li><button onClick={() => myWallet(user.userId)}>My wallet</button></li>
                <li><button onClick={() => myPurchases(user.userId)}>My purchases</button></li>
              </ul>
              <br></br>
              <p><b>Buy available stocks</b></p>
              <ul>
                <li><button onClick={() => seeStocks()}>Latest stocks</button></li>
              </ul>
            </div>

            <div className="page">
              <Routes>
                <Route path="/data" element={<FetchDataComponent/>}/>
                <Route path="/company/:symbol" element={<CompanyStocks/>} />
                <Route path="/" element={<AllCompanies/>}></Route>
                <Route path="/wallets/:userId" element={<UserWallet />} />
                <Route path="/purchases/:userId" element={<PurchasesList />} />
              </Routes>
            </div>

          </div>
        </div>
        
    </>
  );
};

export default withAuthenticator(App);
