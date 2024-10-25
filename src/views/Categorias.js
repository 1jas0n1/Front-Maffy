import React, { useState, useEffect, useMemo } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import * as Styles from '../css/styles_colores';
import Footer from '../component/footer/footer';
import { FaTrash,FaEdit } from 'react-icons/fa';
import Navbar from '../component/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import ButtonM from '../component/BtnAgregar.js';

const CategoriasView = () => {
  const [cookieData, setCookieData] = useState({
    miCookie: Cookies.get('miCookie') || null, 
  });
  const [categorias, setCategorias] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const [newCategoria, setNewCategoria] = useState({
    categoria: '',
    estado: '',
    descripcion: '',
  });
  const [selectedCategoria, setSelectedCategoria] = useState(null);


  const handleClose = () => {
    setShowCreateModal(false);
    setShowUpdateModal(false);
    setNewCategoria({
      categoria: '',
      estado: '',
      descripcion: '',
    });
    setSelectedCategoria(null);
  };

  const handleShow = () => setShowCreateModal(true);
  const handleUpdate = (categoriaId) => {
    const selected = categorias.find((categoria) => categoria._id === categoriaId);
    setSelectedCategoria(selected);
    setShowUpdateModal(true);
  };

  const url = 'https://apimafy.zeabur.app/api/categorias';

  const showData = async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDelete = (categoriaId) => {
    setCategoryToDelete(categoriaId);
    setShowConfirmationModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const deleteUrl = `https://apimafy.zeabur.app/api/categorias/${categoryToDelete}`;
      const token = Cookies.get('token'); 
  
      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
      });
      console.log('Data sent in handleConfirmDelete:', JSON.stringify({ categoriaId: categoryToDelete }));
  
      if (response.ok) {
        console.log(`Categoría con ID ${categoryToDelete} eliminada exitosamente.`);
        toast.success('Categoría eliminada exitosamente');
        showData();
      } else if (response.status === 401) {
        toast.error('Error 401 - No autorizado. Por favor, inicie sesión nuevamente.');
      } else if (response.status === 403) {
        toast.error('Error 403 - Acceso prohibido.');
      } else {
        toast.error(`Error en la solicitud: ${response.statusText}`);
      }
    } catch (error) {
      toast.error('Error en la solicitud de eliminación. Por favor, inténtelo de nuevo.');
    } finally {
      setShowConfirmationModal(false);
    }
  };
  

  const handleClear = () => {
    if (filterText) {
      setResetPaginationToggle(!resetPaginationToggle);
      setFilterText('');
    }
  };

  const filteredItems = categorias.filter(
    (item) =>
      item.categoria && item.categoria.toLowerCase().includes(filterText.toLowerCase())
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
  }, [filterText, resetPaginationToggle]);

 
  const handleCreate = async () => {
    try {
      const createUrl = 'https://apimafy.zeabur.app/api/categorias';
      const token = Cookies.get('token');
      const response = await fetch(createUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify(newCategoria),
      });
  
      if (response.ok) {

        toast.success('Categoría creada exitosamente');
        showData();
      } else if (response.status === 400) {
        toast.error('No se puede crear la categoría porque ya existe.');
      } else if (response.status === 401) {
        toast.error('No autorizado. Por favor, inicie sesión nuevamente.');
      } else if (response.status === 403) {
        toast.error('Acceso prohibido.');
      } else {
        toast.error(`Error en la solicitud: ${response.statusText}`);
      }
    } catch (error) {
      toast.error('Error en la solicitud de creación. Por favor, inténtelo de nuevo.');
    } finally {
      handleClose();
    }
  };

  useEffect(() => {
   showData();
  }, []);
  

  const handleUpdateSubmit = async () => {
    try {
      const updateUrl = `https://apimafy.zeabur.app/api/categorias/${selectedCategoria._id}`;
      const token = Cookies.get('token');
      const response = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify(selectedCategoria),
      });
  
      if (response.ok) {
        toast.success('Categoría actualizada exitosamente');
        showData();
      } else if (response.status === 400) {
        toast.error(' Por favor complete todos los campos.');
      } else if (response.status === 401) {
        toast.error('No autorizado. Por favor, inicie sesión nuevamente.');
      } else if (response.status === 403) {
        toast.error(' Acceso prohibido.');
      } else {
        toast.error(`Error en la solicitud: ${response.statusText}`);
      }
    } catch (error) {
    } finally {
      handleClose();
    }
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
      name: 'Categoría',
      selector: (row) => row.categoria,
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
        <Navbar />
      <ButtonM variant="primary" onClick={handleShow}>
        Crear
      </ButtonM>

      <Styles.StyledDataTable
        customStyles={customStyles}
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
          <Modal.Title>Crear Categoría</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formCategoria">
              <Form.Label>Categoría</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la categoría"
                value={newCategoria.categoria}
                onChange={(e) =>
                  setNewCategoria({ ...newCategoria, categoria: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formEstado">
  <Form.Label>Estado</Form.Label>
  <Form.Control
    as="select"
    value={newCategoria.estado}
    onChange={(e) => setNewCategoria({ ...newCategoria, estado: e.target.value })}
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
                value={newCategoria.descripcion}
                onChange={(e) =>
                  setNewCategoria({ ...newCategoria, descripcion: e.target.value })
                }
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
          <Modal.Title>Actualizar Categoría</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formCategoria">
              <Form.Label>Categoría</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la categoría"
                value={selectedCategoria ? selectedCategoria.categoria : ''}
                onChange={(e) =>
                  setSelectedCategoria({
                    ...selectedCategoria,
                    categoria: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formEstado">
  <Form.Label>Estado</Form.Label>
  <Form.Control
    as="select"
    value={selectedCategoria ? selectedCategoria.estado.toString() : ''}
    onChange={(e) => setSelectedCategoria({ ...selectedCategoria, estado: e.target.value })}
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
                value={selectedCategoria ? selectedCategoria.descripcion : ''}
                onChange={(e) =>
                  setSelectedCategoria({
                    ...selectedCategoria,
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

      <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
        <Modal.Header style={{backgroundColor:'#4a4a4a',color:'white'}} closeButton>
          <Modal.Title style={{backgroundColor:'#4a4a4a',color:'white'}}>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{backgroundColor:'#4a4a4a',color:'white'}}>¿Está seguro de que desea eliminar esta categoría?</Modal.Body>
        <Modal.Footer style={{backgroundColor:'#4a4a4a',color:'white'}}>
          
          <Button style={{ width: '100px', height: '50px' }} variant="danger" onClick={handleConfirmDelete}>
            Confirmar
          </Button>
          <Button style={{ width: '100px', height: '50px' }} variant="secondary" onClick={() => setShowConfirmationModal(false)}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
      <ToastContainer />
    </Styles.AppContainer>
  );
};

export default CategoriasView;
