import React from 'react';
import './ErrorMessageStocks.css';

const ErrorMessageStocks = () => {
  return (
    <div className="error-message-container">
      <p className="error-message-text">You are not allowed to buy stocks :c</p>
      <button onClick={() => navigate('/')} className="home-button">Back to Home</button> 
    </div>
  );
};

export default ErrorMessageStocks;
