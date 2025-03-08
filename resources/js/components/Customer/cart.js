import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./../../../sass/components/cart.scss";
import attackShark from "../../../../resources/sass/img/cartmouse.svg";
import logo from "../../../../resources/sass/img/v.svg";
import Navbar from "../Customer/topvar_notlogin";
import Footer from "../footer/footer";
import { FaTrash } from "react-icons/fa";

function Cart() {
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Attack Shark X3", price: 2000, quantity: 1 },
    { id: 2, name: "Attack Shark X4", price: 2500, quantity: 1 },
  ]);

  const handleProductClick = () => {
    console.log("Product image clicked - to be linked to product info/overview via backend");
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setIsAllSelected(isChecked);
    if (isChecked) {
      const allProductIds = new Set(cartItems.map(item => item.id));
      setSelectedProducts(allProductIds);
    } else {
      setSelectedProducts(new Set());
    }
  };

  const handleRowSelect = (productId) => (e) => {
    const isChecked = e.target.checked;
    const newSelectedProducts = new Set(selectedProducts);
    if (isChecked) {
      newSelectedProducts.add(productId);
    } else {
      newSelectedProducts.delete(productId);
    }
    setSelectedProducts(newSelectedProducts);
    setIsAllSelected(newSelectedProducts.size === cartItems.length);
  };

  const handleDeleteAll = () => {
    console.log("Remove All clicked - to be linked to backend removal logic for products:", Array.from(selectedProducts));
    setCartItems(cartItems.filter(item => !selectedProducts.has(item.id)));
    setSelectedProducts(new Set());
    setIsAllSelected(false);
  };

  const handleQuantityChange = (id, delta) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-page-container">
      <Navbar />
      <div className="cart-content">
        <div className="cart-header">
          <img src={logo} alt="Logo" className="logo" />
          <span className="header-separator"> | </span>
          <span>Shopping Cart</span>
        </div>
        
        <table className="cart-table">
          <thead>
            <tr>
              <th className="actions-cell">
                <input
                  type="checkbox"
                  className="checkbox-icon"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                />
                <span>Actions</span>
              </th>
              <th>Product</th>
              <th>Product Price</th>
              <th>Quantity</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map(item => (
              <tr key={item.id}>
                <td className="actions-cell">
                  <input
                    type="checkbox"
                    className="checkbox-icon"
                    checked={selectedProducts.has(item.id)}
                    onChange={handleRowSelect(item.id)}
                  />
                  <FaTrash className="trash-icon" />
                </td>
                <td className="product-cell">
                  <div className="product-info">
                    <a href="#" onClick={handleProductClick} className="product-link">
                      <img src={attackShark} alt={item.name} className="product-image" />
                    </a>
                    <span className="product-name">{item.name}</span>
                  </div>
                </td>
                <td className="price-cell">₱{item.price}</td>
                <td className="quantity-cell">
                  <div className="quantity-control">
                    <button className="quantity-btn" onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button className="quantity-btn" onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                  </div>
                </td>
                <td className="total-cell">₱{item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Buttons and Total Price Container */}
        <div className="cart-button-container">
          <div className="cart-summary">
            <span className="total-label">Total Price:</span>
            <span className="total-amount">₱{totalPrice}</span>
          </div>
          {selectedProducts.size > 0 && (
            <button className="cart-delete-all-btn" onClick={handleDeleteAll}>
              Remove All
            </button>
          )}
          <button className="checkout-btn" onClick={handleCheckout}>
            Check Out
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Cart;