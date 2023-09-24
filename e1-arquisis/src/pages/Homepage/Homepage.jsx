import React from 'react';
import './Homepage.css';
import '@aws-amplify/ui-react/styles.css';

const HomePage = () => {
  return (
    <div className="homepage-grid">
      <div className='vacio'></div>
      <div className="content-text">
        <h1>Start Investing Today</h1>
        <p>Explore endless investment opportunities with Buy Stonks. Invest in your favorite companies and currencies effortlessly</p>
        <a href="/history" className="btn">
          Explore
        </a>
      </div>
      <div className='vacio'></div>
    </div>
  );
};

export default HomePage;
