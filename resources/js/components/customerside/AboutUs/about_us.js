import React from 'react';
import './../../../../sass/components/about_us.scss';
import aboutUsImage from '../../../../../resources/sass/img/aboutvero.svg'; // Existing SVG (adjust path as needed)
import aboutUsImage1 from '../../../../../resources/sass/img/vero_sign.svg'; // Placeholder for "About VERO" image
import aboutUsImage2 from '../../../../../resources/sass/img/aboutus_mouse.svg'; // Placeholder for "Who Are We" image
import Navbar from "../../customerside/Customer/topnav_login";
import Footer from "../footer/footer";

function AboutUs() {
  return (
    <div className="about-us-page">
      <Navbar />
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
    </div>
  );
}

export default AboutUs;