import React, { useEffect, useState } from 'react'; 
import axios from 'axios';
import DataTable from 'react-data-table-component';
import MyNavbar from '../component/Navbar'; 
import Footer from '../component/footer/footer'; 
import { FcInfo } from "react-icons/fc";
import { GiCancel } from "react-icons/gi";
import { Modal, Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';  // Importa ToastContainer y toast
import 'react-toastify/dist/ReactToastify.css';  // Importa los estilos de react-toastify

const HistorialServiciosView = () => {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [tipoCambio, setTipoCambio] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [newStatus, setNewStatus] = useState(false);

  useEffect(() => {
    Promise.all([
      axios.get('https://api-tammys.onrender.com/api/FacturaServicio'),
      axios.get('https://api-tammys.onrender.com/api/configuracion')
    ])
      .then(([facturasResponse, tipoCambioResponse]) => {
        setFacturas(facturasResponse.data);
        setTipoCambio(tipoCambioResponse.data.data[0].tipo_de_cambio_dolar);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error al obtener los datos:", error);
        setLoading(false);
      });
  }, []);

  const handleOpenModal = (id, currentStatus) => {
    setSelectedInvoiceId(id);
    setNewStatus(currentStatus);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = () => {
    axios.put(`https://api-tammys.onrender.com/api/FacturaServicio/factura/${selectedInvoiceId}`, { anulado: newStatus })
      .then(response => {
        setFacturas(prevFacturas =>
          prevFacturas.map(factura => 
            factura._id === selectedInvoiceId ? { ...factura, anulado: newStatus } : factura
          )
        );
        setIsModalOpen(false);
        toast.success('Estado de la factura actualizado con éxito');  // Toast de éxito
      })
      .catch(error => {
        console.error("Error al actualizar el estado de la factura:", error);
        toast.error('Error al actualizar el estado de la factura');  // Toast de error
      });
  };

  const filteredData = facturas.filter(
    factura =>
      factura.cliente.nombre.toLowerCase().includes(filterText.toLowerCase()) ||
      factura._id.includes(filterText)
  );

  const columns = [
    {
      name: 'ID',
      selector: row => row._id,
      sortable: true,
      center: true,
      width: '215px'
    },
    {
      name: 'Cliente',
      selector: row => <span style={{ color: 'black' }}>{row.cliente.nombre}</span>,
      sortable: true,
    },
    {
      name: 'Fecha',
      selector: row => <span style={{ color: 'black' }}>{new Date(row.fecha).toLocaleDateString()}</span>,
      sortable: true,
    },
    {
      name: 'Total Factura (C$)',
      selector: row => <span style={{ color: 'green' }}>{`C$${row.totalFactura}`}</span>,
      sortable: true,
    },
    {
      name: 'Total Factura (US$)', 
      selector: row => {
        if (tipoCambio) {
          const totalDolares = (row.totalFactura / tipoCambio).toFixed(2);
          return <span style={{ color: 'green' }}>{`$${totalDolares}`}</span>;
        } else {
          return <span style={{ color: 'gray' }}>Cargando...</span>; 
        }
      },
      sortable: true,
    },
    {
      name: 'Anulado',
      selector: row => <span style={{ color: 'black' }}>{row.anulado ? 'Sí' : 'No'}</span>,
      sortable: true,
    },
    {
      name: 'Opciones',
      cell: row => (
        <div style={{ display: 'flex', gap: '5px' }}>
          <button
            onClick={() => handleOpenModal(row._id, row.anulado)}
            style={{
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              width: '40px',
              height: '40px',
              backgroundColor: 'red',
              color: 'white',
              borderRadius: '10px',
              margin: '0 auto'
            }}
          >
            <GiCancel />
          </button>
          <button
            style={{
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              width: '40px',
              height: '40px',
              backgroundColor: 'blue',
              color: 'white',
              borderRadius: '10px',
              margin: '0 auto'
            }}
          >
            <FcInfo />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    }
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
    <div>
      <MyNavbar />
      <h2>
      <img 
        src="https://fontmeme.com/permalink/241104/a86dd920b0e34c4a4f27664148782a4f.png" 
        alt="Comic Font"
        style={{ width: '85%', height: 'auto', maxWidth: '900px' }}
      />
      </h2>
      <div style={{ width: '95%', margin: '0 auto' }}>
        <DataTable
          style={{ border: '2px solid black' }}
          columns={columns}
          customStyles={customStyles}
          data={filteredData}
          responsive
          pagination
          subHeader
          subHeaderComponent={
            <input
              type="text"
              placeholder="Buscar ..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              style={{ width: '250px', margin: '0 auto', borderRadius: '5px', marginTop: '10px', marginBottom: '10px' }}
            />
          }
          persistTableHead
        />
      </div>
      <Footer />

      {/* Modal de Bootstrap */}
      <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Estado de la Factura</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{margin:'0 auto'}} >
          <label style={{margin:'0 auto'}}>
            Estado
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value === 'true')}
              style={{ width: '100%', padding: '8px', marginTop: '8px' }}
            >
              <option value="false">No Anulado</option>
              <option value="true">Anulado</option>
            </select>
          </label>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" style={{width:'100px',height:'50px'}} onClick={() => setIsModalOpen(false)}>Cancelar</Button>
          <Button variant="primary" style={{width:'100px',height:'50px'}}  onClick={handleStatusUpdate}>Guardar</Button>
        </Modal.Footer>
      </Modal>

      {/* Contenedor de Toast */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default HistorialServiciosView;
