import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../assets/css/style.css';
import dnaImage from '../assets/img/DNA-Genetics.webp';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      if (token) {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/user/info/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if(data.is_active){
          navigate('/user/dashboard')
        }

      } catch (error) {
      }
      }
    };
  
    fetchUserInfo();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:8000/api/user/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Store the access token (JWT) in localStorage
        localStorage.setItem('token', data.access); 
        console.log(localStorage.getItem("token"));  // This should now print the access token
        localStorage.setItem('refreshToken', data.refresh);

        navigate('/user/dashboard'); 
        
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred during login. Please try again.');
    }
  };

  return (
    <div className="log_container">
      <input type="checkbox" id="flip" />
      <div className="log_cover">
        <div className="log_front">  
          <img src={dnaImage} alt="DNA" />
        </div>
        <div className="log_back">  
          <img src="images/backImg.jpg" alt="Background" />
        </div>
      </div>
      <div className="log_forms">
        <div className="log_form-content">
          <div className="log_login-form">
            <div className="log_title">Login</div>
            <form onSubmit={handleLogin}>
              <div className="log_input-boxes">
                <div className="log_input-box">
                  <i className="fas fa-envelope"></i>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="log_input-box">
                  <i className="fas fa-lock"></i>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="log_input-box">
                  <Link to="/email-pass">Forgot password?</Link>
                </div>
                <div className="log_button log_input-box">
                  <input type="submit" value="Submit" />
                </div>
                <div className="log_sign-up-text">
                  Don't have an account? {' '}
                  <Link to="/register">
                    Signup now
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

export default Login;
