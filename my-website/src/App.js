import React, { useState } from 'react';
import Login from './login';
import SignUp from './signup';
import HomePage from './homepage';
import BrandA from './BrandA';
import BrandB from './BrandB';
import BrandC from './BrandC';
import Cart from './cart';
import Checkout from './CheckoutPage';
import Navbar from './navbar';

function App() {
  const [page, setPage] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setPage('home');
  };

  const updateCart = (product, action) => {
    setCartItems((prevCart) => {
      const existingProduct = prevCart.find((item) => item.ID === product.ID);

      if (existingProduct) {
        return prevCart.map((item) =>
          item.ID === product.ID
            ? { ...item, productId: item.ID, quantity: action === 'add' ? item.quantity + 1 : Math.max(0, item.quantity - 1) }
            : item
        ).filter(item => item.quantity > 0);
      }

      if (action === 'add') {
        return [...prevCart, { ...product, productId: product.ID, quantity: 1 }];
      }

      return prevCart;
    });
  };

  const navigateTo = (targetPage) => setPage(targetPage);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPage('login');
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.PRICE * item.quantity, 0);

  const pages = {
    home: <HomePage navigateTo={navigateTo} goToCart={() => setPage('cart')} />,
    BrandA: <BrandA addToCart={(product) => updateCart(product, 'add')} />,
    BrandB: <BrandB addToCart={(product) => updateCart(product, 'add')} />,
    BrandC: <BrandC addToCart={(product) => updateCart(product, 'add')} />,
    cart: <Cart cartItems={cartItems} removeFromCart={(productId) => {
      const product = cartItems.find(item => item.ID === productId);
      if (product) updateCart(product, 'remove');
    }} proceedToCheckout={() => setPage('checkout')} />,
    checkout: <Checkout cartItems={cartItems} totalPrice={totalPrice} userId={1} goBack={() => setPage('cart')} />,
    login: <Login toggleAuthPage={() => setPage('signup')} onLoginSuccess={handleLoginSuccess} />,
    signup: <SignUp toggleAuthPage={() => setPage('login')} />,
  };

  return (
    <div className="App">
      <Navbar handleReturnHome={() => setPage('home')} goToCart={() => setPage('cart')} isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
      {pages[page]}
    </div>
  );
}

export default App;