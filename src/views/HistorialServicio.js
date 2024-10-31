import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import MyNavbar from '../component/Navbar'; 
import Footer from '../component/footer/footer'; 
import { FcInfo } from "react-icons/fc";
import { GiCancel } from "react-icons/gi";
const HistorialServiciosView = () => {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [tipoCambio, setTipoCambio] = useState(null); 

  useEffect(() => {
    axios.get('https://apitammy-closset.fra1.zeabur.app/api/FacturaServicio')
      .then(response => {
        setFacturas(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error al obtener los datos:", error);
        setLoading(false);
      });

    axios.get('https://apitammy-closset.fra1.zeabur.app/api/configuracion')
      .then(response => {
        console.log("Tipo de cambio obtenido:", response.data.data[0].tipo_de_cambio_dolar); 
        setTipoCambio(response.data.data[0].tipo_de_cambio_dolar); 
      })
      .catch(error => {
        console.error("Error al obtener el tipo de cambio:", error);
      });
  }, []);

  const columns = [
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
            style={{
              textAlign:'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              width: '40px',
              height: '40px',
              backgroundColor: 'red',
              color: 'white',
              borderRadius: '10px',
              margin:'0 auto'
            }}
            disabled={row.anulado}
          >
            <GiCancel  />
          </button>
          <button
            style={{
              textAlign:'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              width: '40px',
              height: '40px',
              backgroundColor: 'blue',
              color: 'white',
              borderRadius: '10px',
              margin:'0 auto'
            }}>
            <FcInfo  />
  
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    }
  ];
  const conditionalRowStyles = [
    {
      when: row => row.anulado,
      style: {
        backgroundColor: 'red',
        color: 'white',  
      },
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
    <div>
      <MyNavbar />
      <h2 style={{ color: 'black', marginTop: '10px', marginBottom: '10px' }}>Historial de Servicios</h2>
      <div style={{ width: '95%', margin: '0 auto' }}>
        <DataTable
          style={{ border: '2px solid black' }}
          columns={columns}
          customStyles={customStyles}
          conditionalRowStyles={conditionalRowStyles}
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
              style={{ width: '250px', margin: '0 auto', borderRadius: '5px', marginTop: '10px', marginBottom: '10px' }}
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
