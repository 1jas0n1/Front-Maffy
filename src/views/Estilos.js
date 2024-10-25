import React, { useState, useEffect, useMemo } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import * as Styles from '../css/styles_colores';
import Footer from '../component/footer/footer';
import Navbar from '../component/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import ButtonM from '../component/BtnAgregar.js';

const EstilosView = () => {

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

  const url = 'https://apimafy.zeabur.app/api/estilos';

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
      <div style={{ display: 'flex', margin: '0 auto', marginBottom: '10px',marginTop:'10px' }}>
        <input
          type="text"
          placeholder="Buscar..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>
    );
  }, [filterText, resetPaginationToggle]);

  const handleCommonErrors = (statusCode) => {
    switch (statusCode) {
      case 401:
        toast.error('Su sesión ha caducado. Por favor, vuelva a iniciar sesión.'); 
        break;
      case 400:
        toast.error('Solicitud incorrecta');
        break;
      case 403:
        toast.error('Permisos insuficientes para la acción');
        break;
      default:
        toast.error('Error desconocido');
    }
  };

  const handleCreate = async () => {
    try {
      const createUrl = 'https://apimafy.zeabur.app/api/estilos';
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
        showData();
        toast.success('Estilo creado exitosamente');
      } else {
        handleCommonErrors(response.status);
        toast.error('Error al intentar crear el estilo');
      }
    } catch (error) {
      toast.error('Error en la solicitud de creación');
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
        showData(); 
        toast.success('Estilo eliminado correctamente');
      } else {
        handleCommonErrors(response.status);
        toast.error('Error al eliminar el estilo');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      closeDeleteConfirmationModal();
    }
  };
  
  const handleUpdateSubmit = async () => {
    try {
      const updateUrl = `https://apimafy.zeabur.app/api/estilos/${selectedEstilo._id}`;
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
        showData();
        toast.success('Estilo actualizado exitosamente');
      } else {
        handleCommonErrors(response.status);
        toast.error('Error al intentar actualizar el estilo');
      }
    } catch (error) {
      toast.error('Error en la solicitud de actualización');
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
          Editar
        </Styles.ActionButton>
        <Styles.ActionButton onClick={() => handleDelete(row._id)}>
         Borrar 
        </Styles.ActionButton>
      </div>
      ),
      center: true,
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: '#4A2148',
        color: '#fff',
        fontWeight: 'bold',
      },
    },
  };

  return (
    <Styles.AppContainer>
    <Navbar />
      <ButtonM variant="primary" onClick={handleShow}>
        Crear
      </ButtonM>
      <Styles.StyledDataTable
        columns={columns}
        customStyles={customStyles}
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
                  })}/>
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
