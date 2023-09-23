import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

import LoginButton from './components/LoginButton';
import LogoutButton from './components/LogoutButton';
import FetchDataComponent from './components/FetchDataComponent';
import CompanyList from './pages/CompanyList/CompanyList';
import HistoryRecord from './pages/HistoryRecord/HistoryRecord';
import HistoryCompanies from './pages/HistoryRecord/HistoryCompanies';

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
        <Route path="/" element={<HomePage />} />
        <Route 
          path="/data" 
          element={
            isAuthenticated ? 
            <FetchDataComponent url="petstore/pets" /> :
            <Navigate to="/" />
          } 
        />
        <Route path="/stocks" element={<CompanyList/>}></Route>
        <Route path="/history/:symbol" element={<HistoryRecord />} />
        <Route path="/history" element={<HistoryCompanies/>}></Route>
      </Routes>
    </Router>
  );
};

export default App;
