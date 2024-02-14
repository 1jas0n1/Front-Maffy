import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/estilos-login.css';
import logo from './logo.jpg';
import Cookies from 'js-cookie';

const LoginView = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [redirectToIndex, setRedirectToIndex] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validar si los campos están vacíos
    if (!formData.email || !formData.password) {
      toast.error('Complete el formulario');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:4000/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        const data = await response.json();
  
        // Guardar el token, el email y el _id en cookies con una duración de 1 día (ajustable)
        Cookies.set('token', data.token, { expires: 1 });
        Cookies.set('email', formData.email, { expires: 1 });
        Cookies.set('_id', data._id, { expires: 1 }); // Guardar el _id en la cookie
  
     
  
        
        console.log('Token:', data.token);
        console.log('Email:', formData.email);
        console.log('_id:', data._id);
  
   
        setRedirectToIndex(true);
      } else {
       
        toast.error('Contraseña o usuario incorrecto');
      }
    } catch (error) {
      console.error('Error al realizar la solicitud', error);
    }
  };
  
  

  if (redirectToIndex) {
    return <Redirect to="/index" />;
  }

  return (
    <div className="cont">
      <div className="cont_form">
        <img src={logo} alt="Logo" />
        <form id="frm" onSubmit={handleSubmit}>
          <input type="text" name="email" placeholder="Email" onChange={handleChange} />
          <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} />
          <button type="submit" className="btn-log">Entrar</button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default LoginView;
