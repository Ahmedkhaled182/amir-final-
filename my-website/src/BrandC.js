import React, { useState, useEffect } from 'react';
import './brand.css';

const BrandC = ({ addToCart }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:555/products/BrandC')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  return (
    <div className="brand-page">
      <h1>Brand C</h1>
      <div className="product-list">
        {products.map((product) => (
          <div key={product.ID} className="product-card">
            <img src={product.IMAGE} alt={product.NAME} className="product-image" />
            <h2>{product.NAME}</h2>
            <p>${product.PRICE}</p>
            <button onClick={() => addToCart(product)} className="add-to-cart-button">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandC;