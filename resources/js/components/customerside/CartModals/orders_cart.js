import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './../../../../sass/components/orders_cart.scss';
import mouseCart from './../../../../../resources/sass/img/ATKCOLOR.svg';

function OrdersCart({ isOpen, onClose, profileId, fetchCartCount = () => {} }) {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const getAuthHeaders = () => {
    const token = localStorage.getItem('LaravelPassportToken');
    return token ? {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    } : { 'Content-Type': 'application/json' };
  };

  useEffect(() => {
    if (!profileId || !isOpen) return;

    const fetchCartItems = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/cart/${profileId}`, {
          headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch cart');
        const data = await response.json();
        const items = data.success && Array.isArray(data.data) ? data.data : [];
        setCartItems(items);
        setSelectedItems(new Set());
        setSelectAll(false);
      } catch (error) {
        console.error('Error fetching cart:', error);
        setCartItems([]);
        setErrorMessage('Failed to load cart items. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [profileId, isOpen]);

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    setSelectedItems(checked ? new Set(cartItems.map(item => item.product_id)) : new Set());
    setErrorMessage('');
  };

  const handleSelectItem = (productId) => (e) => {
    const newSelected = new Set(selectedItems);
    if (e.target.checked) newSelected.add(productId);
    else newSelected.delete(productId);
    setSelectedItems(newSelected);
    setSelectAll(newSelected.size === cartItems.length);
    setErrorMessage('');
  };

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
      setCartItems((prevItems) =>
        prevItems.map((i) => (i.product_id === productId ? { ...i, quantity: i.quantity - 1 } : i))
      );
      setErrorMessage('');
      if (typeof fetchCartCount === 'function') fetchCartCount();
    } catch (error) {
      console.error('Error decreasing quantity:', error);
      setErrorMessage('Failed to update quantity. Please try again.');
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
      setCartItems((prevItems) =>
        prevItems.map((i) => (i.product_id === productId ? { ...i, quantity: i.quantity + 1 } : i))
      );
      setErrorMessage('');
      if (typeof fetchCartCount === 'function') fetchCartCount();
    } catch (error) {
      console.error('Error increasing quantity:', error);
      setErrorMessage('Failed to update quantity. Please try again.');
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
      setCartItems((prevItems) => prevItems.filter((i) => i.product_id !== productId));
      setSelectedItems((prev) => {
        const newSelected = new Set(prev);
        newSelected.delete(productId);
        return newSelected;
      });
      setErrorMessage('');
      if (typeof fetchCartCount === 'function') fetchCartCount();
    } catch (error) {
      console.error('Error removing item:', error);
      setErrorMessage('Failed to remove item. Please try again.');
    }
  };

  const handleCheckout = () => {
    if (selectedItems.size === 0) {
      setErrorMessage('Please select at least one item to checkout.');
      return;
    }
    const itemsToCheckout = cartItems.filter(item => selectedItems.has(item.product_id));
    console.log('Navigating to /payment_methods with:', { items: itemsToCheckout, profileId });
    navigate('/payment_methods', { state: { items: itemsToCheckout, profileId } });
    onClose();
  };

  const handleViewCart = () => {
    navigate('/cart');
    onClose();
  };

  const totalPrice = cartItems
    .filter(item => selectedItems.has(item.product_id))
    .reduce((total, item) => total + item.price * item.quantity, 0);
  const selectedItemCount = selectedItems.size;

  if (!isOpen) return null;

  return (
    <div className={`cart-modal ${isOpen ? 'open' : ''}`}>
      <div className="cart-modal-content">
        <div className="cart-header">
          <div className="cart-title">
            <h2>Cart</h2>
            <span className="cart-count">{cartItems.length}</span>
          </div>
          <button className="close-button" onClick={onClose} aria-label="Close cart">✖</button>
        </div>
        {loading && <div className="loading">Loading your cart...</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <div className="select-all">
          <label>
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              disabled={cartItems.length === 0 || loading}
            />
            Select All
          </label>
        </div>
        <div className="cart-items">
          {cartItems.length === 0 && !loading ? (
            <p className="empty-cart">Your cart is empty</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.product_id} className="cart-item">
                <input
                  type="checkbox"
                  checked={selectedItems.has(item.product_id)}
                  onChange={handleSelectItem(item.product_id)}
                  className="item-checkbox"
                  disabled={loading}
                />
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
                      disabled={item.quantity <= 1 || loading}
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => handleIncreaseQuantity(item.product_id)}
                      disabled={item.quantity >= item.quantity_available || loading}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="remove-button"
                    onClick={() => handleRemoveItem(item.product_id)}
                    disabled={loading}
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
            Total: <span>₱{totalPrice.toLocaleString()}</span>
          </p>
          <div className="cart-actions">
            <button
              className="view-cart-button secondary"
              onClick={handleViewCart}
              disabled={loading}
            >
              View Cart
            </button>
            <button
              className="view-cart-button primary"
              onClick={handleCheckout}
              disabled={cartItems.length === 0 || loading || selectedItems.size === 0}
            >
              Checkout Selected ({selectedItems.size})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrdersCart;