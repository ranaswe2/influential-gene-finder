import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/welcome-page.css'; // CSS file for styling

const WelcomePage = () => {
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1 className="welcome-title">Welcome To Influential Gene Finder</h1>
        <div className="button-container">
          <Link to="/login" >
            <button className="login-button">Wanna Login Here?</button>
          </Link>
          <Link to="/register" >
            <button className="signup-button">Don't have an account?</button>
          </Link>
        
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
