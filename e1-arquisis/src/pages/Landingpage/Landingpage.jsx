import React from 'react';
import './Landingpage.css';
import '@aws-amplify/ui-react/styles.css';
import { useAuth0 } from '@auth0/auth0-react';



const LandingPage = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <div className="homepage-container">
      <header>
        <nav className="navbar">
          <div className="logo">
            <a href="/">Buy Stonks</a>
          </div>
          <div className="nav-links">
            <button onClick={() => loginWithRedirect()} className="btn">
              Sign Out
            </button>
          </div>
        </nav>
      </header>

      <main>
        <section className="content">
          <div className="content-left">
            <h1>Join Buy Stonks</h1>
            <p>Discover the world of smart investments. Sign up now to access a world of financial opportunities</p>
            <a href="/stocks" className="btn">
              Explore
            </a>
          </div>

          <div className="content-right">
            <div
              className="image"></div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Landingpage;
