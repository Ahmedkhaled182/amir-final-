import React from 'react';
import './cart.css';

const Cart = ({ cartItems, goBack, removeFromCart: RemovefromCart, proceedToCheckout }) => {
  const totalPrice = cartItems.reduce((acc, item) => acc + item.PRICE * item.quantity, 0);

  const handleCheckout = () => {
    proceedToCheckout(cartItems);
  };

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="cart-list">
            {cartItems.map((item) => (
              <li key={item.ID} className="cart-item">
                <img src={item.IMAGE} alt={item.NAME} className="cart-image" />
                <div>
                  <strong>{item.NAME}</strong> x {item.quantity}
                </div>
                <div>${(item.PRICE * item.quantity).toFixed(2)}</div>
                <button
                  onClick={() => RemovefromCart(item.ID)}
                  className="remove-cart-button"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <h3>Total: ${totalPrice.toFixed(2)}</h3>
          <button onClick={handleCheckout} className="proceed-checkout-button">
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;