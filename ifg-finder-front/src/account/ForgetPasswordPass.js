import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/style.css'; 
import dnaImage from '../assets/img/DNA-Genetics.webp';

function ForgetPasswordPass() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const email = location.state?.email || ''; // Get email passed from signup

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Create payload for password reset
    const payload = {
      email: email, 
      new_password: password,
      confirm_password: confirmPassword,
    };

    // Send data to the API
    fetch('http://127.0.0.1:8000/api/user/reset-pass/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setErrorMessage(data.error);
        } else {
          alert('Password reset successfully! Redirecting to login...');
          
          window.location.href = '/login';  // Redirect to login page
        }
      })
      .catch(error => {
        console.error('Error resetting password:', error);
        alert('An error occurred while resetting the password.');
      });
  };

  return (
    <div className="log_container">
      <input type="checkbox" id="flip" checked={isFlipped} onChange={handleFlip} />
      <div className="log_cover">
        <div className={isFlipped ? 'log_front log_flipped' : 'log_front'}>  
          <img src={dnaImage} alt="" />
        </div>
        <div className={isFlipped ? 'log_back log_flipped' : 'log_back'}>  
          <img src="images/backImg.jpg" alt="" />
        </div>
      </div>
      <div className="log_forms">
        <div className="log_form-content">
          <div className="log_login-form">
            <div className="log_title">Reset Password Step-3/3</div>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
            <form onSubmit={handleSubmit}>
              <div className="log_input-boxes">
                <div className="log_input-box">
                  <i className="fas fa-lock"></i>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="log_input-box">
                  <i className="fas fa-lock"></i>
                  <input
                    type="password"
                    placeholder="Enter password again"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="log_button log_input-box">
                  <input type="submit" value="Submit" />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgetPasswordPass;

