import React, { useState, useEffect, useMemo } from 'react';
import { Form, Button, Modal} from 'react-bootstrap';
import * as Styles from '../css/styles_colores';
import Footer from '../component/footer/footer';
import Navbar from '../component/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import ButtonM from '../component/BtnAgregar.js';

const DisenosView = () => {
  const [cookieData, setCookieData] = useState({
    miCookie: Cookies.get('miCookie') || null, 
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

  const url = 'https://apitammy-closset.fra1.zeabur.app/api/disenos';
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
      <div style={{ display: 'flex', margin: '0 auto', marginBottom: '10px',marginTop:'10px' }}>
        <input
          type="text"
          className='text-center'
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
        showData();
        toast.success('Diseño eliminado correctamente');
      } else {
        handleCommonErrors(response.status);
        toast.error('Error al eliminar el diseño');
      }
    } catch (error) {
      toast.error('Error al eliminar el diseño');
    } finally {
      setShowDeleteModal(false);
      setDeleteItemId(null);
    }
  };
  
  const handleCreate = async () => {
    try {
      const createUrl = 'https://apitammy-closset.fra1.zeabur.app/api/disenos';
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
        showData();
        toast.success('Diseño creado correctamente');
      } else {
        handleCommonErrors(response.status);
        console.error('Error al intentar crear el diseño.');
      }
    } catch (error) {
      toast.error('Error al crear el diseño');
    }
    handleClose();
  };
  
  const handleUpdateSubmit = async () => {
    try {
      const updateUrl = `https://apitammy-closset.fra1.zeabur.app/api/disenos/${selectedDiseno._id}`;
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
        showData();
        toast.success('Diseño actualizado correctamente');
      } else {
        handleCommonErrors(response.status);
      }
    } catch (error) {
      toast.error('Error al actualizar el diseño');
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
    <h2>
    <img
          src="https://fontmeme.com/permalink/241028/ed1ed4a9ac83fa6d98d13e636769c28c.png"
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
        data={filteredItems}
        customStyles={customStyles}
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
