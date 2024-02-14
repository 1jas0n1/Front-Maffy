import React, { useState, useEffect, useMemo } from 'react';
import { Form, Button, Modal} from 'react-bootstrap';
import * as Styles from '../css/styles_colores';
import Footer from '../component/footer/footer';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Navbar from '../component/Navbar';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';

const DisenosView = () => {
  const [cookieData, setCookieData] = useState({
    miCookie: Cookies.get('miCookie') || null, // Puedes ajustar el nombre de la cookie
  });
  const [disenos, setDisenos] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);

  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [newDiseno, setNewDiseno] = useState({
    diseno: '',
    estado: '',
    descripcion: '',
  });
  const [selectedDiseno, setSelectedDiseno] = useState(null);

  const handleClose = () => {
    setShowCreateModal(false);
    setShowUpdateModal(false);
    setNewDiseno({
      diseno: '',
      estado: '',
      descripcion: '',
    });
    setSelectedDiseno(null);
  };

 

  const handleShow = () => setShowCreateModal(true);

  const handleUpdate = (disenoId) => {
    const selected = disenos.find((diseno) => diseno._id === disenoId);
    setSelectedDiseno(selected);
    setShowUpdateModal(true);
  };

  const url = 'http://localhost:4000/api/disenos';

  const showData = async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setDisenos(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDelete = (disenoId) => {
    setDeleteItemId(disenoId);
    setShowDeleteModal(true);
  };

 

  const handleClear = () => {
    if (filterText) {
      setResetPaginationToggle(!resetPaginationToggle);
      setFilterText('');
    }
  };

  const filteredItems = disenos.filter(
    (item) => item.diseno && item.diseno.toLowerCase().includes(filterText.toLowerCase())
  );

  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div style={{ display: 'flex', margin: '0 auto', marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Buscar por diseño"
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
  
  
  const handleDeleteConfirmed = async () => {
    try {
      const token = Cookies.get('token');
      const response = await fetch(`${url}/${deleteItemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
      });
  
      if (response.ok) {
        console.log(`Diseño con ID ${deleteItemId} eliminado correctamente`);
        showData();
        toast.success('Diseño eliminado correctamente', { position: toast.POSITION.TOP_CENTER });
      } else {
        handleCommonErrors(response.status);
        console.error(`Error al eliminar el diseño con ID ${deleteItemId}`);
        toast.error('Error al eliminar el diseño', { position: toast.POSITION.TOP_CENTER });
      }
    } catch (error) {
      console.error('Error deleting design:', error);
      toast.error('Error al eliminar el diseño', { position: toast.POSITION.TOP_CENTER });
    } finally {
      setShowDeleteModal(false);
      setDeleteItemId(null);
    }
  };
  
  const handleCreate = async () => {
    try {
      const createUrl = 'http://localhost:4000/api/disenos';
      const token = Cookies.get('token');
      console.log('JSON que se envía al crear:', JSON.stringify(newDiseno));
  
      const response = await fetch(createUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify(newDiseno),
      });
  
      if (response.ok) {
        console.log('Diseño creado exitosamente.');
        showData();
        toast.success('Diseño creado correctamente', { position: toast.POSITION.TOP_CENTER });
      } else {
        handleCommonErrors(response.status);
        console.error('Error al intentar crear el diseño.');
      }
    } catch (error) {
      console.error('Error en la solicitud de creación:', error);
      toast.error('Error al crear el diseño', { position: toast.POSITION.TOP_CENTER });
    }
  
    handleClose();
  };
  
  const handleUpdateSubmit = async () => {
    try {
      const updateUrl = `http://localhost:4000/api/disenos/${selectedDiseno._id}`;
      const token = Cookies.get('token');
      console.log('JSON que se envía al actualizar:', JSON.stringify(selectedDiseno));
  
      const response = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify(selectedDiseno),
      });
  
      if (response.ok) {
        console.log('Diseño actualizado exitosamente.');
        showData();
        toast.success('Diseño actualizado correctamente', { position: toast.POSITION.TOP_CENTER });
      } else {
        handleCommonErrors(response.status);
        console.error('Error al intentar actualizar el diseño.');
      }
    } catch (error) {
      console.error('Error en la solicitud de actualización:', error);
      toast.error('Error al actualizar el diseño', { position: toast.POSITION.TOP_CENTER });
    } finally {
      handleClose();
    }
  };
  
  

  useEffect(() => {
    showData();
  }, []);

  const columns = [
    {
      name: 'Diseño',
      selector: (row) => row.diseno,
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
      name: 'Descripción',
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
          <Modal.Title>Crear Diseño</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formDiseno">
              <Form.Label>Diseño</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el diseño"
                value={newDiseno.diseno}
                onChange={(e) => setNewDiseno({ ...newDiseno, diseno: e.target.value })}
              />
            </Form.Group>

         
            <Form.Group controlId="formEstado">
  <Form.Label>Estado</Form.Label>
  <Form.Control
    as="select"
    value={newDiseno.estado}
    onChange={(e) => setNewDiseno({ ...newDiseno, estado: e.target.value === 'true' })}
  >
    <option value="">Seleccionar estado</option>
    <option value="true">Activo</option>
    <option value="false">Inactivo</option>
  </Form.Control>
</Form.Group>



            <Form.Group controlId="formDescripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la descripción"
                value={newDiseno.descripcion}
                onChange={(e) => setNewDiseno({ ...newDiseno, descripcion: e.target.value })}
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
          <Modal.Title>Actualizar Diseño</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formDiseno">
              <Form.Label>Diseño</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el diseño"
                value={selectedDiseno ? selectedDiseno.diseno : ''}
                onChange={(e) =>
                  setSelectedDiseno({
                    ...selectedDiseno,
                    diseno: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formEstado">
  <Form.Label>Estado</Form.Label>
  <Form.Control
    as="select"
    value={selectedDiseno ? selectedDiseno.estado.toString() : ''}
    onChange={(e) => setSelectedDiseno({ ...selectedDiseno, estado: e.target.value === 'true' })}
  >
    <option value="">Seleccionar estado</option>
    <option value="true">Activo</option>
    <option value="false">Inactivo</option>
  </Form.Control>
</Form.Group>


            <Form.Group controlId="formDescripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la descripción"
                value={selectedDiseno ? selectedDiseno.descripcion : ''}
                onChange={(e) =>
                  setSelectedDiseno({
                    ...selectedDiseno,
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

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header style={{backgroundColor:'#4a4a4a',color:'white'}} closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{backgroundColor:'#4a4a4a',color:'white'}} >
          ¿Estás seguro de que quieres eliminar este diseño?
        </Modal.Body>
        <Modal.Footer style={{backgroundColor:'#4a4a4a',color:'white'}} >
        <Button style={{ width: '100px', height: '50px' }} variant="danger" onClick={handleDeleteConfirmed}>
            Si
          </Button>
          <Button style={{ width: '100px', height: '50px' }} variant="secondary"onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
        
        </Modal.Footer >
      </Modal>

      <Footer />
      <ToastContainer />
    </Styles.AppContainer>
  );
};

export default DisenosView;
