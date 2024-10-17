import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../assets/css/style.css';

function ForgetPasswordOTP() {
  const [otp, setOtp] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || ''; 


  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      console.log("Your "+email+" "+otp)
      const response = await fetch('http://127.0.0.1:8000/api/user/verifyotp/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      if (response.ok) {
        // OTP verified, now login the user automatically
        
        navigate('/reset-pass'); // Redirect to dashboard after login
      } else {
        alert('Invalid OTP');
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
    }
  };



  return (
    <div className="log_container">
      <div className="log_forms">
        <div className="log_form-content">
          <div className="log_login-form">
            <div className="log_title">Reset Password Step-2/3</div>
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

export default ForgetPasswordOTP;

