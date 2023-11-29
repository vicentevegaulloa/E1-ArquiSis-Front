import React from 'react';
import './ErrorMessage.css';
import { useNavigate } from 'react-router-dom';


const ErrorUserAccessOffers = () => {
  const navigate = useNavigate();
  return (
    <div className="error-message-container">
      <h2 className="error-message-title">Access Denied</h2>
      <p className="error-message-text">You are not an administrator</p>
      <button onClick={() => navigate('/')} className="home-button">Back to Home</button> 
    </div>
  );
};

export default ErrorUserAccessOffers;
