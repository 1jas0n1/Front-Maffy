import React, { useState, useEffect, useMemo } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import * as Styles from '../css/styles_colores';
import { FaTrash,FaEdit } from 'react-icons/fa';
import Navbar from '../component/Navbar';
import Footer from '../component/footer/footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';

const MarcasView = () => {
    const [cookieData, setCookieData] = useState({
    miCookie: Cookies.get('miCookie') || null, // Puedes ajustar el nombre de la cookie
  });
  
  const [marcas, setMarcas] = useState([]);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [newMarca, setNewMarca] = useState({
    marca: '',
    estado: '',
    descripcion: '',
  });
  const [selectedMarca, setSelectedMarca] = useState(null);

  const handleClose = () => {
    setShowCreateModal(false);
    setShowUpdateModal(false);
    setNewMarca({
      marca: '',
      estado: '',
      descripcion: '',
    });
    setSelectedMarca(null);
  };

  const handleShow = () => setShowCreateModal(true);
  const handleUpdate = (marcaId) => {
    const selected = marcas.find((marca) => marca._id === marcaId);
    setSelectedMarca(selected);
    setShowUpdateModal(true);
  };

  const url = 'http://localhost:4000/api/marcas';

  const showData = async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setMarcas(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDelete = (marcaId) => {
    const selected = marcas.find((marca) => marca._id === marcaId);
    setSelectedMarca(selected);
    setShowDeleteConfirmation(true);
  };

  
  


  const filteredItems = marcas.filter(
    (item) => item.marca && item.marca.toLowerCase().includes(filterText.toLowerCase())
  );

  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div style={{ display: 'flex', margin: '0 auto', marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Buscar por marca"
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
    const token = Cookies.get('token');
    try {
      console.log('JSON que se envía en la creación:', JSON.stringify(newMarca)); 
      const newMarcaToSend = {
        ...newMarca,
        estado: newMarca.estado === 'Activo',
      };
  
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token, // Include the token in the header
        },
        body: JSON.stringify(newMarcaToSend),
      });
  
      if (response.ok) {
        toast.success('Marca creada exitosamente', { position: toast.POSITION.TOP_CENTER });
        console.log('Marca creada exitosamente.');
        showData();
      } else {
        handleCommonErrors(response.status); // Agregar notificación de error común
        console.error('Error al intentar crear la marca.');
      }
    } catch (error) {
      console.error('Error en la solicitud de creación:', error);
    }
  
    handleClose();
  };
  
  const handleDeleteConfirmed = async (marcaId) => {
    try {
      const token = Cookies.get('token');
      const response = await fetch(`${url}/${marcaId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token, // Include the token in the header
        },
      });
  
      if (response.ok) {
        toast.success('Material eliminado exitosamente', { position: toast.POSITION.TOP_CENTER });
        console.log(`Marca con ID ${marcaId} eliminada correctamente`);
        showData(); 
      } else {
        handleCommonErrors(response.status); // Agregar notificación de error común
        console.error(`Error al eliminar la marca con ID ${marcaId}`);
      }
    } catch (error) {
      console.error('Error deleting marca:', error);
    }
  };
  
  const handleUpdateSubmit = async () => {
    try {
      const token = Cookies.get('token');
    
      const selectedMarcaToSend = {
        ...selectedMarca,
        estado: selectedMarca.estado === 'Activo',
      };
  
      const response = await fetch(`${url}/${selectedMarca._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token, // Include the token in the header
        },
        body: JSON.stringify(selectedMarcaToSend),
      });
  
      if (response.ok) {
        toast.success('Marca actualizado exitosamente', { position: toast.POSITION.TOP_CENTER });
        console.log('Marca actualizada exitosamente.');
        showData();
      } else {
        handleCommonErrors(response.status); // Agregar notificación de error común
        console.error('Error al intentar actualizar la marca.');
      }
    } catch (error) {
      console.error('Error en la solicitud de actualización:', error);
    }
  
    handleClose();
  };
  

  useEffect(() => {
    showData();
  }, []);

  const columns  = [
  
    {
      name: 'Marca',
      selector: (row) => row.marca,
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
          <Modal.Title>Crear Marca</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formMarca">
              <Form.Label>Marca</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la marca"
                value={newMarca.marca}
                onChange={(e) => setNewMarca({ ...newMarca, marca: e.target.value })}
              />
            </Form.Group>


            <Form.Group controlId="formEstado">
  <Form.Label>Estado</Form.Label>
  <Form.Control
    as="select"
    value={newMarca.estado}
    onChange={(e) => setNewMarca({ ...newMarca, estado: e.target.value })}
  >
    <option value="">Seleccionar Estado</option>
    <option value="Activo">Activo</option>
    <option value="Inactivo">Inactivo</option>
  </Form.Control>
</Form.Group>



            <Form.Group controlId="formDescripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la descripción"
                value={newMarca.descripcion}
                onChange={(e) => setNewMarca({ ...newMarca, descripcion: e.target.value })}
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
          <Modal.Title>Actualizar Marca</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formMarca">
              <Form.Label>Marca</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la marca"
                value={selectedMarca ? selectedMarca.marca : ''}
                onChange={(e) =>
                  setSelectedMarca({
                    ...selectedMarca,
                    marca: e.target.value,
                  })
                }
              />
            </Form.Group>


           <Form.Group controlId="formEstado">
  <Form.Label>Estado</Form.Label>
  <Form.Control
    as="select"
    value={selectedMarca ? selectedMarca.estado : ''}
    onChange={(e) =>
      setSelectedMarca({
        ...selectedMarca,
        estado: e.target.value,
      })
    }
  >
    <option value="">Seleccionar Estado</option>
    <option value="Activo">Activo</option>
    <option value="Inactivo">Inactivo</option>
  </Form.Control>
</Form.Group>



            <Form.Group controlId="formDescripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la descripción"
                value={selectedMarca ? selectedMarca.descripcion : ''}
                onChange={(e) =>
                  setSelectedMarca({
                    ...selectedMarca,
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

      <Modal  show={showDeleteConfirmation} onHide={() => setShowDeleteConfirmation(false)}>
  <Modal.Header   closeButton  style={{backgroundColor:'#4a4a4a',color:'white'}}>
    <Modal.Title>Confirmar Eliminación</Modal.Title>
  </Modal.Header>
  <Modal.Body style={{backgroundColor:'#4a4a4a',color:'white'}}>
    ¿Estás seguro de que deseas eliminar esta marca?
  </Modal.Body>
  <Modal.Footer style={{backgroundColor:'#4a4a4a',color:'white'}}>
    <Button variant="danger" style={{ width: '100px', height: '50px' }} onClick={() => {
      handleDeleteConfirmed(selectedMarca._id);
      setShowDeleteConfirmation(false);
    }}>
      Si
    </Button>
    <Button style={{ width: '100px', height: '50px' }} variant="secondary" onClick={() => setShowDeleteConfirmation(false)}>
      Cancelar
    </Button>
  </Modal.Footer>
</Modal>


      <Footer/> 
      <ToastContainer />
    </Styles.AppContainer>
  );
};

export default MarcasView;
