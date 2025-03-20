import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './../../../../sass/components/orders_cart.scss';
import mouseCart from './../../../../../resources/sass/img/ATKCOLOR.svg';

function OrdersCart({ isOpen, onClose, profileId }) {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  let isMounted = true;

  const getAuthHeaders = () => {
    const token = localStorage.getItem('LaravelPassportToken');
    return token ? {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    } : { 'Content-Type': 'application/json' };
  };

  useEffect(() => {
    if (!profileId || !isOpen) {
      setLoading(false);
      return;
    }

    const fetchCartItems = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/cart/${profileId}`, {
          headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch cart');
        const data = await response.json();
        if (isMounted) {
          setCartItems(data.success && Array.isArray(data.data) ? data.data : []);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        if (isMounted) setCartItems([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCartItems();

    return () => {
      isMounted = false; // Cleanup to prevent state updates on unmounted component
    };
  }, [profileId, isOpen]);

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleDecreaseQuantity = async (productId) => {
    const item = cartItems.find((i) => i.product_id === productId);
    if (item.quantity <= 1) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/cart/update`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ profile_id: profileId, product_id: productId, quantity: item.quantity - 1 }),
      });
      if (!response.ok) throw new Error('Failed to update quantity');
      if (isMounted) {
        setCartItems((prevItems) =>
          prevItems.map((i) =>
            i.product_id === productId ? { ...i, quantity: i.quantity - 1 } : i
          )
        );
      }
    } catch (error) {
      console.error('Error decreasing quantity:', error);
    }
  };

  const handleIncreaseQuantity = async (productId) => {
    const item = cartItems.find((i) => i.product_id === productId);
    if (item.quantity >= item.quantity_available) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/cart/update`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ profile_id: profileId, product_id: productId, quantity: item.quantity + 1 }),
      });
      if (!response.ok) throw new Error('Failed to update quantity');
      if (isMounted) {
        setCartItems((prevItems) =>
          prevItems.map((i) =>
            i.product_id === productId ? { ...i, quantity: i.quantity + 1 } : i
          )
        );
      }
    } catch (error) {
      console.error('Error increasing quantity:', error);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/cart/remove`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        body: JSON.stringify({ profile_id: profileId, product_id: productId }),
      });
      if (!response.ok) throw new Error('Failed to remove item');
      if (isMounted) {
        setCartItems((prevItems) => prevItems.filter((i) => i.product_id !== productId));
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleCheckout = () => {
    navigate('/payment_methods');
    onClose();
  };

  if (loading && isOpen) return <div>Loading cart...</div>;

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
          {cartItems.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.product_id} className="cart-item">
                <img
                  src={item.product_img ? `http://127.0.0.1:8000/${item.product_img}` : mouseCart}
                  alt={item.product_name}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h3>{item.product_name}</h3>
                  <p className="price">₱{item.price.toLocaleString()}</p>
                  <p className="variant">Available: {item.quantity_available}</p>
                  <div className="quantity-controls">
                    <button
                      onClick={() => handleDecreaseQuantity(item.product_id)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => handleIncreaseQuantity(item.product_id)}
                      disabled={item.quantity >= item.quantity_available}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="remove-button"
                    onClick={() => handleRemoveItem(item.product_id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="cart-footer">
          <p className="shipping-note">Shipping will be calculated at checkout</p>
          <p className="total-price">
            Total Price: <span>₱{totalPrice.toLocaleString()} PHP</span>
          </p>
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