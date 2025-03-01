import React from 'react';
import "./../../../sass/components/footer.scss";
import veroLogo from "../../../../resources/sass/img/veromain.svg";
import instagramIcon from '../../../../resources/sass/img/instagram.svg'; // Placeholder for Instagram icon
import facebookIcon from '../../../../resources/sass/img/facebook.svg'; // Placeholder for Facebook icon
import twitterIcon from '../../../../resources/sass/img/x.svg'; // Placeholder for Twitter/X icon

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <img src={veroLogo} alt="VERO Logo" className="logo" />
        </div>
        <div className="footer-columns">
          <div className="footer-column">
            <h3>Products</h3>
            <p>Gaming Mouse</p>
            <p>Wired & Wireless Mouse</p>
            <p>Office Mouse</p>
          </div>
          <div className="footer-column">
            <h3>Company</h3>
            <p>About</p>
            <p>Shop</p>
            <p>Newsletter</p>
          </div>
          <div className="footer-column">
            <h3>Support</h3>
            <p>Get Help</p>
          </div>
          <div className="footer-column socials">
            <h3>Socials</h3>
            <div className="social-icons">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <img src={instagramIcon} alt="Instagram" className="social-icon" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <img src={facebookIcon} alt="Facebook" className="social-icon" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <img src={twitterIcon} alt="Twitter/X" className="social-icon" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-copyright">
          <p>Copyright © VERO</p>
        </div>
        <div className="footer-links">
          <p>Terms of Service</p>
        </div>
        <div className="footer-back-to-top">
          <p>Back to top ↑</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;