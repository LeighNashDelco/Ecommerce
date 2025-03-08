import React from 'react';
import developerBackground from '../../../../resources/sass/img/devs.svg'; // Update the path to where your SVG is stored
import './../../../sass/components/developer.scss';
import Navbar from "../Customer/topvar_notlogin";


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