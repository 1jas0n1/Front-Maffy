import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
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
  
    // Validar que se hayan seleccionado al menos un permiso
    if (permisos.length === 0) {
      toast.error('Debe seleccionar al menos un permiso');
      return;
    }
  
    // Validar que todos los campos estén completos
    if (!nombreUsuario || !email || !contrasena) {
      toast.success('Completa los Campos por favor', {
        style: {
          background: 'white',
          color: 'green', // Puedes ajustar el color del texto si lo necesitas
        },
      });
      return;
    }
  
    // Construir el objeto JSON
    const userData = {
      username: nombreUsuario,
      email: email,
      password: contrasena,
      roles: permisos,
    };
  
    try {
      // Enviar la solicitud POST al servidor
      const response = await fetch('http://localhost:4000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      // Manejar la respuesta del servidor
      if (response.ok) {
        // La solicitud fue exitosa
        toast.success('Usuario registrado exitosamente', {
          position: toast.POSITION.TOP_CENTER, // Ajusta la posición del toast al centro superior
          style: {
            colorScheme:'white',
            background: '#007394',
            color: 'white', // Puedes ajustar el color del texto si lo necesitas
            margin: 'auto', // Esto centra el toast horizontalmente
          },
        });
        
      } else {
        // La solicitud no fue exitosa
        toast.error('Error al registrar usuario', {
          position: toast.POSITION.TOP_CENTER, // Ajusta la posición del toast al centro superior
          style: {
            colorScheme:'white',
            background: '#007394',
            color: 'white', // Puedes ajustar el color del texto si lo necesitas
            margin: 'auto', // Esto centra el toast horizontalmente
          },
        });
      
        console.error('Error al registrar usuario');
      }
    } catch (error) {
      toast.error('Error en la solicitud. Por favor, inténtelo de nuevo.',{
        position: toast.POSITION.TOP_CENTER, // Ajusta la posición del toast al centro superior
        style: {
          colorScheme:'white',
          background: '#007394',
          color: 'white', // Puedes ajustar el color del texto si lo necesitas
          margin: 'auto', // Esto centra el toast horizontalmente
        },
      });
      console.error('Error en la solicitud:', error);
    }
  };
  

  return (
    <Styles.AppContainer style={{ height: '700px', backgroundImage:'linear-gradient(to right top, #80285a, #742a62, #652d69, #54306e, #3f3371, #323d7a, #204781, #005086, #006290, #007393, #008391, #04928b)',color:'white' }}>
      <Navbar />
      <h1>Crear Usuario</h1>
      <Form
        style={{
          textAlign: 'center',
          width: '60%',
          margin: 'auto',
        
         
        }}
      >
        <Form.Group controlId="nombreUsuario">
          <Form.Label>Nombre de Usuario</Form.Label>
          <Form.Control
            style={{ width: '40%', margin: '0 auto',marginBottom:'10px' }}
            type="text"
            value={nombreUsuario}
            size="sm"
            onChange={(e) => setNombreUsuario(e.target.value)}
          />
        </Form.Group>

        <Form.Group style={{ textAlign: 'center' }} controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            style={{ width: '40%', margin: '0 auto',marginBottom:'10px' }}
            type="email"
            value={email}
            size="sm"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group style={{ textAlign: 'center' }} controlId="contrasena">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            style={{ width: '40%', margin: '0 auto',marginBottom:'10px' }}
            type="password"
            value={contrasena}
            size="sm"
            onChange={(e) => setContrasena(e.target.value)}
          />
        </Form.Group>

        <Form.Group style={{ width: '10%', margin: '0 auto' }} controlId="permisos">
  <Form.Label style={{ justifyContent: 'center' }}>Permisos</Form.Label>
  <div>
    <Form.Check
      type="switch"
      label="user"
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
      label="moderator"
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
      label="admin"
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

        <Button
          style={{
            width: '120px',
            height: '60px',
            marginBottom: '15px',
            marginTop: '10px',
            fontSize: '20px',
            borderRadius:'5px'
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
      <ToastContainer/>
    </Styles.AppContainer>
  );
};

export default UsuariosView;
