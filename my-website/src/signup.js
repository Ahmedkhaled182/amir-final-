import React from 'react';
import './signup.css';

const SignUp = ({ toggleAuthPage }) => {
  let name = '';
  let email = '';
  let password = '';

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:555/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const result = await response.text();
      if (response.ok) {
        alert(result); // User registered successfully
        toggleAuthPage(); // Navigate to login
      } else {
        alert(`Error: ${result}`); // Display server error
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            onChange={(e) => (name = e.target.value)}
            required
          />
        </div>
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
        <button type="submit">Sign Up</button>
        <button
          type="button"
          className="redirect-button"
          onClick={toggleAuthPage}
        >
          Already have an account? Login
        </button>
      </form>
    </div>
  );
};

export default SignUp;