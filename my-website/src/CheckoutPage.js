import React, { useState } from 'react';
import './CheckoutPage.css'; 

const Checkout = ({ cartItems, totalPrice, userId, goBack }) => {
  const [formData, setFormData] = useState({ name: '', email: '', address: '', phone: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (!userId) {
      alert('Error: You are not logged in.');
      return;
    }

    if (Object.values(formData).some(field => !field)) {
      alert('Please fill in all the required fields.');
      return;
    }

    try {
      const response = await fetch('http://localhost:555/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId, cartItems, totalPrice, ...formData }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Order placed successfully!');
        goBack(); 
      } else {
        alert(`Failed to place order: ${data.error}`);
      }
    } catch {
      alert('Please Login to Checkout.');
    }
  };

  

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <form className="checkout-form">
        {['name', 'email', 'address', 'phone'].map(field => (
          <div className="form-group" key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <input
              type={field === 'email' ? 'email' : 'text'}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              placeholder={`Enter your ${field}`}
              required
            />
          </div>
        ))}
      </form>
      <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
      <button onClick={handlePlaceOrder} className="place-order-button">Place Order</button>
      <button onClick={goBack} className="back-button">Back to Cart</button>
    </div>
  );
};

export default Checkout;
