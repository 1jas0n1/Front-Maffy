import React, { useState, useEffect, useMemo } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import * as Styles from '../css/styles_colores';
import Footer from '../component/footer/footer';
import MyNavbar from '../component/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie'; 


const ColoresView = () => {

  
  const [colors, setColors] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteColorId, setDeleteColorId] = useState(null);
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [newColor, setNewColor] = useState({
    color: '',
    estado: '',
    descripcion: '',
  });
  const [selectedColor, setSelectedColor] = useState(null);

  const handleClose = () => {
    setShowCreateModal(false);
    setShowUpdateModal(false);
    setNewColor({
      color: '',
      estado: '',
      descripcion: '',
    });
    setSelectedColor(null);
  };

  const handleShow = () => setShowCreateModal(true);

  const handleUpdate = (colorId) => {
    const selected = colors.find((color) => color._id === colorId);
    setSelectedColor(selected);
    setShowUpdateModal(true);
  };

  const url = 'https://apimafy.zeabur.app/api/colores';

  const showData = async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setColors(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDelete = (colorId) => {
    setDeleteColorId(colorId);
    setShowDeleteModal(true);
  };

  const handleClear = () => {
    if (filterText) {
      setResetPaginationToggle(!resetPaginationToggle);
      setFilterText('');
    }
  };

  const filteredItems = colors.filter(
    (item) =>
      item.color && item.color.toLowerCase().includes(filterText.toLowerCase())
  );

  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div style={{ display: 'flex', margin: '0 auto', marginBottom: '10px' }}>
        <input  style={{borderRadius:'5px',textAlign:'center'}}
          type="text"
          placeholder="Buscar "
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>
    );
  }, [filterText, resetPaginationToggle]);


  const handleDeleteConfirm = async () => {
    try {
      const deleteUrl = `https://apimafy.zeabur.app/api/colores/${deleteColorId}`;
      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': Cookies.get('token'),
        },
      });
  
      if (response.ok) {
        console.log(`Color con ID ${deleteColorId} borrado exitosamente.`);
        toast.success('Color eliminado exitosamente');
        showData();
      } else {
        if (response.status === 401) {
          toast.error(' No autorizado para eliminar el color');
        } else if (response.status === 403) {
          toast.error(' Permisos insuficientes para eliminar el color');
        } else if (response.status === 400) {
          toast.error(' Datos incorrectos o incompletos para eliminar el color');
        } else {
          toast.error('Error al borrar el color');
        }
      }
    } catch (error) {
      console.error('Error al realizar la solicitud DELETE:', error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleUpdateSubmit = async () => {
    try {
      const updateUrl = `https://apimafy.zeabur.app/api/colores/${selectedColor._id}`;
      const token = Cookies.get('token');
      const response = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify(selectedColor),
      });
  
      if (response.ok) {
        toast.success('Color actualizado exitosamente');
        showData();
      } else {
        if (response.status === 401) {
          toast.error(' No autorizado para actualizar el color');
        } else if (response.status === 403) {
          toast.error(' Permisos insuficientes para actualizar el color');
        } else if (response.status === 400) {
          toast.error(' Datos incorrectos o incompletos para actualizar el color');
        } else {
          toast.error('Por favor complete todos los campos');
        }
      }
    } catch (error) {
      console.error('Error en la solicitud de actualización:', error);
    }
    handleClose();
  };

  const handleCreate = async () => {
    try {
      const createUrl = 'https://apimafy.zeabur.app/api/colores';
      const response = await fetch(createUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': Cookies.get('token'),
        },
        body: JSON.stringify(newColor),
      });
  
      if (response.ok) {
        toast.success('Color creado exitosamente');
        showData();
        Cookies.set('colorCookie', 'colorValue', { expires: 1 });
      } else {
        if (response.status === 401) {
          toast.error(' No autorizado para crear el color');
        } else if (response.status === 403) {
          toast.error(' Permisos insuficientes para crear el color');
        } else if (response.status === 400) {
          toast.error(' Datos incorrectos o incompletos para crear el color');
        } else {
          toast.error('Por favor complete todos los campos');
        }
      }
    } catch (error) {
      console.error('Error en la solicitud de creación:', error);
    }
    handleClose();
  };
  useEffect(() => {
    showData();
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
      name: 'Color',
      selector: (row) => row.color,
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

  return (
    
    <Styles.AppContainer>
     <MyNavbar />
      <Styles.CreateButton variant="primary" onClick={handleShow}>
        Crear
      </Styles.CreateButton>

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
          <Modal.Title>Crear Color</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formColor">
              <Form.Label>Color</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el color"
                value={newColor.color}
                onChange={(e) => setNewColor({ ...newColor, color: e.target.value })}
              />
            </Form.Group>


            <Form.Group controlId="formEstado">
  <Form.Label>Estado</Form.Label>
  <Form.Control
    as="select"
    value={newColor.estado}
    onChange={(e) => setNewColor({ ...newColor, estado: e.target.value })}
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
                value={newColor.descripcion}
                onChange={(e) => setNewColor({ ...newColor, descripcion: e.target.value })}
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
          <Modal.Title>Actualizar Color</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formColor">
              <Form.Label>Color</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el color"
                value={selectedColor ? selectedColor.color : ''}
                onChange={(e) =>
                  setSelectedColor({
                    ...selectedColor,
                    color: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formEstado">
  <Form.Label>Estado</Form.Label>
  <Form.Control
    as="select"
    value={selectedColor ? selectedColor.estado.toString() : ''}
    onChange={(e) => setSelectedColor({ ...selectedColor, estado: e.target.value })}
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
                value={selectedColor ? selectedColor.descripcion : ''}
                onChange={(e) =>
                  setSelectedColor({
                    ...selectedColor,
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
          <Modal.Title style={{textAlign:'center'}} >Confirmar Eliminación</Modal.Title>
        </Modal.Header >
        <Modal.Body style={{backgroundColor:'#4a4a4a',color:'white'}}>
          ¿Estás seguro de que quieres eliminar este color?
        </Modal.Body>
        <Styles.ModalFooter style={{backgroundColor:'#4a4a4a',color:'white'}} > 
          <Button className="otros" variant="danger" onClick={handleDeleteConfirm}>
            SI
          </Button>
          <Button className="otros" variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
        </Styles.ModalFooter>
      </Modal>
      <Footer />
      <ToastContainer />
    </Styles.AppContainer>
  );
};

export default ColoresView;

