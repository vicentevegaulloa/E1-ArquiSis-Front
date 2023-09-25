import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Homepage.css';
import '@aws-amplify/ui-react/styles.css';



const HomePage = () => {

  const navigate = useNavigate();

  const explore = () => {
    navigate(`/stocks`);
  }
  return (
    <div className="homepage-grid">
      <div className='vacio'></div>
      <div className="content-text">
        <h1>Start Investing Today</h1>
        <p>Explore endless investment opportunities with Buy Stonks. Invest in your favorite companies and currencies effortlessly</p>
        <button onClick={() => explore()}>Explore stocks</button>
      </div>
      <div className='vacio'></div>
    </div>
  );
};

export default HomePage;
