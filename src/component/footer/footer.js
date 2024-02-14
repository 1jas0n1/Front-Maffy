import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaTwitter, FaInstagram, FaFacebook, FaWhatsapp, FaMapMarker, FaPhone, FaEnvelope } from 'react-icons/fa';
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer-distributed">
      <div className="footer-left">
        <h3>Mafy<span style={{ fontStyle: 'italic' }}>Store</span></h3>
        <p className="footer-links">
          <NavLink to="/">Home</NavLink> |
          <NavLink to="/about">About</NavLink> |
          <NavLink to="/contact">Contact</NavLink> |
          <NavLink to="/blog">Blog</NavLink>
        </p>
        <p className="footer-company-name">Copyright © 2023 <strong>Mafy Store</strong> All rights reserved</p>
      </div>

      <div className="footer-center">
        <div className='icon-central'>
          <FaMapMarker />
          <p><span>San Marcos</span> Carazo</p>
        </div>
        <div className='icon-central'>
          <FaPhone />
          <p>+505 8888-8888</p>
        </div>
        <div className='icon-central'>
          <FaEnvelope />
          <p><a href="mailto:mafystore@gmail.com">correo@gmail.com</a></p>
        </div>
      </div>

      <div className="footer-right">
        <p className="footer-company-about">
          <span>Acerca de Nosotros </span>
          <strong>Mafy Store</strong> es una tienda de Ropa ubicada en la ciudad de San Marcos Carazo
        </p>
        <div className="footer-icons">
          {/* Botones con espacio entre ellos */}
          <button className="icon-button">
            <FaTwitter />
          </button>
          <button className="icon-button">
            <FaInstagram />
          </button>
          <button className="icon-button">
            <FaFacebook />
          </button>
          <button className="icon-button">
            <FaWhatsapp />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
