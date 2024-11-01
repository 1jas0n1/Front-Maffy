import React, { useState, useEffect, useMemo } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import * as Styles from '../css/styles_colores'; 
import Footer from '../component/footer/footer';
import ButtonM from '../component/BtnAgregar.js';
import Navbar from '../component/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';


const ServiciosView = () => {
  const [cookieData, setCookieData] = useState({
    miCookie: Cookies.get('miCookie') || null, 
  });
  
  const [Servicios, setServicios] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [newServicio, setNewServicio] = useState({
    nombre: '',
    descripcion: '',
    estado: '',
    precio:''
   
  });
  const [selectedServicio, setSelectedServicio] = useState(null);

  const handleClose = () => {
    setShowCreateModal(false);
    setShowUpdateModal(false);
    setNewServicio({
      nombre: '',
      descripcion: '',
      estado: true,
      precio:'',
    
    });
    setSelectedServicio(null);
  };

  const handleShow = () => setShowCreateModal(true);

  const handleUpdate = (ServicioId) => {
    const selected = Servicios.find((Servicio) => Servicio._id === ServicioId);
    setSelectedServicio({
      ...selected,
    });
    setShowUpdateModal(true);
  };

  const showServicios = async () => {
    try {
      const ServiciosResponse = await fetch('https://apitammy-closset.fra1.zeabur.app/api/servicios');
      const ServiciosData = await ServiciosResponse.json();
      const ServiciosWithCategoria = ServiciosData.map((Servicio) => ({
        ...Servicio,
      }));
      setServicios(ServiciosWithCategoria);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDelete = (ServicioId) => {
    setDeleteItemId(ServicioId);
    setShowDeleteConfirmation(true);
  };

const handleDeleteConfirmed = async () => {
  try {
    const deleteUrl = `https://apitammy-closset.fra1.zeabur.app/api/servicios/${deleteItemId}`;
    const token = Cookies.get('token'); 

    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token, 
      },
    });

    if (response.ok) {
      showServicios();
      toast.success('Servicio eliminado correctamente');
    } else if (response.status === 403) {
      toast.error('Permisos insuficientes para borrar el servicio');
    } else if (response.status === 401) {
      toast.error('Error de autenticación al intentar eliminar el servicio');
    } else {
      toast.error('Error al intentar eliminar el servicio');
    }
  } catch (error) {
    toast.error('Error al intentar eliminar el servicio');
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

  const filteredItems = Servicios.filter(
    (item) =>
      (item.nombre && item.nombre.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.descripcion && item.descripcion.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.precio && item.precio.toString().includes(filterText))
  );
  
  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div style={{ display: 'flex', margin: '0 auto'}}>
        <input style={{borderRadius:'5px',textAlign:'center',marginTop:'10px',marginBottom:'10px'}}
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
      console.log('miCookie:', miCookie);
      const createUrl = 'https://apitammy-closset.fra1.zeabur.app/api/servicios';
      const response = await fetch(createUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify(newServicio),
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
        showServicios(); 
        handleClose();
      }
    } catch (error) {
      toast.error('Se produjo un error en la solicitud de creación.');
    }
  };

const handleUpdateSubmit = async () => {
  try {
    const updateUrl = `https://apitammy-closset.fra1.zeabur.app/api/Servicios/${selectedServicio._id}`;
    const token = Cookies.get('token'); 

    const response = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token, 
      },
      body: JSON.stringify(selectedServicio),
    });

    if (response.status === 401) {
        toast.error('Error de autenticación. Por favor, inicie sesión nuevamente.');
      } else if (response.status === 403) {
        toast.error('Acceso no permitido. No tiene los permisos necesarios.');
      } else if (!response.ok) {
        toast.error('Se produjo un error en la solicitud de Actualizacion.');
      } else {
        toast.success('Artículo actualizado con éxito.');
        showServicios(); 
        handleClose();
      }
    } catch (error) {
      toast.error('Se produjo un error en la solicitud de Actualizacion.');
    }
  handleClose();
};

  useEffect(() => {
    showServicios();
  }, []);

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: '#4A2148',
        color: '#fff',
        fontWeight: 'bold',
      },
    },
  };

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
      name: 'Precio',
      selector: (row) => row.precio,
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

  return (
    <Styles.AppContainer>
      <Navbar />
      <h2>
      <img
          src="https://fontmeme.com/permalink/241028/9b4d047caad2c042940731f964221fcf.png"
          alt="fuentes-de-comics"
          border="0"
          style={{ width: '85%', height: 'auto', maxWidth: '900px' }}
        />
      </h2>
      <ButtonM  onClick={handleShow}>
        Crear Nuevo
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
                value={newServicio.nombre}
                onChange={(e) => setNewServicio({ ...newServicio, nombre: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formDescripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la descripción"
                value={newServicio.descripcion}
                onChange={(e) => setNewServicio({ ...newServicio, descripcion: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="formDescripcion">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el precio"
                value={newServicio.precio}
                onChange={(e) => setNewServicio({ ...newServicio, precio: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="formEstado">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                as="select"
                value={newServicio.estado}
                onChange={(e) => setNewServicio({ ...newServicio, estado: e.target.value })}
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
          <Modal.Title>Actualizar Servicio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre"
                value={selectedServicio ? selectedServicio.nombre : ''}
                onChange={(e) =>
                  setSelectedServicio({
                    ...selectedServicio,
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
                value={selectedServicio ? selectedServicio.descripcion : ''}
                onChange={(e) =>
                  setSelectedServicio({
                    ...selectedServicio,
                    descripcion: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group controlId="formDescripcion">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el Precio"
                value={selectedServicio ? selectedServicio.precio : ''}
                onChange={(e) =>
                  setSelectedServicio({
                    ...selectedServicio,
                    precio: e.target.value,
                  })
                }
              />
            </Form.Group>


            <Form.Group controlId="formEstado">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                as="select"
                value={selectedServicio ? selectedServicio.estado : ''}
                onChange={(e) =>
                  setSelectedServicio({
                    ...selectedServicio,
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
          <p>¿Estás seguro de que deseas eliminar este servicio?</p>
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

export default ServiciosView;
