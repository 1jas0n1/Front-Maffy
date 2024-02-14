import React, { useState, useEffect, useMemo } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import * as Styles from '../css/styles_colores'; // Update import for styles
import Footer from '../component/footer/footer';
import { FaTrash, FaEdit } from 'react-icons/fa';
import Navbar from '../component/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';


const ArticulosView = () => {
  const [cookieData, setCookieData] = useState({
    miCookie: Cookies.get('miCookie') || null, // Puedes ajustar el nombre de la cookie
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
     // Set the category ID for the select value
    });
    setShowUpdateModal(true);
  };

  const showArticulos = async () => {
    try {
      const articulosResponse = await fetch('http://localhost:4000/api/articulos');
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
    const deleteUrl = `http://localhost:4000/api/articulos/${deleteItemId}`;
    const token = Cookies.get('token'); // Get the token from cookies

    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token, // Include the token in the header
      },
    });

    if (response.ok) {
      console.log(`Articulo con ID ${deleteItemId} borrado exitosamente.`);
      showArticulos();
      toast.success('Artículo eliminado correctamente', { position: toast.POSITION.TOP_CENTER });
    } else if (response.status === 403) {
      // Forbidden error (403)
      console.error('Permisos insuficientes para borrar el artículo.');
      toast.error('Permisos insuficientes para borrar el artículo', { position: toast.POSITION.TOP_CENTER });
    } else if (response.status === 401) {
      // Unauthorized error (401)
      console.error('Error de autenticación al borrar el artículo.');
      toast.error('Error de autenticación al intentar eliminar el artículo', { position: toast.POSITION.TOP_CENTER });
    } else {
      console.error(`Error al borrar el articulo con ID ${deleteItemId}.`);
      toast.error('Error al intentar eliminar el artículo', { position: toast.POSITION.TOP_CENTER });
    }
  } catch (error) {
    console.error('Error al realizar la solicitud DELETE:', error);
    toast.error('Error al intentar eliminar el artículo', { position: toast.POSITION.TOP_CENTER });
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
      <div style={{ display: 'flex', margin: '0 auto', marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>
    );
  }, [filterText, resetPaginationToggle]);

  const handleCreate = async () => {
    try {
      // Check if the required cookie is available
      const miCookie = Cookies.get('miCookie');
      const token = Cookies.get('token');
    
      console.log('miCookie:', miCookie);
    
      const createUrl = 'http://localhost:4000/api/articulos';
      const response = await fetch(createUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token, 
        },
        body: JSON.stringify(newArticulo),
      });
    
      if (response.status === 401) {
        // Unauthorized error (401)
        toast.error('Error de autenticación. Por favor, inicie sesión nuevamente.');
      } else if (response.status === 403) {
        // Forbidden error (403)
        toast.error('Acceso no permitido. No tiene los permisos necesarios.');
      } else if (!response.ok) {
        // Handle other errors if needed
        toast.error('Se produjo un error en la solicitud de creación.');
      } else {
        // Handle successful response
        toast.success('Artículo creado con éxito.');
        showArticulos(); // Update the table data
        handleClose();
      }
    } catch (error) {
      console.error('Error en la solicitud de creación:', error);
      toast.error('Se produjo un error en la solicitud de creación.');
    }
  };
  


const handleUpdateSubmit = async () => {
  try {
    const updateUrl = `http://localhost:4000/api/articulos/${selectedArticulo._id}`;
    const token = Cookies.get('token'); // Get the token from cookies

    const response = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token, // Include the token in the header
      },
      body: JSON.stringify(selectedArticulo),
    });

    if (response.status === 401) {
        // Unauthorized error (401)
        toast.error('Error de autenticación. Por favor, inicie sesión nuevamente.');
      } else if (response.status === 403) {
        // Forbidden error (403)
        toast.error('Acceso no permitido. No tiene los permisos necesarios.');
      } else if (!response.ok) {
        // Handle other errors if needed
        toast.error('Se produjo un error en la solicitud de Actualizacion.');
      } else {
        // Handle successful response
        toast.success('Artículo actualizado con éxito.');
        showArticulos(); // Update the table data
        handleClose();
      }
    } catch (error) {
      console.error('Error en la solicitud de creación:', error);
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
      center: true,
    },
    {
      name: 'Descripción',
      selector: (row) => row.descripcion,
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
