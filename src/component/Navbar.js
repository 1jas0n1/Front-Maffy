import React, { useState } from "react";
import { Navbar, Nav, NavDropdown,Modal,Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaBars } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { TbColorSwatch } from "react-icons/tb";
import { IoColorPaletteOutline } from "react-icons/io5";
import { GiClothes } from "react-icons/gi";
import { FaTags } from "react-icons/fa";
import { GiRolledCloth } from "react-icons/gi";
import { FaTshirt } from "react-icons/fa";
import { FcShipped } from "react-icons/fc";
import { FcOvertime } from "react-icons/fc";
import { FcCurrencyExchange } from "react-icons/fc";
import { FaUserLock } from "react-icons/fa";
import { FcAlphabeticalSortingAz } from "react-icons/fc";
import { FcList } from "react-icons/fc";
import { FcCalendar } from "react-icons/fc";
import { FaArrowRightToBracket } from "react-icons/fa6";
import { BsBoxes } from "react-icons/bs";
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
      const response = await axios.get(`https://api-mafy-store.onrender.com/api/user/roles/${IdUser}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Ordena los roles según tu preferencia (Usuario, Vendedor, Administrador)
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
        const response = await fetch('https://api-mafy-store.onrender.com/api/auth/logout', {
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
    <Navbar style={{ marginLeft: '0 auto', padding: '5px' }} bg="dark" expand="lg" variant="dark">
      <Navbar.Brand style={{ marginLeft: '10px', fontSize: '30px', fontFamily: 'MV Boli' }} > Mafy<span style={{ color: '#e0ac1c', fontFamily: 'MV Boli' }}>Store</span></Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={handleToggle}>
        {mobile ? <ImCross /> : <FaBars />}
      </Navbar.Toggle>
      <Navbar.Collapse id="basic-navbar-nav" className={mobile ? "show" : ""}>
        <Nav className="mr-auto">
          <Nav.Link href="/index" to="/index" >
            Inicio
          </Nav.Link>

          <Nav.Link  href="/configuracion" to="/configuracion" >Configuración</Nav.Link>
          <NavDropdown title="Ventas">
            <NavDropdown.Item href="/ventas-art"> <FcCurrencyExchange style={{ fontSize: '30px' }}></FcCurrencyExchange>Realizar Venta</NavDropdown.Item>
            <NavDropdown.Item href="/historial-venta"> <FcOvertime style={{ fontSize: '30px' }} />Historial</NavDropdown.Item>
          </NavDropdown>

          <NavDropdown title="Ingresos">
            <NavDropdown.Item href="/ingresos-art"> <FcCurrencyExchange style={{ fontSize: '30px' }} /> Nueva Compra</NavDropdown.Item>
            <NavDropdown.Item href="/historial-ingreso"> <FcOvertime style={{ fontSize: '30px' }} />Historial</NavDropdown.Item>
          </NavDropdown>

          <NavDropdown title="Catalogos">
            <NavDropdown.Item style={{ color: 'black' }}>
              <NavLink to="/colores" style={{ color: 'black' }} className="nav-link">
                <IoColorPaletteOutline style={{ color: 'black', fontSize: '20px' }} /> Colores
              </NavLink>
            </NavDropdown.Item>

            <NavDropdown.Item href="/categorias">
              <NavLink to="/categorias" className="nav-link" style={{ color: 'black' }}>
                <FcList style={{ fontSize: '20px', color: 'black' }} /> Categorias
              </NavLink>
            </NavDropdown.Item>

            <NavDropdown.Item href="/disenos">
              <NavLink to="/disenos" style={{ color: 'black' }} className="nav-link">
                <TbColorSwatch style={{ color: 'black', fontSize: '20px' }} />Diseños
              </NavLink>
            </NavDropdown.Item>

            <NavDropdown.Item href="/estilos">
              <NavLink to="/estilos" style={{ color: 'black' }} className="nav-link">
                <GiClothes style={{ color: 'black', fontSize: '20px' }} />Estilos
              </NavLink>
            </NavDropdown.Item>

            <NavDropdown.Item href="/tallas ">
              <NavLink to="/tallas" style={{ color: 'black' }} className="nav-link">
                <FcAlphabeticalSortingAz style={{ fontSize: '20px' }} />Tallas
              </NavLink>
            </NavDropdown.Item>

            <NavDropdown.Item href="/marcas">
              <NavLink to="/marcas" style={{ color: 'black' }} className="nav-link">
                <FaTags style={{ color: 'black', fontSize: '20px' }} />Marcas
              </NavLink>
            </NavDropdown.Item>

            <NavDropdown.Item href="/materiales">
              <NavLink to="/materiales" style={{ color: 'black' }} className="nav-link">
                <GiRolledCloth style={{ color: 'darkred', fontSize: '20px' }} /> Materiales
              </NavLink>
            </NavDropdown.Item>

            <NavDropdown.Item href="/promociones">
              <NavLink to="/promociones" style={{ color: 'black' }} className="nav-link">
                <FcCalendar  style={{ color: 'black', fontSize: '20px' }} /> Promociones
              </NavLink>
            </NavDropdown.Item>

            <NavDropdown.Item href="/proveedores">
              <NavLink to="/proveedores" style={{ color: 'black' }} className="nav-link">
                <FcShipped style={{ color: 'black', fontSize: '20px' }} />Proveedores
              </NavLink>
            </NavDropdown.Item>

            <NavDropdown.Item href="/articulos">
              <NavLink to="/articulos" style={{ color: 'black' }} className="nav-link">
                < FaTshirt style={{ color: 'black', fontSize: '20px' }} /> Articulos
              </NavLink>
            </NavDropdown.Item>

            <NavDropdown.Item href="/bodegas ">
              <NavLink to="/bodegas" style={{ color: 'black' }} className="nav-link">
              <BsBoxes  style={{fontSize:'20px',color:'black'}} /> Bodegas
              </NavLink>
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>

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