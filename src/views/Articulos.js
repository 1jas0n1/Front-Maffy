import React, { useState, useEffect, useMemo } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import * as Styles from '../css/styles_colores'; 
import Footer from '../component/footer/footer';
import Navbar from '../component/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import ButtonM from '../component/BtnAgregar.js';

const ArticulosView = () => {
  const [cookieData, setCookieData] = useState({
  miCookie: Cookies.get('miCookie') || null, 
  });
  const [articulos, setArticulos] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [newArticulo, setNewArticulo] = useState({
    nombre: '',
    descripcion: '',
    estado: '',
  });

  const [selectedArticulo, setSelectedArticulo] = useState(null);
  const handleClose = () => {
    setShowCreateModal(false);
    setShowUpdateModal(false);
    setNewArticulo({
      nombre: '',
      descripcion: '',
      estado: true,
    });
    setSelectedArticulo(null);
  };

  const handleShow = () => setShowCreateModal(true);
  const handleUpdate = (articuloId) => {
    const selected = articulos.find((articulo) => articulo._id === articuloId);
    setSelectedArticulo({
      ...selected,
    });
    setShowUpdateModal(true);
  };

  const showArticulos = async () => {
    try {
      const articulosResponse = await fetch('https://apimafy.zeabur.app/api/articulos');
      const articulosData = await articulosResponse.json();
      const articulosWithCategoria = articulosData.map((articulo) => ({
        ...articulo,
      }));
      setArticulos(articulosWithCategoria);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDelete = (articuloId) => {
    setDeleteItemId(articuloId);
    setShowDeleteConfirmation(true);
  };

const handleDeleteConfirmed = async () => {
  try {
    const deleteUrl = `https://apimafy.zeabur.app/api/articulos/${deleteItemId}`;
    const token = Cookies.get('token'); 
    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token, 
      },
    });
    if (response.ok) {
      showArticulos();
      toast.success('Artículo eliminado correctamente');
    } else if (response.status === 403) {
      toast.error('Permisos insuficientes para borrar el artículo');
    } else if (response.status === 401) {
      toast.error('Error de autenticación al intentar eliminar el artículo');
    } else {
      toast.error('Error al intentar eliminar el artículo');
    }
  } catch (error) {
    toast.error('Error al intentar eliminar el artículo');
  } finally {
    closeDeleteConfirmationModal();
  }
};

  const closeDeleteConfirmationModal = () => {
    setShowDeleteConfirmation(false);
    setDeleteItemId(null);
  };

  const handleClear = () => {
    if (filterText) {
      setResetPaginationToggle(!resetPaginationToggle);
      setFilterText('');
    }
  };

  const filteredItems = articulos.filter(
    (item) =>
      item.nombre && item.nombre.toLowerCase().includes(filterText.toLowerCase())
  );

  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div style={{ display: 'flex', margin: '0 auto', marginBottom: '10px',marginTop:'10px' }}>
        <input
          className="text-center"
          type="text"
          placeholder="Buscar..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>
    );
  }, [filterText, resetPaginationToggle]);
  const handleCreate = async () => {
    try {
 
      const miCookie = Cookies.get('miCookie');
      const token = Cookies.get('token');
      const createUrl = 'https://apimafy.zeabur.app/api/articulos';
      const response = await fetch(createUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify(newArticulo),
      });
  
      if (response.status === 401) {
        toast.error('Error de autenticación. Por favor, inicie sesión nuevamente.');
      } else if (response.status === 403) {
        toast.error('Acceso no permitido. No tiene los permisos necesarios.');
      } else if (response.status === 400) {
        toast.error('No se puede crear el artículo porque ya existe.');
      } else if (!response.ok) {
        toast.error('Se produjo un error en la solicitud de creación.');
      } else {
        toast.success('Artículo creado con éxito.');
        showArticulos(); 
        handleClose();
      }
    } catch (error) {
      toast.error('Se produjo un error en la solicitud de creación.');
    }
  };

const handleUpdateSubmit = async () => {
  try {
    const updateUrl = `https://apimafy.zeabur.app/api/articulos/${selectedArticulo._id}`;
    const token = Cookies.get('token'); 
    const response = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token, 
      },
      body: JSON.stringify(selectedArticulo),
    });

    if (response.status === 401) {
        toast.error('Error de autenticación. Por favor, inicie sesión nuevamente.');
      } else if (response.status === 403) {
        toast.error('Acceso no permitido. No tiene los permisos necesarios.');
      } else if (!response.ok) {
        toast.error('Se produjo un error en la solicitud de Actualizacion.');
      } else {
        toast.success('Artículo actualizado con éxito.');
        showArticulos(); 
        handleClose();
      }
    } catch (error) {
      toast.error('Se produjo un error en la solicitud de Actualizacion.');
    }
  handleClose();
};

  useEffect(() => {
    showArticulos();
  }, []);

  const columns = [
    {
      name: 'Nombre',
      selector: (row) => row.nombre,
      sortable: true,
    },
    {
      name: 'Descripción',
      selector: (row) => row.descripcion,
      sortable: true,
    },
    {
      name: 'Estado',
      selector: (row) => (row.estado ? 'Activo' : 'Inactivo'),
      sortable: true,
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
      <ButtonM onClick={handleShow}>
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
          <Modal.Title>Crear Artículo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre"
                value={newArticulo.nombre}
                onChange={(e) => setNewArticulo({ ...newArticulo, nombre: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formDescripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la descripción"
                value={newArticulo.descripcion}
                onChange={(e) => setNewArticulo({ ...newArticulo, descripcion: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formEstado">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                as="select"
                value={newArticulo.estado}
                onChange={(e) => setNewArticulo({ ...newArticulo, estado: e.target.value })}
              >
                <option value="">Selecciona un Estado</option>
                <option value={true}>Activo</option>
                <option value={false}>Inactivo</option>
              </Form.Control>
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
          <Modal.Title>Actualizar Artículo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre"
                value={selectedArticulo ? selectedArticulo.nombre : ''}
                onChange={(e) =>
                  setSelectedArticulo({
                    ...selectedArticulo,
                    nombre: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formDescripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la descripción"
                value={selectedArticulo ? selectedArticulo.descripcion : ''}
                onChange={(e) =>
                  setSelectedArticulo({
                    ...selectedArticulo,
                    descripcion: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formEstado">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                as="select"
                value={selectedArticulo ? selectedArticulo.estado : ''}
                onChange={(e) =>
                  setSelectedArticulo({
                    ...selectedArticulo,
                    estado: e.target.value,
                  })
                }
              >
                <option value={true}>Activo</option>
                <option value={false}>Inactivo</option>
              </Form.Control>
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
      <Styles.AppContainer>
      <Styles.StyledModal show={showDeleteConfirmation} onHide={closeDeleteConfirmationModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Estás seguro de que deseas eliminar este artículo?</p>
        </Modal.Body>
        <Styles.ModalFooter>
          <Button style={{ width: '100px', height: '50px' }} variant="danger" onClick={handleDeleteConfirmed}>
            Sí
          </Button>
          <Button style={{ width: '100px', height: '50px' }} variant="secondary" onClick={closeDeleteConfirmationModal}>
            Cancelar
          </Button>
        </Styles.ModalFooter>
      </Styles.StyledModal>
    </Styles.AppContainer>
      <Footer />
      <ToastContainer />
    </Styles.AppContainer>
  );
};

export default ArticulosView;
