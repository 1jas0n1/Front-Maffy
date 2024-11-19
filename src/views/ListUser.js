import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Modal, Button, Form } from 'react-bootstrap';
import Footer from '../component/footer/footer';
import MyNavbar from '../component/Navbar';
import Cookies from 'js-cookie';
import Loader from '../component/Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ButtonE from '../component/ButtonE';

const UserInfo = () => {
  const [loading, setLoading] = useState(true);
  const [usersData, setUsersData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState({ roles: [] });

  useEffect(() => {
    const token = Cookies.get('token');
    const fetchData = async () => {
      try {
        const response = await fetch('https://api-tammys.onrender.com/api/user/info', {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
          },
        });
        const data = await response.json();
        const usersWithInitializedRoles = data.map(user => ({
          ...user,
          roles: user.roles || [],
        }));

        // Simulamos un retraso de 2 segundos antes de establecer los datos y cambiar el estado de carga
        setTimeout(() => {
          setUsersData(usersWithInitializedRoles);
          setLoading(false); 
        }, 2000);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false); 
      }
    };
    fetchData();
  }, []);

  const handleEditClick = (user) => {
    const initializedUser = {
      ...user,
      roles: user.roles || [],
    };

    setEditUser(initializedUser);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleRoleToggle = (role) => {
    setEditUser((prevUser) => {
      const updatedRoles = [...prevUser.roles];

      const roleIndex = updatedRoles.indexOf(role);

      if (roleIndex !== -1) {
        updatedRoles.splice(roleIndex, 1);
      } else {
        updatedRoles.push(role);
      }

      return {
        ...prevUser,
        roles: updatedRoles,
      };
    });
  };

  const handleSaveChanges = async () => {
    try {
      const token = Cookies.get('token');
      const url = `https://api-tammys.onrender.com/api/user/${editUser._id}`;
  
      const userRoles = editUser.roles || [];
      const roleMappings = {
        'Admin': '65a594f86a8fe64161553130',
        'Vendedor': '65a594f86a8fe6416155312f',
        'Usuario': '65a594f86a8fe6416155312e',
      };
  
      const filteredRoles = userRoles.filter(role => roleMappings[role] !== undefined);
      const roleIds = filteredRoles.map(role => roleMappings[role]);
  
      const updatedUserData = {
        _id: editUser._id,
        username: editUser.username,
        email: editUser.email,
        password: editUser.password,
        roles: roleIds,
      };

      const requestOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify(updatedUserData),
      };
      console.log('Enviando datos al servidor:', updatedUserData);
      const response = await fetch(url, requestOptions);
  
      if (response.ok) {
        toast.success('Cambios guardados exitosamente.');
        setShowModal(false);
      } else {
        let errorMessage = 'Error al guardar cambios: ';
  
        if (response.status === 400) {
          const errorData = await response.json();
          errorMessage += errorData.message || 'La solicitud es inválida. Verifique los datos proporcionados.';
        } else if (response.status === 401) {
          errorMessage += 'Acceso no autorizado. Inicie sesión nuevamente.';
        } else if (response.status === 403) {
          errorMessage += 'Permiso denegado. No tiene los permisos necesarios para realizar esta acción.';
        } else {
          errorMessage += 'Error desconocido al guardar cambios.';
        }
  
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error('Error al guardar cambios: ' + error.message);
    }
  };
  
  

  const renderRolesSwitches = () => {
    const roles = ['Admin', 'Vendedor', 'Usuario'];

    return roles.map((role) => (
      <div key={role} className="mb-3">
        <label>{role}:</label>
        <Form.Check
          type="switch"
          id={`${role.toLowerCase()}-switch`}
          label={role}
          checked={editUser?.roles.includes(role)}
          onChange={() => handleRoleToggle(role)}
        />
      </div>
    ));
  };

  const renderUsers = () => {
    if (!usersData) {
      return <Loader />; 
    }
  
    return (
      <div>
        <div className="row row-cols-1 row-cols-md-4" style={{margin:'0 auto',padding:'25px'}} > 
          {usersData.map((user, index) => (
            <div key={user._id} style={{ padding: '5px',  width: '350px' }} className="col mb-4">
              <div className="card" style={{backgroundColor:'#4a2148'}}>
                <div className="card-body">
                  <h5 className="card-title" style={{ justifyContent: 'space-betwen', marginRight: '10px', padding: '10px', alignItems: 'center' }}>
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    {user.username}
                  </h5>
                  <p style={{ padding: '5px' }} className="card-text">Email: {user.email}</p>
                  {index === 0 ? (
                    <Button variant="primary" style={{ width: '90px', height: '40px' }} disabled>
                      Editar
                    </Button>
                  ) : (
                    <ButtonE onClick={() => handleEditClick(user)}>
                      Editar
                    </ButtonE>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  

  return (
    <div style={{ backgroundColor:'' }}>
      <MyNavbar></MyNavbar>
      <div className="container mt-6">
        <h1> 
        <img
          src="https://fontmeme.com/permalink/241028/d2b2427bb3a89dd4ef16ddf562852ac6.png"
          alt="fuentes-de-comics"
          border="0"
          style={{ width: '85%', height: 'auto', maxWidth: '900px' }} 
        />
        </h1>
        {renderUsers()}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Nombre de usuario:</label>
            <input type="text" className="form-control" id="username" name="username" value={editUser?.username || ''} onChange={handleInputChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Correo electrónico:</label>
            <input type="email" className="form-control" id="email" name="email" value={editUser?.email || ''} onChange={handleInputChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña:</label>
            <input type="password" className="form-control" id="password" name="password" value={editUser?.password || ''} onChange={handleInputChange} />
          </div>
          {renderRolesSwitches()}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" style={{ width: '90px', height: '40px' }} onClick={() => setShowModal(false)}>Cerrar</Button>
          <Button variant="primary" style={{ width: '90px', height: '40px' }} onClick={handleSaveChanges}>Guardar </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <Footer></Footer>
    </div>
  );
};

export default UserInfo;
