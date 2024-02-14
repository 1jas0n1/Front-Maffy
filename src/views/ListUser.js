import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Modal, Button, Form } from 'react-bootstrap';
import Footer from '../component/footer/footer';
import MyNavbar from '../component/Navbar';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserInfo = () => {
  const [usersData, setUsersData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState({ roles: [] });

  useEffect(() => {
    const token = Cookies.get('token');
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/user/info', {
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

        setUsersData(usersWithInitializedRoles);
      } catch (error) {
        console.error('Error fetching user data:', error);
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
      const url = `http://localhost:4000/api/user/${editUser._id}`;
  
      const userRoles = editUser.roles || [];
      const roleMappings = {
        'Admin': '652b4bac458db698d7db1481',
        'Moderador': '652b4bac458db698d7db1480',
        'Usuario': '652b4bac458db698d7db147f',
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
    const roles = ['Admin', 'Moderador', 'Usuario'];

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
      return <div>Loading...</div>;
    }

    return (
      <div>
        <div className="row row-cols-1 row-cols-md-3">
          {usersData.map((user, index) => (
            <div key={user._id} style={{ padding: '5px', marginRight: '3px', width: '300px' }} className="col mb-4">
              <div className="card">
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
                    <Button variant="primary" style={{ width: '90px', height: '40px' }} onClick={() => handleEditClick(user)}>
                      Editar
                    </Button>
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
    <div style={{ backgroundImage: 'linear-gradient(to right top, #80285a, #742a62, #652d69, #54306e, #3f3371, #323d7a, #204781, #005086, #006290, #007393, #008391, #04928b)' }}>
      <MyNavbar></MyNavbar>
      <div className="container mt-6">
        <h1 style={{ textAlign: 'center', color: 'white' }}>Administracion de Usuarios</h1>
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
