import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../assets/css/style-signup.css';
import dnaImage from '../assets/img/DNA-Genetics.webp';

function Register() {
  const [name, setName] = useState('');
  const [profession, setProfession] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   setProfileImage(file);
  // };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const maxSize = 10 * 1024 * 1024; // 10 MB
  
    if (file && file.size > maxSize) {
      alert('File size exceeds 10 MB. Please choose a smaller file.');
      return;
    }
  
    else if (file) {
     // const imageUrl = URL.createObjectURL(file);
      setProfileImage(file);
    }
    
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      alert('Passwords not matched');
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append('name', name);
    formData.append('profession', profession);
    formData.append('email', email);
    formData.append('password', password);
    if (profileImage) {
      formData.append('image_path', profileImage);
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/user/signup/', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        navigate('/otp-verify', { state: { email, password } });
        alert('Data sent');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  return (
    <div className="container body">
      <div className="forms">
        <div className="form-content">
          <div className="signup-form">
            <div className="title">Signup</div>
            <form onSubmit={handleSignup}>
              <div className="input-boxes">
                <div className="input-box">
                  <i className="fas fa-user"></i>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="input-box">
                  <i className="fas fa-gavel"></i>
                  <input
                    type="text"
                    placeholder="Enter your profession"
                    required
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                  />
                </div>
                <div className="input-box">
                  <i className="fas fa-envelope"></i>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="input-box">
                  <i className="fas fa-lock"></i>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="input-box">
                  <i className="fas fa-lock"></i>
                  <input
                    type="password"
                    placeholder="Re-type password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <div className="button input-box">
                  <input type="submit" value="Submit" onClick={() => "Processing" }/>
                </div>
                <div className="text sign-up-text">
                  Already have an account?{' '}
                  <Link to="/login">Login now</Link>
                </div>
              </div>
            </form>
            </div>

            <div className="profile-section">
              <input
                type="file"
                accept="image/*"
                id="profile-picture"
                onChange={handleImageChange}
                className="file-input-hidden"
              />
              <button
                type="button"
                className="custom-file-button profile-picture"
                onClick={() => document.getElementById('profile-picture').click()}
              >
                {profileImage ? (
                  <img src={URL.createObjectURL(profileImage)} alt="Profile" className="profile-img" />
                ) : (
                  <div className="profile-placeholder">Profile Picture</div>
                )}
              </button>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
