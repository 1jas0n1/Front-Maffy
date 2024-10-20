import React, { useState, useEffect, useMemo } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import * as Styles from '../css/styles_colores';
import Footer from '../component/footer/footer';
import { FaTrash,FaEdit } from 'react-icons/fa';
import Navbar from '../component/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';


const BodegasView = () => {
  const [cookieData, setCookieData] = useState({
    miCookie: Cookies.get('miCookie') || null, 
  });
  const [bodegas, setBodegas] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [updateModalShow, setUpdateModalShow] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deletingBodegaId, setDeletingBodegaId] = useState(null);

  const [updatingBodega, setUpdatingBodega] = useState(null);


  const handleClose = () => setShowCreateModal(false);
  const handleShow = () => setShowCreateModal(true);
  const handleUpdateShow = (bodegaId) => {
    const bodegaToUpdate = bodegas.find((bodega) => bodega._id === bodegaId);
    setUpdatingBodega(bodegaToUpdate);
    setUpdateModalShow(true);
  };
  const handleUpdateClose = () => {
    setUpdateModalShow(false);
    setUpdatingBodega(null);
  };

  const url = "https://apimafy.zeabur.app/api/bodegas";

  const showData = async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setBodegas(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleUpdate = (bodegaId) => {
    handleUpdateShow(bodegaId);
  };

  const handleDelete = (bodegaId) => {
    setDeletingBodegaId(bodegaId);
    setShowDeleteConfirmation(true);
  };
  

  const handleDeleteConfirm = async () => {
    if (deletingBodegaId) {
      try {
        const token = Cookies.get('token');
        const response = await fetch(`https://apimafy.zeabur.app/api/bodegas/${deletingBodegaId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token, 
          },
        });
  
        if (response.ok) {
          setBodegas((prevBodegas) => prevBodegas.filter((bodega) => bodega._id !== deletingBodegaId));
        toast.success('Bodega Eliminado correctamente');
        }else if (response.status === 401) {
          toast.error('Permisos insuficientes para borrar el artículo');
        }
        else if (response.status === 403) {
          toast.error('Permisos insuficientes para borrar el artículo');
        }  
        else {
          toast.error(`Error borrando la bodega con ID ${deletingBodegaId}`);
        }
        
      } catch (error) {
        toast.error('Error en la solicitud DELETE:', error);
      }
  
      setShowDeleteConfirmation(false);
      setDeletingBodegaId(null);
    }
  };
  

  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false);
    setDeletingBodegaId(null);
  };

  const handleClear = () => {
    if (filterText) {
      setResetPaginationToggle(!resetPaginationToggle);
      setFilterText('');
    }
  };

  const filteredItems = bodegas.filter(
    (item) => item.bodega && item.bodega.toLowerCase().includes(filterText.toLowerCase())
  );

  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div style={{ display: 'flex', margin: '0 auto', marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Buscar por bodega"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>
    );
  }, [filterText, resetPaginationToggle]);

  const handleCreate = async () => {
    const bodega = document.getElementById('formBodega').value;
    const estado = document.getElementById('formEstado').value;
    const descripcion = document.getElementById('formDescripcion').value;
    const nuevaBodega = {
      bodega,
      estado,
      descripcion,
    };
  
    try {
      const token = Cookies.get('token');
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify(nuevaBodega),
      });
  
      if (response.ok) {
        const nuevaBodegaCreada = await response.json();
        setBodegas((prevBodegas) => [...prevBodegas, nuevaBodegaCreada]);
        toast.success('Bodega creada exitosamente');

      } else if (response.status === 401) {
        toast.error('Error de autenticación al intentar actualizar la bodega');
      } else if (response.status === 403) {
        toast.error('Permisos insuficientes para borrar la bodega');
      } else if (response.status === 400) {
        toast.error('No se puede crear la bodega porque ya existe.');
      } else {
        toast.error('Se produjo un error en la solicitud de creación de la bodega.');
      }
    } catch (error) {
      toast.error('Se produjo un error en la solicitud de creación de la bodega.');
    }
  
    handleClose();
  };
  
  const handleUpdateSubmit = async () => {
    const updatedBodega = {
      bodega: document.getElementById('updateFormBodega').value,
      estado: document.getElementById('updateFormEstado').value,
      descripcion: document.getElementById('updateFormDescripcion').value,
    };
  
    try {
      const token = Cookies.get('token');
      const response = await fetch(`https://apimafy.zeabur.app/api/bodegas/${updatingBodega._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify(updatedBodega),
      });
  
      if (response.ok) {
        const updatedBodegaData = await response.json();
        setBodegas((prevBodegas) =>
          prevBodegas.map((bodega) =>
            bodega._id === updatingBodega._id ? updatedBodegaData : bodega
          )
        );
        toast.success('Bodega editada exitosamente');
      } else if (response.status === 401) {
        toast.error('Error de autenticación al intentar actualizar la bodega');
      } else if (response.status === 403) {
        toast.error('Permisos insuficientes para actualizar la bodega');
      } else {
        toast.error(`Error actualizando la bodega con ID ${updatingBodega._id}`);
      }
    } catch (error) {
      toast.error('Error en la solicitud PUT:', error);
    }
  
    handleUpdateClose();
  };
  

  useEffect(() => {
    showData();
  }, []);

  const columns = [
    {
      name: 'Bodega',
      selector: (row) => row.bodega,
      sortable: true,
      
    },
    {
      name: 'Estado',
      selector: (row) => (row.estado ? 'Activo' : 'Inactivo'),
      sortable: true,
      
    },
    {
      name: 'Descripción',
      selector: (row) => row.descripcion,
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
          <Modal.Title>Crear Bodega</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBodega">
              <Form.Label>Bodega</Form.Label>
              <Form.Control type="text" placeholder="Ingrese la bodega" />
            </Form.Group>


            <Form.Group controlId="formEstado">
  <Form.Label>Estado</Form.Label>
  <Form.Control
    as="select"
    placeholder="Seleccione el estado"
  >
    <option value="true">Activo</option>
    <option value="false">Inactivo</option>
  </Form.Control>
</Form.Group>

            <Form.Group controlId="formDescripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control type="text" placeholder="Ingrese la descripción" />
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

      
      <Styles.StyledModal show={updateModalShow} onHide={handleUpdateClose}>
        <Modal.Header closeButton>
          <Modal.Title>Actualizar Bodega</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="updateFormBodega">
              <Form.Label>Bodega</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la bodega"
                defaultValue={updatingBodega?.bodega}
              />
            </Form.Group>
           
            <Form.Group controlId="updateFormEstado">
  <Form.Label>Estado</Form.Label>
  <Form.Control
    as="select"
    defaultValue={updatingBodega?.estado ? 'true' : 'false'}
  >
    <option value="true">Activo</option>
    <option value="false">Inactivo</option>
  </Form.Control>
</Form.Group>


            <Form.Group controlId="updateFormDescripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la descripción"
                defaultValue={updatingBodega?.descripcion}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Styles.ModalFooter>
        <Button className="otros" variant="primary" onClick={handleUpdateSubmit}>
            Actualizar
          </Button>
          <Button className="otros" variant="secondary" onClick={handleUpdateClose}>
            Cerrar
          </Button>
          
        </Styles.ModalFooter>
    
      </Styles.StyledModal>


      <Styles.StyledModal show={showDeleteConfirmation} onHide={handleDeleteCancel}>
  <Modal.Header closeButton>
    <Modal.Title>Confirmar Eliminación</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <p>¿Estás seguro de que deseas eliminar esta bodega?</p>
  </Modal.Body>
  <Styles.ModalFooter>
    <Button className="otros" variant="danger" onClick={handleDeleteConfirm}>
      Sí, eliminar
    </Button>
    <Button className="otros" variant="secondary" onClick={handleDeleteCancel}>
      Cancelar
    </Button>
  </Styles.ModalFooter>
</Styles.StyledModal>

      <Footer />
      <ToastContainer />
    </Styles.AppContainer>
     
  );
};

export default BodegasView;
