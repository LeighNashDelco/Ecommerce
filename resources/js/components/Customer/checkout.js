import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../../../sass/components/checkout.scss";
import attackShark from "../../../../resources/sass/img/cartmouse.svg";
import logo from "../../../../resources/sass/img/v.svg";
import Navbar from "../Customer/topvar_notlogin";
import Footer from "../footer/footer";
import { FaTrash } from "react-icons/fa";
// Import BPI and BDO logos (replace with actual paths to your logo files)
import bpiLogo from "../../../../resources/sass/img/bpi.svg";
import bdoLogo from "../../../../resources/sass/img/bdo.svg";

function Checkout() {
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("Linked Bank Account"); // State for payment method navigation

  // Sample checkout items
  const [checkoutItems, setCheckoutItems] = useState([
    { id: 1, name: "Attack Shark X3", price: 2000, quantity: 1 },
    { id: 2, name: "Attack Shark X4", price: 2000, quantity: 1 },
  ]);

  const handleProductClick = () => {
    console.log("Product image clicked - to be linked to product info/overview via backend");
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setIsAllSelected(isChecked);
    if (isChecked) {
      const allProductIds = new Set(checkoutItems.map((item) => item.id));
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
    setIsAllSelected(newSelectedProducts.size === checkoutItems.length);
  };

  const handleDeleteAll = () => {
    console.log(
      "Remove All clicked - to be linked to backend removal logic for products:",
      Array.from(selectedProducts)
    );
    setCheckoutItems(checkoutItems.filter((item) => !selectedProducts.has(item.id)));
    setSelectedProducts(new Set());
    setIsAllSelected(false);
  };

  const handleQuantityChange = (id, delta) => {
    setCheckoutItems(
      checkoutItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const handleCheckout = () => {
    navigate("/checkout"); // Update with actual checkout logic
  };

  // Calculate total price dynamically
  const totalPrice = checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 100;
  const grandTotal = totalPrice + shipping;

  return (
    <div className="checkout-main-wrapper">
      <Navbar />
      <div className="checkout-main-content">
        <div className="checkout-header">
          <img src={logo} alt="Logo" className="checkout-logo" />
          <span className="checkout-separator"> | </span>
          <span>Order Summary</span>
        </div>

        <div className="checkout-table-wrapper">
          <table className="checkout-order-table">
            <thead>
              <tr>
                <th className="checkout-actions-cell">
                  <input
                    type="checkbox"
                    className="checkout-checkbox"
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
              {checkoutItems.map((item) => (
                <tr key={item.id}>
                  <td className="checkout-actions-cell">
                    <input
                      type="checkbox"
                      className="checkout-checkbox"
                      checked={selectedProducts.has(item.id)}
                      onChange={handleRowSelect(item.id)}
                    />
                    <FaTrash className="checkout-trash-icon" />
                  </td>
                  <td className="checkout-product-cell">
                    <div className="checkout-product-info">
                      <a href="#" onClick={handleProductClick} className="checkout-product-link">
                        <img
                          src={attackShark}
                          alt={item.name}
                          className="checkout-product-image"
                        />
                      </a>
                      <div className="checkout-product-details">
                        <span className="checkout-product-name">{item.name}</span>
                        <span className="checkout-product-extras">
                          Free standard shipping, Free Returns
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="checkout-price-cell">₱{item.price}</td>
                  <td className="checkout-quantity-cell">
                    <div className="checkout-quantity-control">
                      <button
                        className="checkout-quantity-btn"
                        onClick={() => handleQuantityChange(item.id, -1)}
                      >
                        -
                      </button>
                      <span className="checkout-quantity-value">{item.quantity}</span>
                      <button
                        className="checkout-quantity-btn"
                        onClick={() => handleQuantityChange(item.id, 1)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="checkout-total-cell">₱{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="checkout-payment-section">
          <div className="checkout-delivery-address">
            <h2>Delivery Address</h2>
            <div className="checkout-address-content">
              <p>Zone 6 960-B RCES, Baan Riverside, (Bgy. 9), Butuan City, Mindanao, Agusan del Norte 8600</p>
              <a href="#" className="checkout-change-address">
                Change
              </a>
            </div>
          </div>

          <div className="checkout-payment-methods">
            <h2>Payment Method</h2>
            <div className="checkout-payment-steps">
              <span
                className={`checkout-step ${paymentMethod === "Linked Bank Account" ? "active" : ""}`}
                onClick={() => setPaymentMethod("Linked Bank Account")}
              >
                Linked Bank Account
              </span>
              <span
                className={`checkout-step ${paymentMethod === "Credit/Debit Card" ? "active" : ""}`}
                onClick={() => setPaymentMethod("Credit/Debit Card")}
              >
                Credit / Debit Card
              </span>
              <span
                className={`checkout-step ${paymentMethod === "Cash on Delivery" ? "active" : ""}`}
                onClick={() => setPaymentMethod("Cash on Delivery")}
              >
                Cash on Delivery
              </span>
            </div>

            {/* Conditionally render payment options based on selected method */}
            {paymentMethod === "Linked Bank Account" && (
              <div className="checkout-payment-options">
                <label className="checkout-payment-option checkout-payment-option-bpi">
                  <input type="radio" name="payment-method" />
                  <div className="checkout-payment-content">
                    <img src={bpiLogo} alt="BPI Logo" className="checkout-payment-logo" />
                    <span className="checkout-payment-label">
                      Payment (min. ₱100) should be done within 1 hr upon checkout. Accessible between 6AM to 9PM.
                    </span>
                  </div>
                </label>
                <label className="checkout-payment-option">
                  <input type="radio" name="payment-method" />
                  <div className="checkout-payment-content">
                    <img src={bdoLogo} alt="BDO Logo" className="checkout-payment-logo" />
                    <span className="checkout-payment-label">
                      Payment should be done within 1 hr upon checkout. Accessible between 6AM to 9PM.
                    </span>
                  </div>
                </label>
              </div>
            )}

            {paymentMethod === "Credit/Debit Card" && (
              <div className="checkout-credit-debit-form">
                <div className="checkout-form-group">
                  <label htmlFor="cardholder-name">Cardholder Name</label>
                  <input
                    type="text"
                    id="cardholder-name"
                    placeholder="Cardholder Name"
                    className="checkout-form-input"
                  />
                </div>
                <div className="checkout-form-group">
                  <label htmlFor="card-number">Card Number</label>
                  <input
                    type="text"
                    id="card-number"
                    placeholder="Card Number"
                    className="checkout-form-input"
                  />
                </div>
                <div className="checkout-form-row">
                  <div className="checkout-form-group checkout-form-group-small">
                    <label htmlFor="month">Month</label>
                    <select id="month" className="checkout-form-select">
                      <option value="">Month</option>
                      {[...Array(12).keys()].map((i) => (
                        <option key={i + 1} value={i + 1}>
                          {(i + 1).toString().padStart(2, "0")}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="checkout-form-group checkout-form-group-small">
                    <label htmlFor="year">Year</label>
                    <select id="year" className="checkout-form-select">
                      <option value="">Year</option>
                      {[...Array(10).keys()].map((i) => (
                        <option key={i} value={2023 + i}>
                          {2023 + i}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="checkout-form-group checkout-form-group-small">
                    <label htmlFor="cvc">CVC</label>
                    <input
                      type="text"
                      id="cvc"
                      placeholder="CVC"
                      className="checkout-form-input"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "Cash on Delivery" && (
              <div className="checkout-cash-on-delivery">
                <p>Pay with cash upon delivery. Please have exact change ready.</p>
              </div>
            )}
          </div>

          <div className="checkout-shipping-method">
            <h2>Shipping Method</h2>
            <div className="checkout-shipping-options">
              <label className="checkout-shipping-option">
                <input type="radio" name="shipping-method" defaultChecked />
                <div className="checkout-shipping-content">
                  <span className="checkout-shipping-label">Standard Shipping: 5-7 Business Days</span>
                  <span className="checkout-shipping-price">$50</span>
                </div>
              </label>
              <label className="checkout-shipping-option">
                <input type="radio" name="shipping-method" />
                <div className="checkout-shipping-content">
                  <span className="checkout-shipping-label">Standard Shipping: 5-7 Business Days</span>
                  <span className="checkout-shipping-price">$50</span>
                </div>
              </label>
              <label className="checkout-shipping-option">
                <input type="radio" name="shipping-method" />
                <div className="checkout-shipping-content">
                  <span className="checkout-shipping-label">Standard Shipping: 5-7 Business Days</span>
                  <span className="checkout-shipping-price">$50</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="checkout-final-totals">
          <span>Shipping subtotal: ₱{shipping}</span>
          <span>Total Price: ₱{grandTotal}</span>
          <button className="checkout-final-btn" onClick={handleCheckout}>
            Check Out
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Checkout;