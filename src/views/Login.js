import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/estilos-login.css';
import LOG from '../component/Log'; // Asegúrate de importar el componente correctamente
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

    if (!formData.email || !formData.password) {
      toast.error('Complete el formulario');
      return;
    }

    try {
      const response = await fetch('https://api-tammys.onrender.com/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const data = await response.json();
        Cookies.set('token', data.token, { expires: 1 });
        Cookies.set('email', formData.email, { expires: 1 });
        Cookies.set('_id', data._id, { expires: 1 });
        setRedirectToIndex(true);
      } else {
        toast.error('Contraseña o usuario incorrecto');
      }
    } catch (error) {
      console.error('Error al realizar la solicitud', error);
    }
  };

  if (redirectToIndex) {
    return <Navigate to="/index" />;
  }

  return (
    <div className="cont">
      <div className="cont_form">
        <LOG 
          onSubmit={handleSubmit} 
          handleChange={handleChange} 
          formData={formData} 
        />
        <ToastContainer />
      </div>
    </div>
  );
};

export default LoginView;
