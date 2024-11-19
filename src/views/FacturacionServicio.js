import React, { useState, useEffect } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { FaPlus, FaTrash } from 'react-icons/fa'; 
import ButtonM from '../component/BtnAgregar';
import Footer from '../component/footer/footer';
import Navbar from '../component/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import ButtonVender from '../component/BtnVender';
import Total from '../component/Total'

const FacturacionServicioView = () => {
  const [fecha, setFecha] = useState('');
  const [cliente, setCliente] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [servicios, setServicios] = useState([]); 
  const [carro, setCarro] = useState([]); 


  const calcularIVA = () => {
    const total = calcularTotal();
    return total * 0.15; 
  };

  const obtenerDatosJSON = () => {
    const total = calcularTotal();
    const iva = calcularIVA(total);
    const totalFactura = (total + iva).toFixed(2);

    return {
      fecha: fecha,
      cliente: { nombre: cliente }, 
      anulado:false,
      servicios: carro.map(servicio => ({
        servicio:servicio._id,
        precio: servicio.precio,
        cantidad: servicio.cantidad,
        total: (servicio.precio * servicio.cantidad).toFixed(2),
      })),
      iva: iva.toFixed(2),
      subtotal: total-iva,
      totalFactura: total.toFixed(2),
    };
  };

  const realizarVenta = async () => {
    const factura = obtenerDatosJSON();
    try {
      const response = await fetch('https://api-tammys.onrender.com/api/facturaServicio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(factura),
      });
  
      if (response.ok) {
        toast.success('Venta realizada con éxito');
        setFecha('');         
        setCliente('');       
        setCarro([]); 
      } else {
        const errorData = await response.json(); 
        toast.error(`Error al realizar la venta: ${errorData.message || 'Error desconocido'}`);
      }
    } catch (error) {
      toast.error('Error al realizar la venta');
    }
  };  

  useEffect(() => {
    console.log(obtenerDatosJSON());
  }, [carro, fecha, cliente]);

  const columns = [
    {
      name: 'Nombre',
      selector: row => row.nombre,
      sortable: true,
      cell: (row) => (
        <span style={{ color: 'navy', fontWeight: 'bold' }}>{row.nombre}</span>
      ),
    },
    {
      name: 'Descripción',
      selector: row => row.descripcion,
      cell: (row) => (
        <span style={{ color: 'navy' }}>{row.descripcion}</span>
      ),
    },
    {
      name: 'Precio',
      selector: row => `C$${row.precio}`,
      sortable: true,
      cell: (row) => (
        <span style={{ color: 'navy' }}>{`C$${row.precio}`}</span> 
      ),
    },
    {
      name: 'Activo',
      selector: row => row.activo ? 'Sí' : 'No',
      cell: (row) => (
        <span
          style={{
            color: row.activo ? 'green' : 'red',
            fontWeight: 'bold',
          }}
        >
          {row.activo ? 'Activo' : 'Inactivo'}
        </span>
      ),
      sortable: true,
    },
    {
      name: 'Acciones',
      cell: (row) => (
        <Button variant="success" style={{ width: '60px', height: '40px' }} onClick={() => añadirAlCarro(row)}>
          <FaPlus />
        </Button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const columnsCarro = [
    {
      name: 'Nombre',
      selector: row => row.nombre,
      sortable: true,
      cell: (row) => (
        <span style={{ color: 'navy', fontWeight: 'bold' }}>{row.nombre}</span>
      ),
    },
    {
      name: 'Descripción',
      selector: row => row.descripcion,
      cell: (row) => (
        <span style={{ color: 'navy' }}>{row.descripcion}</span>
      ),
    },
    {
      name: 'Precio',
      selector: row => `C$${row.precio}`,
      sortable: true,
      cell: (row) => (
        <span style={{ color: 'navy' }}>{`C$${row.precio}`}</span> 
      ),
    },
    {
      name: 'Cantidad',
      selector: row => row.cantidad,
      cell: (row, index) => (
        <input
          type="number"
          value={row.cantidad}
          min="1"
          onChange={(e) => actualizarCantidad(e.target.value, index)}
          style={{ margin: '0', width: '80px', borderRadius: '5px' }}
        />
      ),
    },
    {
      name: 'Subtotal',
      selector: row => `C$${(row.precio * row.cantidad).toFixed(2)}`,
      cell: (row) => (
        <span style={{ color: 'navy' }}>{`C$${(row.precio * row.cantidad).toFixed(2)}`}</span> // Cambiado a C$
      ),
    },
    {
      name: 'Eliminar',
      cell: (row) => (
        <Button variant="danger" style={{ width: '60px', height: '40px' }} onClick={() => eliminarDelCarro(row._id)}>
          <FaTrash />
        </Button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const fetchServicios = async () => {
    try {
      const response = await fetch('https://api-tammys.onrender.com/api/Servicios');
      const data = await response.json();
      setServicios(data);
    } catch (error) {
      console.error('Error al obtener los servicios:', error);
    }
  };

  const añadirAlCarro = (servicio) => {
    const servicioExistente = carro.some(item => item._id === servicio._id);
    if (servicioExistente) {
      toast.error(`El servicio ${servicio.nombre} ya está en el carro`);
    } else {
      const nuevoServicio = { ...servicio, cantidad: 1 }; 
      setCarro((prevCarro) => [...prevCarro, nuevoServicio]);
      toast.success(`Añadido al carro: ${servicio.nombre}`);
    }
  };

  const eliminarDelCarro = (id) => {
    const nuevoCarro = carro.filter(item => item._id !== id);
    setCarro(nuevoCarro);
    toast.success(`Servicio eliminado del carro`);
  };

  const actualizarCantidad = (cantidad, index) => {
    const nuevoCarro = [...carro];
    nuevoCarro[index].cantidad = parseInt(cantidad);
    setCarro(nuevoCarro);
  };

  const handleFechaChange = (e) => {
    setFecha(e.target.value);
  };

  const handleClienteChange = (e) => {
    setCliente(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success(`Cliente: ${cliente}, Fecha: ${fecha}`);
  };


  const handleModalOpen = () => {
    fetchServicios();
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const calcularTotal = () => {
    return carro.reduce((total, servicio) => {
      const subtotal = servicio.precio * servicio.cantidad;
      return total + subtotal;
    }, 0);
  };
  const total = calcularTotal();
  const customStyles = {
    headCells: {
      style: {
        backgroundColor: '#4A2148',
        color: '#fff',
        fontWeight: 'bold',
      },
    },
  };
  useEffect(() => {
    if (showModal) {
      fetchServicios();
    }
  }, [showModal]);
  

  return (
    <div>
      <Navbar />
      <Form onSubmit={handleSubmit} className="mt-4">
        <div className="d-flex justify-content-center">
          <Form.Group style={{ textAlign: 'center' }} controlId="formFecha" className="w-50 me-2">
            <Form.Label>Fecha</Form.Label>
            <Form.Control
              style={{ textAlign: 'center' }}
              className="w-50 mx-auto"
              type="date"
              value={fecha}
              onChange={handleFechaChange}
              required
            />
          </Form.Group>
          <Form.Group style={{ textAlign: 'center' }} controlId="formCliente" className="w-50 ms-2">
            <Form.Label>Nombre del Cliente</Form.Label>
            <Form.Control
              style={{ textAlign: 'center' }}
              className="w-50 mx-auto"
              type="text"
              placeholder="Ingrese el nombre del cliente"
              value={cliente}
              onChange={handleClienteChange}
              required
            />
          </Form.Group>
        </div>

        <div className="d-flex justify-content-center mt-4">
          <ButtonM onClick={handleModalOpen}>
            Ver servicios
          </ButtonM>
        </div>
      </Form>

      <div className="mt-4" style={{ width: '90%', margin: '0 auto', borderRadius: '5px' }}>
        <DataTable
          columns={columnsCarro}
          customStyles={customStyles}
          data={carro}
          pagination
          highlightOnHover
          striped
          noDataComponent=" "
        />
      </div>

      <div className="d-flex justify-content-center mt-4">
        <ButtonVender onClick={realizarVenta}>

        </ButtonVender>
      </div>

      <div className="d-flex mt-4  justify-content-center"  >
      <Total total={total} />
    </div>
      <Footer />
      <ToastContainer />

      <Modal show={showModal} onHide={handleModalClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title style={{textAlign:'center'}} >Servicios</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DataTable
            columns={columns}
            data={servicios}
            pagination
            highlightOnHover
            striped
            noDataComponent=" "
            customStyles={customStyles}
          />
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default FacturacionServicioView;