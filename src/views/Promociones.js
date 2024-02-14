import React, { useState, useEffect, useMemo } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import * as Styles from '../css/styles_colores';
import Footer from '../component/footer/footer';
import { FaTrash, FaEdit } from 'react-icons/fa';
import Navbar from '../component/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format } from 'date-fns';
import Cookies from 'js-cookie';

const PromocionesView = () => {
  const [cookieData, setCookieData] = useState({
    miCookie: Cookies.get('miCookie') || null, 
  });
  const [promociones, setPromociones] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
  const [newPromocion, setNewPromocion] = useState({
    promocion: '',
    fecha_inicio: '',
    fecha_final: '',
    descuento: 0,
    descripcion: '',
    estado: true,
    cantidad_Articulos: 0,
  });
  const [selectedPromocion, setSelectedPromocion] = useState(null);

  const handleClose = () => {
    setShowCreateModal(false);
    setShowUpdateModal(false);
    setNewPromocion({
      promocion: '',
      fecha_inicio: '',
      fecha_final: '',
      descuento: 0,
      descripcion: '',
      estado: true,
      cantidad_Articulos: 0,
    });
    setSelectedPromocion(null);
  };

  const handleNotificacion = () => {
   
    toast.success('Operación exitosa', { position: toast.POSITION.TOP_CENTER });
  };
  const isNumeric = (value) => {
    return /^\d+$/.test(value);
  };
  const handleShow = () => setShowCreateModal(true);

  const url = 'http://localhost:4000/api/promociones';

  const showData = async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setPromociones(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

 

  const handleDelete = (promocionId) => {
    const selected = promociones.find((promocion) => promocion._id === promocionId);
    setSelectedPromocion(selected);
    setShowDeleteConfirmationModal(true);
  };

  

  const handleCloseDeleteConfirmationModal = () => {
    setShowDeleteConfirmationModal(false);
    setSelectedPromocion(null);
  };

  const handleClear = () => {
    if (filterText) {
      setResetPaginationToggle(!resetPaginationToggle);
      setFilterText('');
    }
  };

  const filteredItems = promociones.filter(
    (item) => item.promocion && item.promocion.toLowerCase().includes(filterText.toLowerCase())
  );

  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div style={{ display: 'flex', margin: '0 auto', marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Buscar por promoción"
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
          console.error('Error 401: No autorizado para realizar esta acción.');
          toast.error('Su sesión ha caducado. Por favor, vuelva a iniciar sesión.', { position: toast.POSITION.TOP_CENTER });
          // Agregar lógica aquí para redirigir al usuario a la página de inicio de sesión si es necesario
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
    } catch (error) {
      console.error('Error en handleCommonErrors:', error);
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
        body: JSON.stringify(newPromocion),
      });
  
      if (response.ok) {
        handleNotificacion();
        console.log('Promoción creada exitosamente.');
        showData();
      } else {
        console.error('Error al intentar crear la promoción.');
        handleCommonErrors(response.status);
      }
    } catch (error) {
      if (error instanceof TypeError) {
        console.error('Error de tipo:', error);
      } else if (error instanceof SyntaxError) {
        console.error('Error de sintaxis:', error);
      } else {
        console.error('Error en la solicitud de creación:', error);
        handleCommonErrors(error.response?.status || 500);
      }
    }
  
    handleClose();
  };
  
  const handleConfirmDelete = async () => {
    try {
      const token = Cookies.get('token');
      const response = await fetch(`${url}/${selectedPromocion._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
      });
  
      if (response.ok) {
        console.log(`Promoción con ID ${selectedPromocion._id} eliminada correctamente`);
        showData();
        handleNotificacion(); // Puedes notificar al usuario de la eliminación exitosa
      } else {
        console.error(`Error al intentar eliminar la promoción con ID ${selectedPromocion._id}`);
        handleCommonErrors(response.status);
      }
    } catch (error) {
      console.error('Error en handleConfirmDelete:', error);
      handleCommonErrors(error.response?.status || 500);
    }
  
    handleCloseDeleteConfirmationModal();
  };
  
  const handleUpdateSubmit = async () => {
    try {
      const token = Cookies.get('token');
      const response = await fetch(`${url}/${selectedPromocion._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify(selectedPromocion),
      });
  
      if (response.ok) {
        console.log('Promoción actualizada exitosamente.');
        showData();
      } else {
        console.error('Error al intentar actualizar la promoción.');
        handleCommonErrors(response.status);
      }
    } catch (error) {
      console.error('Error en handleUpdateSubmit:', error);
      handleCommonErrors(error.response?.status || 500);
    }
  
    handleClose();
  };
  
  
  


  const handleUpdate = (promocionId) => {
    const selected = promociones.find((promocion) => promocion._id === promocionId);
    setSelectedPromocion(selected);
    setShowUpdateModal(true);
  };

  
  useEffect(() => {
    showData();
  }, []);

  const columns = [
    {
      name: 'Promocion',
      selector: (row) => row.promocion,
      sortable: true,
      center: true,
    },
    {
      name: 'Fecha Inicio',
      selector: (row) => format(new Date(row.fecha_inicio), 'dd/MM/yyyy'),
      sortable: true,
      center: true,
    },
    {
      name: 'Fecha Final',
      selector: (row) => format(new Date(row.fecha_final), 'dd/MM/yyyy'),
      sortable: true,
      center: true,
    },
    {
      name: 'Descuento',
      selector: (row) => `${row.descuento}%`,
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
      name: 'Estado',
      selector: (row) => (row.estado ? 'Activo' : 'Inactivo'),
      sortable: true,
      center: true,
    },
    {
      name: 'Cantidad',
      selector: (row) => row.cantidad_Articulos,
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
          <Modal.Title>Crear Promoción</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formPromocion">
              <Form.Label>Promoción</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre de la promoción"
                value={newPromocion.promocion}
                onChange={(e) => setNewPromocion({ ...newPromocion, promocion: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formFechaInicio">
              <Form.Label>Fecha de Inicio</Form.Label>
              <Form.Control
                type="date"
                value={newPromocion.fecha_inicio}
                onChange={(e) => setNewPromocion({ ...newPromocion, fecha_inicio: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formFechaFinal">
              <Form.Label>Fecha Final</Form.Label>
              <Form.Control
                type="date"
                value={newPromocion.fecha_final}
                onChange={(e) => setNewPromocion({ ...newPromocion, fecha_final: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formDescuento">
              <Form.Label>Descuento (%)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Ingrese el descuento"
                value={newPromocion.descuento}
                onChange={(e) => setNewPromocion({ ...newPromocion, descuento: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formDescripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la descripción"
                value={newPromocion.descripcion}
                onChange={(e) => setNewPromocion({ ...newPromocion, descripcion: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formEstado">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                as="select"
                value={newPromocion.estado ? 'Activo' : 'Inactivo'}
                onChange={(e) =>
                  setNewPromocion({ ...newPromocion, estado: e.target.value === 'Activo' })
                }
              >
                <option>Activo</option>
                <option>Inactivo</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formCantidadArticulos">
              <Form.Label>Cantidad de Artículos</Form.Label>
              <Form.Control
                type="number"
                placeholder="Ingrese la cantidad de artículos"
                value={newPromocion.cantidad_Articulos}
                onChange={(e) =>
                  setNewPromocion({
                    ...newPromocion,
                    cantidad_Articulos: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Styles.ModalFooter>
          <Button className="otros" variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          <Button className="otros" variant="primary" onClick={handleCreate}>
            Guardar
          </Button>
        </Styles.ModalFooter>
      </Styles.StyledModal>

   

      <Styles.StyledModal show={showUpdateModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Actualizar Promoción</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formPromocion">
              <Form.Label>Promoción</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre de la promoción"
                value={selectedPromocion ? selectedPromocion.promocion : ''}
                onChange={(e) =>
                  setSelectedPromocion({
                    ...selectedPromocion,
                    promocion: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formFechaInicio">
              <Form.Label>Fecha de Inicio</Form.Label>
              <Form.Control
                type="date"
                value={selectedPromocion ? selectedPromocion.fecha_inicio : ''}
                onChange={(e) =>
                  setSelectedPromocion({
                    ...selectedPromocion,
                    fecha_inicio: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formFechaFinal">
              <Form.Label>Fecha Final</Form.Label>
              <Form.Control
                type="date"
                value={selectedPromocion ? selectedPromocion.fecha_final : ''}
                onChange={(e) =>
                  setSelectedPromocion({
                    ...selectedPromocion,
                    fecha_final: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group controlId="formDescuento">
  <Form.Label>Descuento (%)</Form.Label>
  <Form.Control
    type="number"
    placeholder="Ingrese el descuento"
    value={newPromocion.descuento}
    onChange={(e) => {
      const inputValue = e.target.value;
      if (isNumeric(inputValue) || inputValue === '') {
        setNewPromocion({ ...newPromocion, descuento: inputValue });
      }
    }}
  />
</Form.Group>


            <Form.Group controlId="formDescripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la descripción"
                value={selectedPromocion ? selectedPromocion.descripcion : ''}
                onChange={(e) =>
                  setSelectedPromocion({
                    ...selectedPromocion,
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
                  selectedPromocion ? (selectedPromocion.estado ? 'Activo' : 'Inactivo') : ''
                }
                onChange={(e) =>
                  setSelectedPromocion({
                    ...selectedPromocion,
                    estado: e.target.value === 'Activo',
                  })
                }
              >
                <option>Activo</option>
                <option>Inactivo</option>
              </Form.Control>
            </Form.Group>

           <Form.Group controlId="formCantidadArticulos">
  <Form.Label>Cantidad de Artículos</Form.Label>
  <Form.Control
    type="number"
    placeholder="Ingrese la cantidad de artículos"
    value={newPromocion.cantidad_Articulos}
    onChange={(e) => {
      const inputValue = e.target.value;
      if (isNumeric(inputValue) || inputValue === '') {
        setNewPromocion({ ...newPromocion, cantidad_Articulos: inputValue });
      }
    }}
  />
</Form.Group>

          </Form>
        </Modal.Body>
        <Styles.ModalFooter>
          <Button className="otros" variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          <Button className="otros" variant="primary" onClick={handleUpdateSubmit}>
            Guardar cambios
          </Button>
        </Styles.ModalFooter>
      </Styles.StyledModal>

      <Styles.StyledModal show={showDeleteConfirmationModal} onHide={handleCloseDeleteConfirmationModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Está seguro de que desea eliminar la promoción?</p>
        </Modal.Body>
        <Styles.ModalFooter>
          <Button className="otros" variant="secondary" onClick={handleCloseDeleteConfirmationModal}>
            Cancelar
          </Button>
          <Button className="otros" variant="danger" onClick={handleConfirmDelete}>
            Eliminar
          </Button>
        </Styles.ModalFooter>
      </Styles.StyledModal>

      <Footer />
      <ToastContainer />
    </Styles.AppContainer>
  );
};

export default PromocionesView;


