import React, { useState } from "react";
import { Navbar, Nav, NavDropdown,Modal,Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaBars } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { FaUserLock } from "react-icons/fa";
import { FaArrowRightToBracket } from "react-icons/fa6";
import { FaRegUserCircle } from "react-icons/fa";
import Cookies from 'js-cookie'; 
import axios from 'axios'
import "./navbar.css";

const MyNavbar = () => {
  const [showModal, setShowModal] = useState(false); 
  const [userRoles, setUserRoles] = useState([]);
  const [mobile, setMobile] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const IdUser = Cookies.get('_id')
  const correo = Cookies.get('email')

  const handleToggle = () => {
    setMobile(!mobile);
  };

 const mapRoleName = (roleName) => {
    switch (roleName) {
      case 'moderator':
        return 'Vendedor';
      case 'admin':
        return 'Administrador';
      case 'user':
        return 'Usuario';
      default:
        return roleName;
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`https://apimafy.zeabur.app/user/roles/${IdUser}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const sortedRoles = response.data.roles.sort((a, b) => {
        const order = { user: 1, moderator: 2, admin: 3 };
        return order[a.name] - order[b.name];
      });

      setUserRoles(sortedRoles);
      setUserInfo({ roles: sortedRoles });
      console.log('Roles del usuario:', sortedRoles);
    } catch (error) {
      console.error('Error al realizar la petición:', error);
    }
  };


  const handleShowModal = () => {
    setShowModal(true);
    fetchRoles();
  };


  const handleLogout = async () => {
    try {
    localStorage.removeItem('token');
        const response = await fetch('https://apimafy.zeabur.app/api/auth/logout', {
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
<Navbar.Brand style={{ marginLeft: '0', fontSize: '30px', fontFamily: 'MV Boli' }} >Tammys<span style={{ color: '#E61B79', fontFamily: 'MV Boli' }}>Closet</span></Navbar.Brand>
         </Nav.Link>

      <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={handleToggle}>
        {mobile ? <ImCross /> : <FaBars />}
      </Navbar.Toggle>
      

      <Nav.Link style={{ marginRight: '45px',marginLeft:'5px',width:'15%',borderRadius:'3px' }} className="ml-auto" onClick={handleShowModal}>
            {correo} <button style={{ color: 'white' }}> <FaUserLock /></button> 
          </Nav.Link>
      <Nav>
        <Nav.Link onClick={handleLogout} style={{marginLeft:'5px' }} className="ml-auto">Cerrar Sesión <FaArrowRightToBracket /></Nav.Link>
      </Nav>



      <Modal show={showModal} onHide={handleCloseModal} size="md">
        <Modal.Header style={{ backgroundColor: '#4a4a4a', color: 'white' }} closeButton>
          <Modal.Title style={{ margin: '0 auto' }}>{correo}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ textAlign: 'center', backgroundColor: '#4a4a4a', color: 'white' }}>
          <FaRegUserCircle style={{ fontSize: '125px' }} />
          <h4>Roles del Usuario</h4>
          {userInfo &&
            userInfo.roles &&
            userInfo.roles.map((role) => (
              <p key={role._id} >{mapRoleName(role.name)}</p>
            ))}
        </Modal.Body>
        <Modal.Footer style={{ textAlign: 'center', backgroundColor: '#4a4a4a', color: 'white' }}>
          <Button variant="secondary" style={{ width: '100px', height: '50px' }} onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

    </Navbar>
  );
};
export default MyNavbar;