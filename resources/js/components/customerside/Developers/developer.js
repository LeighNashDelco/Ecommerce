import React from 'react';
import developerBackground from '../../../../../resources/sass/img/devs.svg'; 
import './../../../../sass/components/developer.scss';
import Navbar from "../../customerside/Customer/topnav_login";


function Developer() {
  return (
    <div className="developer-page-container">
      <Navbar />
      <div 
        className="developer-background" 
        style={{ backgroundImage: `url(${developerBackground})` }}
      />
     
    </div>
  );
}

export default Developer;