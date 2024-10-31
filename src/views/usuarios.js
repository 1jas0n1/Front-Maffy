import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import Footer from '../component/footer/footer';
import Navbar from '../component/Navbar';
import * as Styles from '../css/styles_colores';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UsuariosView = () => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [permisos, setPermisos] = useState([]);

  const handleRegistro = async (e) => {
    e.preventDefault();

    if (permisos.length === 0) {
      toast.error('Debe seleccionar al menos un permiso');
      return;
    }
  
    if (!nombreUsuario || !email || !contrasena) {
      toast.success('Completa los Campos por favor', {
        style: {
          background: 'white',
          color: 'green', 
        },
      });
      return;
    }

    const userData = {
      username: nombreUsuario,
      email: email,
      password: contrasena,
      roles: permisos,
    };
  
    try {
      const response = await fetch('https://apitammy-closset.fra1.zeabur.app/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      if (response.ok) {
        toast.success('Usuario registrado exitosamente', {
          style: {
            colorScheme: 'white',
            background: '#007394',
            color: 'white', 
            margin: 'auto', 
          },
        });
        setNombreUsuario('');
        setEmail('');
        setContrasena('');
        setPermisos([]);
      } else {
        toast.error('Error al registrar usuario', {
          style: {
            colorScheme: 'white',
            background: '#007394',
            color: 'white', 
            margin: 'auto', 
          },
        });
        console.error('Error al registrar usuario');
      }
    } catch (error) {
      toast.error('Error en la solicitud. Por favor, inténtelo de nuevo.', {
        style: {
          colorScheme: 'white',
          background: '#007394',         
          color: 'white', 
          margin: 'auto', 
        },
      });
      console.error('Error en la solicitud:', error);
    }
  };

  return (
    <Styles.AppContainer style={{ height: '700px', color: 'black' }}>
      <Navbar />
      <h2>
      <img 
        style={{ width: '85%', height: 'auto', maxWidth: '900px' }} 
      src="https://fontmeme.com/permalink/241028/4e618e0f66aaf0ba739bc5b6837bd92b.png"
       alt="fuentes-de-comics" border="0"
       ></img>
      </h2>
      <Form
        style={{
          textAlign: 'center',
          width: '60%',
          margin: 'auto',
        }}
      >
        <Row>
          <Col md={6} >
            <Form.Group controlId="nombreUsuario">
              <Form.Label style={{textAlign:'center'}}>Nombre de Usuario</Form.Label>
              <Form.Control
                style={{ marginBottom: '10px',textAlign:'center' }}
                type="text"
                value={nombreUsuario}
                size="sm"
                onChange={(e) => setNombreUsuario(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                style={{ marginBottom: '10px',textAlign:'center' }}
                type="email"
                value={email}
                size="sm"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="contrasena">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                style={{ marginBottom: '10px',textAlign:'center' }}
                type="password"
                value={contrasena}
                size="sm"
                onChange={(e) => setContrasena(e.target.value)}/>
            </Form.Group>
          </Col>

          <Col md={6} style={{ textAlign: 'left',marginTop:'40px' }}>
            <Form.Group controlId="permisos">
              <Form.Label>Permisos</Form.Label>
              <div>
                <Form.Check
                  type="switch"
                  label="Usuario"
                  id="userSwitch"
                  checked={permisos.includes('user')}
                  onChange={() => {
                    const updatedPermisos = permisos.includes('user')
                      ? permisos.filter((permiso) => permiso !== 'user')
                      : [...permisos, 'user'];
                    setPermisos(updatedPermisos);
                  }}
                />
                <Form.Check
                  type="switch"
                  label="Vendedor"
                  id="moderatorSwitch"
                  checked={permisos.includes('moderator')}
                  onChange={() => {
                    const updatedPermisos = permisos.includes('moderator')
                      ? permisos.filter((permiso) => permiso !== 'moderator')
                      : [...permisos, 'moderator'];
                    setPermisos(updatedPermisos);
                  }}
                />
                <Form.Check
                  type="switch"
                  label="Admin"
                  id="adminSwitch"
                  checked={permisos.includes('admin')}
                  onChange={() => {
                    const updatedPermisos = permisos.includes('admin')
                      ? permisos.filter((permiso) => permiso !== 'admin')
                      : [...permisos, 'admin'];
                    setPermisos(updatedPermisos);
                  }}
                />
              </div>
            </Form.Group>
          </Col>
        </Row>

        <Button
          style={{
            width: '120px',
            height: '60px',
            marginBottom: '15px',
            marginTop: '10px',
            fontSize: '20px',
            borderRadius: '5px'
          }}
          variant="primary"
          type="submit"
          size="sm"
          onClick={handleRegistro}
        >
          Registrarse
        </Button>
      </Form>
      <Footer />
      <ToastContainer />
    </Styles.AppContainer>
  );
};

export default UsuariosView;
