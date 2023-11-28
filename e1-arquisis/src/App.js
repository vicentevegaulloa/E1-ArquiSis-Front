import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import FetchDataComponent from "./components/FetchDataComponent";

import CompanyList from "./pages/CompanyList/CompanyList";
import AllCompanies from './pages/Stocks/AllCompanies';
import CompanyStocks2 from './pages/Stocks/CompanyStocks2';
import UserCompanyStocks from './pages/Stocks/UserCompanyStocks';
import UserWallet from './pages/UserWallet/UserWallet';
import PurchasesList2 from './pages/PurchasesList/PurchasesList2';
import HomePage from './pages/Homepage/Homepage';
import PurchaseConfirmation from "./pages/Webpay/PurchaseConfirmation.jsx";

import awsExports from "./aws-exports";

import '@aws-amplify/ui-react/styles.css';
import './App.css';
import LandingPage from "./pages/Landingpage/Landingpage";
import CustomSignIn from "./pages/Landingpage/SignIn";
import CreatePred from "./pages/Predictions/CreatePrediction";
import WorkerNotConnected from "./pages/Predictions/WorkerNotConnected";
import ShowPrediction from "./pages/Predictions/ShowPrediction";
import MyPredictionsStocks from "./pages/Predictions/MyPredictionsStocks"

Amplify.configure(awsExports);

// eslint-disable-next-line
const App = ({ signOut, user }) => {

  const navigate = useNavigate();

  
  const myWallet = () => {
    navigate(`/wallet`);
  };

  const myPurchases = () => {
    navigate(`/purchases`);
  };

  const myPredictions = () => {
    navigate(`/predictions`);
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
                  {
                    // eslint-disable-next-line
                  console.log(user.walletId)
                  }
                  <div className="side">
                    {/* eslint-disable-next-line */}
                    <h3>Welcome back {user.email}!</h3>
                    <br></br>
                    <p><b>My profile</b></p>
                    <ul>
                      <li><button onClick={
                        // eslint-disable-next-line
                        () => myWallet(user.userId)
                        }>My wallet</button></li>
                      <li><button onClick={
                        // eslint-disable-next-line
                        () => myPurchases(user.userId)
                        }>My purchases</button></li>
                      <li><button onClick={
                        // eslint-disable-next-line
                        () => myPredictions(user.userId)
                        }>My predictions</button></li>
                    </ul>
                    <br></br>
                    <p><b>Buy available stocks</b></p>
                    <ul>
                      <li><button onClick={() => seeStocks()}>Latest stocks</button></li>
                    </ul>
                  </div>

                  <div className="page">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/data" element={<FetchDataComponent/>}/>
                      <Route path="/company/:symbol" element={<CompanyStocks2/>} />
                      <Route path="/user/company/:symbol" element={<UserCompanyStocks/>} />
                      <Route path="/stocks" element={<AllCompanies/>}></Route>
                      <Route path="/wallet" element={<UserWallet user={user} signOut={signOut}/>} />
                      <Route path="/purchases" element={<PurchasesList2 />} />
                      <Route path="/createpred/:symbol" element={<CreatePred/>} />
                      <Route path="/showpred" element={<ShowPrediction/>} /> 
                      <Route path="/predictions" element={<MyPredictionsStocks/>} />
                      <Route path="/notworking" element={<WorkerNotConnected/>} />
                      <Route path="/purchase-confirmation/" element={<PurchaseConfirmation />} />                    
                    </Routes>
                  </div>
                </div>
              ) : (
                <div className="user-no">
                  <Routes>
                    <Route path="/welcome" element={<LandingPage/>}></Route>
                    <Route path="/explore" element={<CompanyList/>}></Route>
                    <Route path="/signin" element={<CustomSignIn/>}></Route>
                  </Routes>
                </div>
                
              )}
            
            

          </div>
        </div>

    </>
  );
};

export default withAuthenticator(App);
