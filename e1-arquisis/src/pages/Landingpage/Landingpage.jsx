import React from 'react';
import './Landingpage.css';
import '@aws-amplify/ui-react/styles.css';

const LandingPage = () => {
  return (
      <div className='landing-grid'>
        <div className='vacio'></div>
        <div className="content-text">
          <h1>Join Buy Stonks</h1>
          <p>Discover the world of smart investments. <br></br>Sign up now to access a world of financial opportunities.</p>
          <a href="/stocks" className="btn">
            Explore
          </a>
        </div>
        <div className='vacio'></div>

      </div>
          
  );
};

export default LandingPage;
