import React from 'react';
import './Homepage.css';

const Homepage = () => {
    return (
        <div className="homepage-container"> 
            <header>
                <nav className="navbar">
                    <div className="logo">
                        <a href="index.html">Buy Stonks</a>
                    </div>
                    <div className="nav-links">
                        <a href="solicitudes.html">Solicitudes</a>
                    </div>
                </nav>
            </header>

            <main>
                <section className="content">
                    <div className="box">
                        <h1>Título provisional</h1>
                        <p>Texto provisional</p>
                        <a href="login.html" className="btn">Login</a>
                    </div>
                    <div className="box">
                        <div className="image" style={{ backgroundImage: "url('../../../public/background.jpeg')" }}></div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Homepage;
