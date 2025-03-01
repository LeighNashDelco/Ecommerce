import React, { useEffect, useRef } from 'react';
import "./../../../sass/components/logo_slider.scss";
import logo1 from '../../../../resources/sass/img/corsair.svg'; // Replace with your actual logo paths
import logo3 from '../../../../resources/sass/img/logitech.svg';
import logo4 from '../../../../resources/sass/img/scyrox.svg';
import logo5 from '../../../../resources/sass/img/vxe.svg';
import logo6 from '../../../../resources/sass/img/hitscan.svg';
import logo7 from '../../../../resources/sass/img/lamzu.svg';
import logo8 from '../../../../resources/sass/img/razer.svg';

function LogoSlider() {
  const logosRef = useRef(null);

  useEffect(() => {
    // Clone the slide to create the infinite loop effect
    const slide = logosRef.current.querySelector('.logos-slide');
    const clone = slide.cloneNode(true);
    logosRef.current.appendChild(clone);
  }, []);

  return (
    <div className="logos" ref={logosRef}>
      <div className="logos-slide">
        <img src={logo1} alt="3M Logo" />
        <img src={logo3} alt="Budweiser Logo" />
        <img src={logo4} alt="BuzzFeed Logo" />
        <img src={logo5} alt="Forbes Logo" />
        <img src={logo6} alt="Macy's Logo" />
        <img src={logo7} alt="Men's Health Logo" />
        <img src={logo8} alt="MrBeast Logo" />
      </div>
    </div>
  );
}

export default LogoSlider;