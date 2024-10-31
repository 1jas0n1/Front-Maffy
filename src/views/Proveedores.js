import React, { useState, useEffect, useMemo } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import * as Styles from '../css/styles_colores';
import Footer from '../component/footer/footer';
import Navbar from '../component/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import ButtonM from '../component/BtnAgregar.js';

const ProveedoresView = () => {
  const [cookieData, setCookieData] = useState({
    miCookie: Cookies.get('miCookie') || null, 
  });
  const [proveedores, setProveedores] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [selectedProveedorId, setSelectedProveedorId] = useState(null);
  const [newProveedor, setNewProveedor] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    correo: '',
    descripcion: '',
    estado: true,
  });
  const [selectedProveedor, setSelectedProveedor] = useState(null);

  const handleClose = () => {
    setShowCreateModal(false);
    setShowUpdateModal(false);
    setNewProveedor({
      nombre: '',
      direccion: '',
      telefono: '',
      correo: '',
      descripcion: '',
      estado: true,
    });
    setSelectedProveedor(null);
  };

  const handleShow = () => setShowCreateModal(true);

  const url = 'https://apitammy-closset.fra1.zeabur.app/api/proveedores';

  const showData = async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setProveedores(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDelete = (proveedorId) => {
    setSelectedProveedorId(proveedorId); 
    setShowConfirmationModal(true);
  };
  
  const filteredItems = proveedores.filter(
    (item) => item.nombre && item.nombre.toLowerCase().includes(filterText.toLowerCase())
  );
  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div style={{ display: 'flex', margin: '0 auto', marginBottom: '10px', marginTop:'10px' }}>
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
    try {
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
    } catch (error) {
    }
  };
  
  const handleCreate = async () => {
    try {
      const token = Cookies.get('token');
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify(newProveedor),
      });
  
      if (response.ok) {
        toast.success('Proveedor creado correctamente');
        showData();
      } else {
        handleCommonErrors(response.status);
        toast.error('Complete todos los campos');
      }
    } catch (error) {
    }
  
    handleClose();
  };
  
  const handleConfirmDelete = async () => {
    try {
      const token = Cookies.get('token');
      const response = await fetch(`${url}/${selectedProveedorId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
      });
  
      if (response.ok) {
        toast.success('Proveedor Eliminado correctamente');
        showData();
      } else {
        handleCommonErrors(response.status);
        toast.error('Error Proveedor no encontrado');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  
    setShowConfirmationModal(false);
  };
  
  const handleUpdateSubmit = async () => {
    try {
      const token = Cookies.get('token');
      const response = await fetch(`${url}/${selectedProveedor._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify(selectedProveedor),
      });
  
      if (response.ok) {
        toast.success('Proveedor Editado correctamente');
        showData();
      } else {
        handleCommonErrors(response.status);
        toast.error('Complete todos los campos.');
      }
    } catch (error) {
    }
  
    handleClose();
  };

  const handleUpdate = (proveedorId) => {
    const selected = proveedores.find((proveedor) => proveedor._id === proveedorId);
    setSelectedProveedor(selected);
    setShowUpdateModal(true);
  };

  useEffect(() => {
    showData();
  }, []);

  const columns = [
    {
      name: 'Nombre',
      selector: (row) => row.nombre,
      sortable: true,
      center: true,
    },
    {
      name: 'Doreccíon',
      selector: (row) => row.direccion,
      sortable: true,
      center: true,
    },
    {
      name: 'Telefono',
      selector: (row) => row.telefono,
      sortable: true,
      center: true,
    },
    {
      name: 'E-mail',
      selector: (row) => row.correo,
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
          src="https://fontmeme.com/permalink/241028/477f2a43a947973738a776c3a450df68.png"
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
          <Modal.Title>Crear Proveedor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre"
                value={newProveedor.nombre}
                onChange={(e) => setNewProveedor({ ...newProveedor, nombre: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formDireccion">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la dirección"
                value={newProveedor.direccion}
                onChange={(e) => setNewProveedor({ ...newProveedor, direccion: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formTelefono">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el teléfono"
                value={newProveedor.telefono}
                onChange={(e) => setNewProveedor({ ...newProveedor, telefono: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formCorreo">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el correo"
                value={newProveedor.correo}
                onChange={(e) => setNewProveedor({ ...newProveedor, correo: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formDescripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la descripción"
                value={newProveedor.descripcion}
                onChange={(e) =>
                  setNewProveedor({ ...newProveedor, descripcion: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formEstado">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                as="select"
                value={newProveedor.estado ? 'Activo' : 'Inactivo'}
                onChange={(e) =>
                  setNewProveedor({ ...newProveedor, estado: e.target.value === 'Activo' })
                }
              >
                <option>Activo</option>
                <option>Inactivo</option>
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
          <Modal.Title>Actualizar Proveedor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre"
                value={selectedProveedor ? selectedProveedor.nombre : ''}
                onChange={(e) =>
                  setSelectedProveedor({
                    ...selectedProveedor,
                    nombre: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formDireccion">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la dirección"
                value={selectedProveedor ? selectedProveedor.direccion : ''}
                onChange={(e) =>
                  setSelectedProveedor({
                    ...selectedProveedor,
                    direccion: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formTelefono">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el teléfono"
                value={selectedProveedor ? selectedProveedor.telefono : ''}
                onChange={(e) =>
                  setSelectedProveedor({
                    ...selectedProveedor,
                    telefono: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formCorreo">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el correo"
                value={selectedProveedor ? selectedProveedor.correo : ''}
                onChange={(e) =>
                  setSelectedProveedor({
                    ...selectedProveedor,
                    correo: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formDescripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la descripción"
                value={selectedProveedor ? selectedProveedor.descripcion : ''}
                onChange={(e) =>
                  setSelectedProveedor({
                    ...selectedProveedor,
                    descripcion: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formEstado">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                as="select"
                value={
                  selectedProveedor ? (selectedProveedor.estado ? 'Activo' : 'Inactivo') : ''
                }
                onChange={(e) =>
                  setSelectedProveedor({
                    ...selectedProveedor,
                    estado: e.target.value === 'Activo',
                  })
                }
              >
                <option>Activo</option>
                <option>Inactivo</option>
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
      <Footer />
      <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
  <Modal.Header style={{color:'white',backgroundColor:'#4a4a4a'}} closeButton>
    <Modal.Title>Confirmar Eliminación</Modal.Title>
  </Modal.Header>
  <Modal.Body style={{color:'white',backgroundColor:'#4a4a4a'}} >
    ¿Está seguro de que desea eliminar este proveedor?
  </Modal.Body>
  <Modal.Footer style={{color:'white',backgroundColor:'#4a4a4a'}} >
    <Button style={{ width: '100px', height: '50px' }} variant="danger" onClick={() => handleConfirmDelete()}>
      Si
    </Button>
    <Button style={{ width: '100px', height: '50px' }} variant="secondary" onClick={() => setShowConfirmationModal(false)}>
      Cancelar
    </Button>
  </Modal.Footer>
</Modal>


      <ToastContainer/>
    </Styles.AppContainer>
  );
};

export default ProveedoresView;
