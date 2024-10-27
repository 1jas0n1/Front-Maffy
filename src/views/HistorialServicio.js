import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import MyNavbar from '../component/Navbar';
import Footer from '../component/footer/footer';

const HistorialServiciosView = () => {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [data, setData] = useState([]);

  useEffect(() => {
    // Realiza la petición GET al cargar el componente
    axios.get('https://apimafy.zeabur.app/api/FacturaServicio')
      .then(response => {
        setFacturas(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error al obtener los datos:", error);
        setLoading(false);
      });
  }, []);

  const filteredData = data.filter(
    item =>
      item._id.toLowerCase().includes(filterText.toLowerCase()) 
  );
  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  const columns = [
    {
      name: 'Cliente',
      selector: row => row.cliente.nombre,
      sortable: true,
    },
    {
      name: 'Fecha',
      selector: row => new Date(row.fecha).toLocaleDateString(),
      sortable: true,
    },
    {
      name: 'Subtotal',
      selector: row => `$${row.subtotal}`,
      sortable: true,
    },
    {
      name: 'IVA',
      selector: row => `$${row.iva}`,
      sortable: true,
    },
    {
      name: 'Total Factura',
      selector: row => `$${row.totalFactura}`,
      sortable: true,
    },
    {
      name: 'Anulado',
      sortable: true,
    },
    {
      name: 'Opciones',
      sortable: true,
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
      <h2 style={{ color: 'black',marginTop:'10px',marginBottom:'10px' }}>Historial de Servicios</h2>
      <div style={{width:'95%',margin:'0 auto'}}>
      <DataTable
          style={{border:'2px solid black'}}     
          columns={columns}
          customStyles={customStyles}
          data={facturas}
          responsive
          pagination
          subHeader
          subHeaderComponent={
            <input 
              type="text"
              placeholder="Buscar ..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              style={{ width: '250px', margin:'0 auto',borderRadius:'5px',marginTop:'10px',marginBottom:'10px' }}
            />
          }

       
          persistTableHead
        />
      </div>
      <Footer />
    </div>
  );
};

export default HistorialServiciosView;
