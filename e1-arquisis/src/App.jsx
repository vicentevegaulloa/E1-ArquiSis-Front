import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

import LoginButton from './components/LoginButton';
import LogoutButton from './components/LogoutButton';
import FetchDataComponent from './components/FetchDataComponent';
import UserWallet from './pages/UserWallet/UserWallet';
import Homepage from './pages/Homepage/Homepage';
import PurchasesList from './pages/PurchasesList/PurchasesList';

const HomePage = () => (
  <div>
    <h1>Welcome Home</h1>
    <LoginButton />
    <LogoutButton />
  </div>
);

const App = () => {
  const { isLoading, isAuthenticated } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route 
          path="/data" 
          element={
            isAuthenticated ? 
            <FetchDataComponent url="petstore/pets" /> :
            <Navigate to="/" />
          } 
        />
        <Route path="/wallets/:userId" element={<UserWallet />} />
        <Route path="/purchases/:userId" element={<PurchasesList />} />
      </Routes>
    
    </Router>
  );
};

export default App;
