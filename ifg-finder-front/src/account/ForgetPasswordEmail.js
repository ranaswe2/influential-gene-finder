import React, { useState } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/style.css'; // Assuming your CSS file is named styles.css
import dnaImage from '../assets/img/DNA-Genetics.webp';

function ForgetPassEmail() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate();

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Clear previous errors
    console.log(email)
    // API request to send OTP
    try {
      const response = await fetch('http://127.0.0.1:8000/api/user/resetotp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }), // Send the email as part of the POST body
      });

      if (response.ok) {
        setSuccess('OTP sent successfully to your email.');
        navigate('/otp-pass'); // Redirect to OTP verification page after success
        
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setError('An error occurred. Please try again.');
    }
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
            <div className="log_title">Reset Password Step-1/3</div>
            <form onSubmit={handleSubmit}>
              <div className="log_input-boxes">
                <div className="log_input-box">
                  <i className="fas fa-envelope"></i>
                  <input
                    type="text"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="log_error">{error}</p>}
                {success && <p className="log_success">{success}</p>}
                <div className="log_button log_input-box">
                  <input type="submit" value="Submit" />
                </div>
                <div className="log_sign-up-text">
                  Back to home?     {"  "}   
                  <Link to="/home"  htmlFor="flip">
                    Click now
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassEmail;

