import React, { useState, useEffect, useMemo } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import * as Styles from '../css/styles_colores';
import Footer from '../component/footer/footer';
import Navbar from '../component/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import ButtonM from '../component/BtnAgregar.js';
const TallasView = () => {

  const [tallas, setTallas] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle] = useState(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
  const [tallaToDeleteId, setTallaToDeleteId] = useState(null);

  const [newTalla, setNewTalla] = useState({
    talla: '',
    estado: '',
    descripcion: '',
  });
  const [selectedTalla, setSelectedTalla] = useState(null);

  const handleClose = () => {
    setShowCreateModal(false);
    setShowUpdateModal(false);
    setNewTalla({
      talla: '',
      estado: '',
      descripcion: '',
    });
    setSelectedTalla(null);
  };

  const handleShow = () => setShowCreateModal(true);

  const handleUpdate = (tallaId) => {
    const selected = tallas.find((talla) => talla._id === tallaId);
    setSelectedTalla(selected);
    setShowUpdateModal(true);
  };

  const url = 'https://api-tammys.onrender.com/api/tallas';

  const showData = async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setTallas(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDelete = (tallaId) => {
    setTallaToDeleteId(tallaId);
    setShowDeleteConfirmationModal(true);
  };

  const handleConfirmedDelete = async (tallaId) => {
    try {
      const token = Cookies.get('token');
      const response = await fetch(`${url}/${tallaId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token, 
        },
      });
  
      if (response.ok) {
        toast.success(`Talla eliminada correctamente.`);
        showData(); 
      } else {
        toast.error(`Error al intentar eliminar la talla`);
      }
    } catch (error) {
  
      toast.error('Error al intentar eliminar la talla.');
    }
  
    setShowDeleteConfirmationModal(false);
  };
  
  const customStyles = {
    headCells: {
      style: {
        backgroundColor: '#4A2148',
        color: '#fff',
        fontWeight: 'bold',
      },
    },
  };

  const filteredItems = tallas.filter(
    (item) => item.talla && item.talla.toLowerCase().includes(filterText.toLowerCase())
  );

  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div style={{ display: 'flex', margin: '0 auto', marginBottom: '10px',marginTop:'10px' }}>
        <input
          type="text"
          className="text-center"
          placeholder="Buscar..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>
    );
  }, [filterText]);

  const handleCreate = async () => {
    try {
      const token = Cookies.get('token'); 
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token, 
        },
        body: JSON.stringify(newTalla),
      });
  
      if (response.ok) {
        toast.success('Talla creada exitosamente.');
        showData();
      } else {
        toast.warning('Complete todos los campos');
      }
    } catch (error) {
      console.error('Error en la solicitud de creación:', error);
      toast.error('Error en la solicitud de creación.');
    }
    handleClose();
  };

  const handleUpdateSubmit = async () => {
    try {
      const token = Cookies.get('token'); 
      const response = await fetch(`${url}/${selectedTalla._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token, 
        },
        body: JSON.stringify(selectedTalla),
      });
  
      if (response.ok) {
        toast.success('Talla actualizada exitosamente.');
        showData();
      } else {
        toast.error('Completa todos los campos');
      }
    } catch (error) {
      toast.error('Error en la solicitud de actualización.');
    }
  
    handleClose();
  };

  useEffect(() => {
    showData();
  }, []);

  const columns = [
    {
      name: 'Talla',
      selector: (row) => row.talla,
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
      name: 'Descripcion',
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

  return (
    <Styles.AppContainer>
      <Navbar />
      <h2>
      <img
          src="https://fontmeme.com/permalink/241028/2d50667efedb8c95a1fcf960d0d37c4c.png"
          alt="fuentes-de-comics"
          border="0"
          style={{ width: '85%', height: 'auto', maxWidth: '900px' }}
        />
      </h2>
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
          <Modal.Title>Crear Talla</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTalla">
              <Form.Label>Talla</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la talla"
                value={newTalla.talla}
                onChange={(e) => setNewTalla({ ...newTalla, talla: e.target.value })}
              />
            </Form.Group>


            <Form.Group controlId="formEstado">
  <Form.Label>Estado</Form.Label>
  <Form.Control
    as="select"
    value={newTalla.estado}
    onChange={(e) => setNewTalla({ ...newTalla, estado: e.target.value })}
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
                value={newTalla.descripcion}
                onChange={(e) => setNewTalla({ ...newTalla, descripcion: e.target.value })}
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
          <Modal.Title>Actualizar Talla</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>


            <Form.Group controlId="formTalla">
              <Form.Label>Talla</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la talla"
                value={selectedTalla ? selectedTalla.talla : ''}
                onChange={(e) =>
                  setSelectedTalla({
                    ...selectedTalla,
                    talla: e.target.value,
                  })
                }
              />
            </Form.Group>

            
            <Form.Group controlId="formEstado">
  <Form.Label>Estado</Form.Label>
  <Form.Control
    as="select"
    value={selectedTalla ? selectedTalla.estado.toString() : ''}
    onChange={(e) => setSelectedTalla({ ...selectedTalla, estado: e.target.value })}
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
                value={selectedTalla ? selectedTalla.descripcion : ''}
                onChange={(e) =>
                  setSelectedTalla({
                    ...selectedTalla,
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
      <Footer />
      <Styles.StyledModal show={showDeleteConfirmationModal} onHide={() => setShowDeleteConfirmationModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Confirmar Eliminación</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    ¿Estás seguro de que deseas eliminar esta talla?
  </Modal.Body>
  <Styles.ModalFooter>
    <Button className="otros" variant="danger" onClick={() => handleConfirmedDelete(tallaToDeleteId)}>
      Sí, Eliminar
    </Button>
    <Button className="otros" variant="secondary" onClick={() => setShowDeleteConfirmationModal(false)}>
      Cancelar
    </Button>
  </Styles.ModalFooter>
</Styles.StyledModal>

      <ToastContainer  />
    </Styles.AppContainer>

  );
};

export default TallasView;
