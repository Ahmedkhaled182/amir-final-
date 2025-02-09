import React from 'react';
import './navbar.css';

const Navbar = ({ handleReturnHome, goToCart, isAuthenticated, handleLogout, handleLogin }) => {
  return (
    <nav className="navbar">
      <button onClick={handleReturnHome}>Home</button>
      <button onClick={goToCart}>View Cart</button>
      {isAuthenticated ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </nav>
  );
};

export default Navbar;
