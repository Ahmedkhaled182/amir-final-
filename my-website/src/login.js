import React from 'react';
import './login.css';

const Login = ({ toggleAuthPage, onLoginSuccess }) => {
  let email = '';
  let password = '';
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:555/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(`Welcome, ${result.name}!`);
        if (onLoginSuccess) onLoginSuccess(result.name);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Login</h1>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            onChange={(e) => (email = e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            onChange={(e) => (password = e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
        <button
          type="button"
          className="redirect-button"
          onClick={toggleAuthPage}
        >
          Don't have an account? Sign Up
        </button>
      </form>
    </div>
  );
};

export default Login;
