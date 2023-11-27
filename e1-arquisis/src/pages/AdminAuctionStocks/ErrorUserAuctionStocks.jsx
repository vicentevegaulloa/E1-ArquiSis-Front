import React from 'react';
import './ErrorMessage.css';

const ErrorUserAuctionStocks = () => {
  return (
    <div className="error-message-container">
      <p className="error-message-text">You are not allowed to auction stocks :c</p>
      <button onClick={() => navigate('/')} className="home-button">Back to Home</button> 
    </div>
  );
};

export default ErrorUserAuctionStocks;
