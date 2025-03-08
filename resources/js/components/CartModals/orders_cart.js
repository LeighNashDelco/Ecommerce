import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './../../../sass/components/orders_cart.scss'; // Adjust the path if needed
import mouseCart from '../../../../resources/sass/img/ATKCOLOR.svg'; // Import the image for Attack Shark X3PRO

function OrdersCart({ isOpen, onClose }) {
  const navigate = useNavigate(); // Initialize useNavigate

  // State to manage cart items and their quantities
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Attack Shark X3PRO Three Modes 8K Gaming Mouse',
      price: 2000,
      variant: 'Black with tape',
      quantity: 1,
      image: mouseCart,
    },
    {
      id: 2,
      name: 'Attack Shark X3PRO Three Modes 8K Gaming Mouse',
      price: 2000,
      variant: 'Black with tape',
      quantity: 1,
      image: mouseCart,
    },
  ]);

  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // Calculate total item count (sum of quantities)
  const totalItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Handle quantity changes
  const handleDecreaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleIncreaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Handle Checkout button click
  const handleCheckout = () => {
    // Navigate to PaymentMethods page without passing state
    navigate('/payment_methods');
    onClose(); // Close the modal after navigation
  };

  return (
    <div className={`cart-modal ${isOpen ? 'open' : ''}`}>
      <div className="cart-modal-content">
        <div className="cart-header">
          <div className="cart-title">
            <h2>Cart</h2>
            <span className="cart-count">{totalItemCount}</span>
          </div>
          <button className="close-button" onClick={onClose}>✖</button>
        </div>
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-image" />
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p className="price">₱{item.price.toLocaleString()}</p>
                <p className="variant">{item.variant}</p>
                <div className="quantity-controls">
                  <button
                    onClick={() => handleDecreaseQuantity(item.id)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleIncreaseQuantity(item.id)}>+</button>
                </div>
                <button className="remove-button" onClick={() => handleRemoveItem(item.id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-footer">
          <p className="shipping-note">Shipping will be calculated at checkout</p>
          <p className="total-price">Total Price: <span>₱{totalPrice.toLocaleString()} PHP</span></p>
          <div className="cart-actions">
            <button className="view-cart-button secondary">View cart</button>
            <button className="view-cart-button primary" onClick={handleCheckout}>
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrdersCart;