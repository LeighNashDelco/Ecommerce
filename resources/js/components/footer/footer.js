import React from 'react';
import "./../../../sass/components/footer.scss";
import logisticsLogo from "../../../../resources/sass/img/j&nt.svg"; // J&T Express logo
import facebookIcon from '../../../../resources/sass/img/facebook.svg';
import twitterIcon from '../../../../resources/sass/img/x.svg';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Wrapper for columns on the left */}
        <div className="footer-columns-wrapper">
          {/* Column 1: Shop */}
          <div className="footer-column">
            <h3>Shop</h3>
            <p>Gaming Mouse</p>
            <p>Wired & Wireless Mouse</p>
            <p>Office Mouse</p>
          </div>

          {/* Column 2: Support */}
          <div className="footer-column">
            <h3>Support</h3>
            <p>Get Help</p>
            <p>VeroStore Support</p>
          </div>

          {/* Column 3: Company */}
          <div className="footer-column">
            <h3>Company</h3>
            <p>About Us</p>
            <p>Careers</p>
            <p>Contact Us</p>
          </div>

          {/* Column 4: Logistics */}
          <div className="footer-column logistics">
            <h3>Logistics</h3>
            <img src={logisticsLogo} alt="J&T Express Logo" className="logistics-logo" />
          </div>

          {/* Column 5: Follow Us */}
          <div className="footer-column socials">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <img src={facebookIcon} alt="Facebook" className="social-icon" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <img src={twitterIcon} alt="Twitter/X" className="social-icon" />
              </a>
            </div>
          </div>
        </div>

        {/* Slogan on the far right */}
        <div className="footer-tagline">
          <p>FOR GAMERS. BY GAMERS.™</p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <div className="footer-bottom-left">
          <div className="footer-copyright">
            <span>Copyright © VERO Inc. All rights reserved.</span>
            <span className="separator"> | </span>
          </div>
          <div className="footer-links">
            <a href="/legal-terms">Legal Terms</a>
            <span className="separator"> | </span>
            <a href="/privacy">Privacy Policy</a>
            <span className="separator"> | </span>
            <a href="/cookie">Cookie Policy</a>
          </div>
        </div>
        <div className="footer-location">
          <p>Philippines</p>
          <span className="separator"> | </span>
          <a href="/change-location">Change Location</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;