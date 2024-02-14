import React, { useState, useEffect, useMemo } from 'react';
import { Form, Button, Modal, Nav } from 'react-bootstrap';
import * as Styles from '../css/styles_colores';
import { FaEdit,FaTrash } from 'react-icons/fa';
import Footer from '../component/footer/footer';
import Navbar from '../component/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';

const EstilosView = () => {
  const [cookieData, setCookieData] = useState({
    miCookie: Cookies.get('miCookie') || null, // Puedes ajustar el nombre de la cookie
  });
  const [estilos, setEstilos] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [newEstilo, setNewEstilo] = useState({
    estilo: '',
    estado: '',
    descripcion: '',
  });
  const [selectedEstilo, setSelectedEstilo] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  
  const showDeleteConfirmationModal = (estiloId) => {
    setDeleteItemId(estiloId);
    setShowDeleteConfirmation(true);
  };
  
  const closeDeleteConfirmationModal = () => {
    setShowDeleteConfirmation(false);
    setDeleteItemId(null);
  };

  const handleClose = () => {
    setShowCreateModal(false);
    setShowUpdateModal(false);
    setNewEstilo({
      estilo: '',
      estado: '',
      descripcion: '',
    });
    setSelectedEstilo(null);
  };

  const handleShow = () => setShowCreateModal(true);

  const handleUpdate = (estiloId) => {
    const selected = estilos.find((estilo) => estilo._id === estiloId);
    setSelectedEstilo(selected);
    setShowUpdateModal(true);
  };

  const url = 'http://localhost:4000/api/estilos';

  const showData = async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setEstilos(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

 
  

  const handleClear = () => {
    if (filterText) {
      setResetPaginationToggle(!resetPaginationToggle);
      setFilterText('');
    }
  };

  const filteredItems = estilos.filter(
    (item) => item.estilo && item.estilo.toLowerCase().includes(filterText.toLowerCase())
  );

  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div style={{ display: 'flex', margin: '0 auto', marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Buscar por estilo"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>
    );
  }, [filterText, resetPaginationToggle]);

  const handleCommonErrors = (statusCode) => {
    switch (statusCode) {
      case 401:
        console.error('Error 401: No autorizado para realizar esta acción.');
        toast.error('Su sesión ha caducado. Por favor, vuelva a iniciar sesión.', { position: toast.POSITION.TOP_CENTER });
        // Add logic here to redirect the user to the login page if needed
        break;
      case 400:
        console.error('Error 400: Solicitud incorrecta.');
        toast.error('Solicitud incorrecta', { position: toast.POSITION.TOP_CENTER });
        break;
      case 403:
        console.error('Error 403: Permisos insuficientes para la acción.');
        toast.error('Permisos insuficientes para la acción', { position: toast.POSITION.TOP_CENTER });
        break;
      default:
        console.error(`Error desconocido con código ${statusCode}`);
        toast.error('Error desconocido', { position: toast.POSITION.TOP_CENTER });
    }
  };


  const handleCreate = async () => {
    try {
      // Log the JSON being sent
      console.log('Creating new style with JSON:', JSON.stringify(newEstilo));
  
      const createUrl = 'http://localhost:4000/api/estilos';
      const token = Cookies.get('token');
      const response = await fetch(createUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify(newEstilo),
      });
  
      if (response.ok) {
        console.log('Estilo creado exitosamente.');
        showData();
        toast.success('Estilo creado exitosamente', { position: toast.POSITION.TOP_CENTER });
      } else {
        handleCommonErrors(response.status);
        console.error('Error al intentar crear el estilo.');
        toast.error('Error al intentar crear el estilo', { position: toast.POSITION.TOP_CENTER });
      }
    } catch (error) {
      console.error('Error en la solicitud de creación:', error);
      toast.error('Error en la solicitud de creación', { position: toast.POSITION.TOP_CENTER });
    }
  
    handleClose();
  };
  
  const handleDelete = (estiloId) => {
    showDeleteConfirmationModal(estiloId);
  };
  
  const handleDeleteConfirmed = async (estiloId) => {
    const token = Cookies.get('token');
    try {
      const response = await fetch(`${url}/${estiloId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
      });
  
      if (response.ok) {
        console.log(`Estilo con ID ${estiloId} eliminado correctamente.`);
        showData(); // Update the styles list after deletion
        toast.success('Estilo eliminado correctamente', { position: toast.POSITION.TOP_CENTER });
      } else {
        handleCommonErrors(response.status);
        console.error(`Error al eliminar el estilo con ID ${estiloId}.`);
        toast.error('Error al eliminar el estilo', { position: toast.POSITION.TOP_CENTER });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      closeDeleteConfirmationModal();
    }
  };
  
  const handleUpdateSubmit = async () => {
    try {
      const updateUrl = `http://localhost:4000/api/estilos/${selectedEstilo._id}`;
      const token = Cookies.get('token');
      const response = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify(selectedEstilo),
      });
  
      if (response.ok) {
        console.log('Estilo actualizado exitosamente.');
        showData();
        toast.success('Estilo actualizado exitosamente', { position: toast.POSITION.TOP_CENTER });
      } else {
        handleCommonErrors(response.status);
        console.error('Error al intentar actualizar el estilo.');
        toast.error('Error al intentar actualizar el estilo', { position: toast.POSITION.TOP_CENTER });
      }
    } catch (error) {
      console.error('Error en la solicitud de actualización:', error);
      toast.error('Error en la solicitud de actualización', { position: toast.POSITION.TOP_CENTER });
    }
  
    handleClose();
  };
  



  useEffect(() => {
    showData();
  }, []);

  const columns = [
    {
      name: 'Estilo',
      selector: (row) => row.estilo,
      sortable: true,
      center: true,
    },
    {
      name: 'Estado',
      selector: (row) => (row.estado ? 'Activo' : 'Inactivo'),
      sortable: true,
      center: true,
    },
    {
      name: 'Descripcíon',
      selector: (row) => row.descripcion,
      sortable: true,
      center: true,
    },
    {
      name: 'Acciones',
      cell: (row) => (
        <div>
       
        <Styles.ActionButton onClick={() => handleUpdate(row._id)} update>
          <FaEdit /> 
        </Styles.ActionButton>

       
        <Styles.ActionButton onClick={() => handleDelete(row._id)}>
          <FaTrash /> 
        </Styles.ActionButton>
      </div>
      ),
      center: true,
    },
  ];

  return (
    <Styles.AppContainer>
    <Navbar />
      <Styles.CreateButton variant="primary" onClick={handleShow}>
        Crear
      </Styles.CreateButton>

      <Styles.StyledDataTable
        columns={columns}
        data={filteredItems}
        pagination
        paginationResetDefaultPage={resetPaginationToggle}
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        persistTableHead
      />

      <Styles.StyledModal show={showCreateModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Estilo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formEstilo">
              <Form.Label>Estilo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el estilo"
                value={newEstilo.estilo}
                onChange={(e) => setNewEstilo({ ...newEstilo, estilo: e.target.value })}
              />
            </Form.Group>
            <Form.Label>Estado</Form.Label>

            <Form.Control
  as="select"
  value={newEstilo.estado !== null && newEstilo.estado !== undefined ? newEstilo.estado.toString() : 'true'}
  onChange={(e) => setNewEstilo({ ...newEstilo, estado: e.target.value === 'true' })}
>
  <option >Selecciona un estado</option>
  <option value="true">Activo</option>
  <option value="false">Inactivo</option>
</Form.Control>
            <Form.Group controlId="formDescripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la descripción"
                value={newEstilo.descripcion}
                onChange={(e) => setNewEstilo({ ...newEstilo, descripcion: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Styles.ModalFooter>
        <Button className="otros" variant="primary" onClick={handleCreate}>
            Guardar
          </Button>
          <Button className="otros" variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          
        </Styles.ModalFooter>
      </Styles.StyledModal>

      <Styles.StyledModal show={showUpdateModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Actualizar Estilo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formEstilo">
              <Form.Label>Estilo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el estilo"
                value={selectedEstilo ? selectedEstilo.estilo : ''}
                onChange={(e) =>
                  setSelectedEstilo({
                    ...selectedEstilo,
                    estilo: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formEstado">
  <Form.Label>Estado</Form.Label>
  <Form.Control
    as="select"
    value={selectedEstilo ? (selectedEstilo.estado ? 'Activo' : 'Inactivo') : ''}
    onChange={(e) =>
      setSelectedEstilo({
        ...selectedEstilo,
        estado: e.target.value === 'Activo',
      })
    }
  >
    <option value="Activo">Activo</option>
    <option value="Inactivo">Inactivo</option>
  </Form.Control>
</Form.Group>

            <Form.Group controlId="formDescripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la descripción"
                value={selectedEstilo ? selectedEstilo.descripcion : ''}
                onChange={(e) =>
                  setSelectedEstilo({
                    ...selectedEstilo,
                    descripcion: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Styles.ModalFooter>
        <Button className="otros" variant="primary" onClick={handleUpdateSubmit}>
            Guardar cambios
          </Button>
          <Button className="otros" variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          
        </Styles.ModalFooter>
      </Styles.StyledModal>

      <Styles.StyledModal show={showDeleteConfirmation} onHide={closeDeleteConfirmationModal}>
  <Modal.Header closeButton>
    <Modal.Title>Confirmar Eliminación</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <p>¿Estás seguro de que deseas eliminar este estilo?</p>
  </Modal.Body>
  <Styles.ModalFooter>
    <Button style={{width:'100px',height:'50px'}} variant="danger" onClick={() => handleDeleteConfirmed(deleteItemId)}>
      Sí
    </Button>
    <Button style={{width:'100px',height:'50px'}} variant="secondary" onClick={closeDeleteConfirmationModal}>
      Cancelar
    </Button>
  </Styles.ModalFooter>
</Styles.StyledModal>;

     <Footer />
     <ToastContainer></ToastContainer>
    </Styles.AppContainer>
  );
};

export default EstilosView;
