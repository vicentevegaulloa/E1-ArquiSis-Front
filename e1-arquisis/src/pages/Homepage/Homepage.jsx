import React from 'react';
import './Homepage.css';
import '@aws-amplify/ui-react/styles.css';

const HomePage = ({ signOut, user }) => {
  return (
    <div className="homepage-container">
      <header>
        <nav className="navbar">
          <div className="logo">
            <a href="/">Buy Stonks</a>
          </div>
          <div className="nav-links">
            <button onClick={() => signOut()} className="btn">
              Sign Out
            </button>
          </div>
        </nav>
      </header>

      <main>
        <section className="content">
          <div className="content-left">
            <h1>Start Investing Today</h1>
            <p>Explore endless investment opportunities with Buy Stonks. Invest in your favorite companies and currencies effortlessly</p>
            <a href="/history" className="btn">
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

export default HomePage;
