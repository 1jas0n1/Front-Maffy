import React from 'react';
import {  FaMapMarker, FaPhone, FaEnvelope } from 'react-icons/fa';
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer-distributed">
      <div className="footer-left">
        <h3>Tammys<span style={{ fontStyle: 'italic' }}> Closet</span></h3>
        <br></br>
        <p className="footer-company-name">Copyright © 2024 <strong>Tammy´s Closet</strong> All rights reserved</p>
      </div>

      <div className="footer-center" style={{alignItems:'center'}} >

      </div>
      <div className="footer-right">
        <p className="footer-company-about" style={{color:'white',textAlign:'center'}} >
          <span style={{textAlign:'center'}} >Acerca de Nosotros </span>
          <strong>Tammy´s Closset</strong> es una tienda de Ropa ubicada en la ciudad de San Marcos
        </p>
        <div className="footer-icons">
        </div>
      </div>
    </footer>
  );
};

export default Footer;
