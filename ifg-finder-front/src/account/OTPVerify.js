import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../assets/css/style.css';

function Verify() {
  const [otp, setOtp] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || ''; // Get email passed from signup
  const password = location.state?.password || ''; // Get email passed from signup

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/api/user/verifyotp/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      if (response.ok) {
        // OTP verified, now login the user automatically
        handleLoginAfterOtp();
      } else {
        alert('Invalid OTP');
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
    }
  };

  const handleLoginAfterOtp = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/user/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }), // Use password from signup (update if needed)
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); // Store JWT token
        navigate('/user/dashboard'); // Redirect to dashboard after login
      } else {
        alert('Login failed after OTP verification');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div className="log_container">
      <div className="log_forms">
        <div className="log_form-content">
          <div className="log_login-form">
            <div className="log_title">Verification</div>
            <form onSubmit={handleVerifyOtp}>
              <div className="log_input-boxes">
                <div className="log_input-box">
                  <i className=""></i>
                  <input
                    type="number"
                    placeholder="X X X X X X"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
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

export default Verify;

