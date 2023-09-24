import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";

import FetchDataComponent from "./components/FetchDataComponent";

import CompanyList from "./pages/CompanyList/CompanyList";
import AllCompanies from './pages/Stocks/AllCompanies';
import CompanyStocks from './pages/Stocks/CompanyStocks';
import UserWallet from './pages/UserWallet/UserWallet';
import PurchasesList from './pages/PurchasesList/PurchasesList';
import HomePage from './pages/Homepage/Homepage';

import awsExports from "./aws-exports";

import '@aws-amplify/ui-react/styles.css';
import './App.css';
import LandingPage from "./pages/Landingpage/Landingpage";
import CustomSignIn from "./pages/Landingpage/SignIn";

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
    navigate(`/stocks`);
  };

  return (
    <>
        <div className="content">
          <nav className="navbar">
            <div className="logo">
              <button onClick={() => seeStocks()}>Buy Stonks</button>
            </div>
            <div className="section">
              {user ? (
                <button onClick={() => signOut()}>Sign out</button>
              ) : (
                <button>Sign in</button>
              )}
            </div>
          </nav>
          <section></section>
          <div className="main">
            {user ? (
                <div className="user-yes">
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
                      <Route path="/" element={<HomePage/>} />
                      <Route path="/data" element={<FetchDataComponent/>}/>
                      <Route path="/company/:symbol" element={<CompanyStocks/>} />
                      <Route path="/stocks" element={<AllCompanies/>}></Route>
                      <Route path="/wallets/:userId" element={<UserWallet user={user} signOut={signOut}/>} />
                      <Route path="/purchases/:userId" element={<PurchasesList />} />
                    </Routes>
                  </div>
                </div>
              ) : (
                <div className="user-no">
                  <Routes>
                    <Route path="/" element={<LandingPage/>}></Route>
                    <Route path="/explore" element={<CompanyList/>}></Route>
                    <Route path="/signin" element={<CustomSignIn/>}></Route>
                  </Routes>
                </div>
                
              )}
            
            {console.log(user)}
            

          </div>
        </div>

    </>
  );
};

export default withAuthenticator(App);
