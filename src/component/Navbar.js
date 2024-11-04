import React, { useState } from "react";
import { Navbar, Nav } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import { FaBars } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { FaUserLock } from "react-icons/fa";
import { FaArrowRightToBracket } from "react-icons/fa6";
import Cookies from 'js-cookie'; 
import "./navbar.css";

const MyNavbar = () => {
  const [mobile, setMobile] = useState(false);
  const IdUser = Cookies.get('_id');
  const correo = Cookies.get('email');

  const handleToggle = () => {
    setMobile(!mobile);
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      const response = await fetch('https://apitammy-closset.fra1.zeabur.app/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': Cookies.get('token'),
        },
      });
      if (!response.ok) {
        console.error('Error al añadir token a la blacklist', response.status, response.statusText);
      }
      Cookies.remove('token');
      Cookies.remove('_id');
      Cookies.remove('email');
      window.location.reload();
      window.location.href = "/";
    } catch (error) {
      console.error('Error al realizar la petición', error);
    }
  };

  return (
    <Navbar style={{ marginLeft: '0 auto' }} bg="dark" expand="lg" variant="dark">
      <Nav.Link href="/index" to="/index" >
        <Navbar.Brand style={{ marginLeft: '0', fontSize: '30px', fontFamily: 'MV Boli' }}>
          Tammys<span style={{ color: '#E61B79', fontFamily: 'MV Boli' }}>Closet</span>
        </Navbar.Brand>
      </Nav.Link>
      <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={handleToggle}>
        {mobile ? <ImCross /> : <FaBars />}
      </Navbar.Toggle>

      <Nav.Link style={{ marginRight: '45px', marginLeft: '5px', width: '15%', borderRadius: '3px', color: 'white' }}>
        {correo} <FaUserLock />
      </Nav.Link>
      
      <Nav>
        <Nav.Link onClick={handleLogout} style={{ marginLeft: '5px' }} className="ml-auto">
          Cerrar Sesión <FaArrowRightToBracket />
        </Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default MyNavbar;
