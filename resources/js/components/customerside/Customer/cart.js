import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./../../../../sass/components/cart.scss";
import attackShark from "../../../../../resources/sass/img/cartmouse.svg";
import logo from "../../../../../resources/sass/img/v.svg";
import Navbar from "../../customerside/Customer/topnav_login";
import Footer from "../footer/footer";
import { FaTrash } from "react-icons/fa";

function Cart() {
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const profileId = localStorage.getItem('profileId');

  const getAuthHeaders = () => {
    const token = localStorage.getItem('LaravelPassportToken');
    return token ? {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    } : { 'Content-Type': 'application/json' };
  };

  useEffect(() => {
    let isMounted = true;
    const fetchCartItems = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/cart/${profileId}`, {
          headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (isMounted) {
          const items = Array.isArray(data.data) ? data.data : [];
          setCartItems(items.map(item => ({
            id: item.product_id || item.id,
            name: item.product_name || item.name,
            price: item.price,
            quantity: item.quantity,
            quantityAvailable: item.quantity_available || item.quantityAvailable,
            product_img: item.product_img,
          })));
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
        if (isMounted) setCartItems([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCartItems();
    return () => { isMounted = false; };
  }, [profileId]);

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setIsAllSelected(isChecked);
    setSelectedProducts(isChecked ? new Set(cartItems.map(item => item.id)) : new Set());
  };

  const handleRowSelect = (productId) => (e) => {
    const newSelected = new Set(selectedProducts);
    if (e.target.checked) newSelected.add(productId);
    else newSelected.delete(productId);
    setSelectedProducts(newSelected);
    setIsAllSelected(newSelected.size === cartItems.length);
  };

  // Copied and adapted from PaymentMethods for single item removal
  const handleRemoveItem = async (productId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/cart/remove`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        body: JSON.stringify({ profile_id: profileId, product_id: productId }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.log('Server response:', errorData); // Debug
        throw new Error(errorData.message || 'Failed to remove item');
      }
      setCartItems((prevItems) => prevItems.filter((i) => i.id !== productId));
      setSelectedProducts((prev) => {
        const newSelected = new Set(prev);
        newSelected.delete(productId);
        return newSelected;
      });
      setIsAllSelected(false);
      setErrorMessage('');
    } catch (error) {
      console.error('Error removing item:', error);
      setErrorMessage(error.message || 'Failed to remove item. Please try again.');
    }
  };

  // Handle multiple item removal by calling handleRemoveItem for each selected product
  const handleDeleteSelected = async () => {
    if (selectedProducts.size === 0) {
      setErrorMessage('Please select items to remove.');
      return;
    }

    try {
      // Loop through selected products and remove each one
      for (const productId of selectedProducts) {
        await handleRemoveItem(productId);
      }
    } catch (error) {
      console.error('Error removing selected items:', error);
      setErrorMessage('Some items could not be removed. Please try again.');
    }
  };

  const handleDeleteSingle = (productId) => () => {
    handleRemoveItem(productId);
  };

  const handleQuantityChange = async (id, delta) => {
    const item = cartItems.find(item => item.id === id);
    const newQuantity = Math.max(1, Math.min(item.quantityAvailable, item.quantity + delta));
    try {
      const response = await fetch('http://127.0.0.1:8000/api/cart/update', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ profile_id: profileId, product_id: id, quantity: newQuantity }),
      });
      if (!response.ok) throw new Error('Failed to update quantity');
      setCartItems(cartItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleCheckout = () => {
    const itemsToCheckout = selectedProducts.size > 0 
      ? cartItems.filter(item => selectedProducts.has(item.id)) 
      : cartItems;
    navigate('/payment_methods', { state: { items: itemsToCheckout } });
  };

  const totalPrice = cartItems
    .filter(item => selectedProducts.size === 0 || selectedProducts.has(item.id))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) {
    return (
      <div className="cart-page-container">
        <Navbar />
        <div className="cart-content">Loading cart...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <Navbar />
      <div className="cart-content">
        <div className="cart-header">
          <img src={logo} alt="Logo" className="logo" />
          <span className="header-separator"> | </span>
          <span>Shopping Cart</span>
        </div>

        {errorMessage && (
          <div style={{ color: '#ff4444', marginBottom: '20px', textAlign: 'center', fontSize: '16px' }}>
            {errorMessage}
          </div>
        )}

        <table className="cart-table">
          <thead>
            <tr>
              <th className="actions-cell">
                <div className="select-all-container">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                </div>
              </th>
              <th className="product-cell">Product</th>
              <th className="price-cell">Price</th>
              <th className="quantity-cell">Quantity</th>
              <th className="total-cell">Total</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-cart">Your cart is empty. Start shopping!</td>
              </tr>
            ) : (
              cartItems.map(item => (
                <tr key={item.id}>
                  <td className="actions-cell" data-label="Select">
                    <div className="actions-container">
                      <input
                        type="checkbox"
                        className="checkbox-icon"
                        checked={selectedProducts.has(item.id)}
                        onChange={handleRowSelect(item.id)}
                      />
                      <FaTrash
                        className="trash-icon"
                        onClick={handleDeleteSingle(item.id)}
                      />
                    </div>
                  </td>
                  <td className="product-cell" data-label="Product">
                    <div className="product-info">
                      <img
                        src={item.product_img ? `http://127.0.0.1:8000/${item.product_img}` : attackShark}
                        alt={item.name}
                        className="product-image"
                      />
                      <span className="product-name">{item.name}</span>
                    </div>
                  </td>
                  <td className="price-cell" data-label="Price">₱{item.price.toLocaleString()}</td>
                  <td className="quantity-cell" data-label="Quantity">
                    <div className="quantity-control">
                      <button
                        onClick={() => handleQuantityChange(item.id, -1)}
                        disabled={item.quantity <= 1}
                      >-</button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, 1)}
                        disabled={item.quantity >= item.quantityAvailable}
                      >+</button>
                    </div>
                    <span className="quantity-available">Available: {item.quantityAvailable}</span>
                  </td>
                  <td className="total-cell" data-label="Total">₱{(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary">
              Total ({selectedProducts.size || cartItems.length} items): 
              <span className="total-amount"> ₱{totalPrice.toLocaleString()}</span>
            </div>
            <button
              className="remove-selected-btn"
              onClick={handleDeleteSelected}
              disabled={selectedProducts.size === 0}
            >
              Remove Selected
            </button>
            <button
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
            >
              Check Out
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Cart;