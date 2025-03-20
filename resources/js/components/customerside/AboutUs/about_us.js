import React, { useState, useEffect } from 'react';
import { message } from 'antd'; // Import Ant Design message
import './../../../../sass/components/about_us.scss';
import aboutUsImage from '../../../../../resources/sass/img/aboutvero.svg';
import aboutUsImage1 from '../../../../../resources/sass/img/vero_sign.svg';
import aboutUsImage2 from '../../../../../resources/sass/img/aboutus_mouse.svg';
import Navbar from "../../customerside/Customer/topnav_login";
import Footer from "../footer/footer";
import OrdersCart from "../CartModals/orders_cart";

function AboutUs() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [profileId, setProfileId] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('LaravelPassportToken');
    return token ? {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    } : { 'Content-Type': 'application/json' };
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('LaravelPassportToken');
        if (token) {
          const userResponse = await fetch('http://127.0.0.1:8000/api/user-profile', {
            headers: getAuthHeaders(),
          });
          if (!userResponse.ok) throw new Error('Failed to fetch user profile');
          const userData = await userResponse.json();
          const profileResponse = await fetch(`http://127.0.0.1:8000/api/profiles/user/${userData.user.id}`, {
            headers: getAuthHeaders(),
          });
          if (!profileResponse.ok) throw new Error('Failed to fetch profile ID');
          const profileData = await profileResponse.json();
          setProfileId(profileData.id);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const handleAddToCart = async (productId = 1) => { // Default product ID for demo
    if (!profileId) {
      message.error({
        content: 'Please log in to add items to your cart.',
        style: { marginTop: '20px' },
      });
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/cart/add', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ profile_id: profileId, product_id: productId, quantity: 1 }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to add to cart');
      setIsCartOpen(true);
      message.success({
        content: 'Item added to cart successfully!',
        style: { marginTop: '20px' },
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      message.error({
        content: `Failed to add item to cart: ${error.message}`,
        style: { marginTop: '20px' },
      });
    }
  };

  return (
    <div className="about-us-page">
      <Navbar onCartClick={toggleCart} />
      <div className="content-wrapper">
        <div className="about-us-section">
          <img src={aboutUsImage} alt="About Us" className="about-us-image" />
        </div>
        <div className="about-us-text-section">
          <div className="text-row">
            <img src={aboutUsImage1} alt="About VERO Image" className="text-row-image" />
            <div className="text-column">
              <h2>ABOUT VERO</h2>
              <p>
                The logo of VERO represents precision and accuracy—core principles that define our brand. Like a marksman who never misses, VERO delivers peak performance for gamers who demand the best. VERO is a gaming peripherals brand dedicated to high-performance gaming mice. We engineer our mice for precision, speed, and reliability, ensuring an elite gaming experience for players worldwide. With a commitment to affordability, innovation, and top-tier standards, VERO empowers gamers with the tools they need to dominate every match.
              </p>
            </div>
          </div>
          <div className="text-row">
            <div className="text-column">
              <h2>WHO ARE WE?</h2>
              <p>
                We are a team dedicated to pushing the boundaries of gaming performance, driven by a passion for precision and innovation. Our team consists of gamers, software engineers, and product designers—all united by a mission to redefine gaming peripherals. At VERO, we believe every player deserves access to high-performance gaming mice engineered for speed, accuracy, and reliability. We are committed to involving our community in the development process, ensuring that our products are shaped by the needs of real gamers. Our mission is simple: to make elite gaming mice accessible to all players. Join us, challenge the industry, and take your game to the next level with VERO.
              </p>
            </div>
            <img src={aboutUsImage2} alt="Who Are We Image" className="text-row-image" />
          </div>
        </div>
      </div>
      <Footer />
      <OrdersCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} profileId={profileId} />
    </div>
  );
}

export default AboutUs;