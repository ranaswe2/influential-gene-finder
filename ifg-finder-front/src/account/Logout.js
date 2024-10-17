import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogout = async () => {
            const refreshToken = localStorage.getItem('refreshToken');
            try {
                const response = await fetch('http://127.0.0.1:8000/api/user/logout/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        refresh_token: refreshToken
                    })
                });

                if (response.ok) {
                    // Clear tokens from localStorage
                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshToken');

                    // Navigate to the home page after successful logout
                    navigate('/home');
                } else {
                    const data = await response.json();
                    console.error("Error:", data.error);
                }
            } catch (error) {
                console.error("Logout failed:", error);
            }
        };

        // Automatically call handleLogout when the component mounts
        handleLogout();
    }, [navigate]);

    return null; // Since the component performs an automatic action, return nothing
};

export default Logout;


