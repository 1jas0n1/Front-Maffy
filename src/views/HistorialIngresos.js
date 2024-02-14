import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import MyNavbar from '../component/Navbar';
import Footer from '../component/footer/footer';
import { FaEye } from "react-icons/fa";
import { MdPrint } from "react-icons/md";
import { Container, Form, Button, Row, Col, Modal, Alert } from 'react-bootstrap'; // Asegúrate de importar la librería de modales que estás utilizando
import axios from 'axios';
import { TbRuler3 } from 'react-icons/tb';
const HistorialIngresosView = () => {
  const [data, setData] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [articulos, setArticulos] = useState([]);
  const [colores, setColores] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [est, setEst] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [disenos, setDisenos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  
  const [users, setUsers] = useState([]);
  const [filterText, setFilterText] = useState('');

  const updateFechaIngresoField = async (id_ingreso) => {
    try {
      // Fetch the data for the specified id_ingreso from the ingresos endpoint
      const response = await axios.get(`http://localhost:4000/api/ingresos/${id_ingreso}`);
  
      // Convert the fecha field to a JavaScript Date object
      const fechaDate = new Date(response.data.fecha);
  
      // Format the date to display only day, month, and year
      const formattedFecha = fechaDate.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      });
  
      // Update the fecha field in the state based on the formatted date
      setData((prevData) =>
        prevData.map((row) =>
          row.id_ingreso === id_ingreso ? { ...row, fecha: formattedFecha } : row
        )
      );
    } catch (error) {
      console.error('Error updating fecha field for ingreso:', error);
    }
  };
  

  useEffect(() => {
    const fetchMarcas = async () => {
        const response = await axios.get('http://localhost:4000/api/marcas');
        setMarcas(response.data);
    };
    fetchMarcas();
  }, []);


  useEffect(() => {
    const fetchMateriales = async () => {
        const response = await axios.get('http://localhost:4000/api/materiales');
        setMateriales(response.data);
    };
    fetchMateriales();
  }, []);

  useEffect(() => {
    const fetchEstilos = async () => {
        const response = await axios.get('http://localhost:4000/api/estilos');
        setEst(response.data);
    };
    fetchEstilos();
  }, []);

  useEffect(() => {
    const fetchDisenos = async () => {
        const response = await axios.get('http://localhost:4000/api/disenos');
        setDisenos(response.data);
    };
    fetchDisenos();
  }, []);

  useEffect(() => {
    const fetchArticulos = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/articulos');
        setArticulos(response.data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };
    fetchArticulos();
  }, []);

  useEffect(() => {
    const fetchCategorias = async () => {
        const response = await axios.get('http://localhost:4000/api/categorias');
        setCategorias(response.data);
    };
    fetchCategorias();
  }, []); 

  useEffect(() => {

    const fetchProveedores = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/proveedores');
        setProveedores(response.data);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    };
    fetchProveedores();
  }, []);


  useEffect(() => {
    const fetchColores = async () => {
        const response = await axios.get('http://localhost:4000/api/colores');
        setColores(response.data);
    };
    fetchColores();
  }, []);

  useEffect(() => {
    const fetchTallas = async () => {
        const response = await axios.get('http://localhost:4000/api/tallas');
        setTallas(response.data);
    };
    fetchTallas();
  }, []);

  // Inside the existing useEffect for fetching data
useEffect(() => {
  fetch('http://localhost:4000/api/detalleingreso')
    .then(response => response.json())
    .then(async data => {
      const formattedData = await Promise.all(data.map(async item => {
        const incomeResponse = await axios.get(`http://localhost:4000/api/ingresos/${item.id_ingreso}`);
        const incomeData = incomeResponse.data;

        // Call the updateFechaIngresoField function with the id_ingreso
        updateFechaIngresoField(item.id_ingreso);

        return {
          _id: item._id,
          id_ingreso: item.id_ingreso,
          id_usuario: incomeData.id_usuario,
          id_proveedor: incomeData.id_proveedor,
          total: item.total,
          articulos: item.articulos,
          fecha: '', // Add an empty fecha field for now, it will be updated later
        };
      }));
      setData(formattedData);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}, []);


  const handlePrint = (row) => {
    const id = row._id;
  
    // Open a new tab with the printing URL
    const printUrl = `http://localhost:4000/api/detalleingreso/${id}/print`;
    const newTab = window.open(printUrl, '_blank');
  
    // Handle cases where opening the new tab fails
    if (!newTab) {
      console.error('Error opening new tab for printing.');
    }
  };
  
  const handleViewDetails = (row) => {
    setSelectedRecord(row);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const getMarcaNombreById = (id) => {
    const marca = marcas.find((marca) => marca._id === id);
    return marca ? marca.marca : '';
  };
  
  const getMaterialNameById = (materialId) => {
    const material = materiales.find((m) => m._id === materialId);
    return material ? material.material : 'Nombre no encontrado';
  };

const obtenerNombreDisenoPorId = (idDiseno) => {
  const disenoSeleccionado = disenos.find(diseno => diseno._id === idDiseno);
  return disenoSeleccionado ? disenoSeleccionado.diseno : 'Diseño no encontrado';
};
const mapEstiloIdToNombre = (id) => {
  const estilo = est.find((e) => e._id === id);
  return estilo ? estilo.estilo : '';
};

const getNombreCategoriaById = (categoriaId) => {
  const categoria = categorias.find((c) => c._id === categoriaId);
  return categoria ? categoria.categoria : '';
};

const getNombreArticulo = (idArticulo) => {
  const articulo = articulos.find((a) => a._id === idArticulo);
  return articulo ? articulo.nombre : '';
};

const getNombreTalla = (idTalla) => {
  const tallaEncontrada = tallas.find((talla) => talla._id === idTalla);
  return tallaEncontrada ? tallaEncontrada.talla : 'Desconocida';
};

const getColorNameById = (colorId) => {
  const color = colores.find((c) => c._id === colorId);
  return color ? color.color : 'Desconocido';
};

const getProveedorById = (provId) => {
  const proveedor = proveedores.find((p) => p._id === provId);
  return proveedor ? proveedor.nombre : 'Desconocido';
};



const filteredData = data.filter(
  item =>
    item._id.toLowerCase().includes(filterText.toLowerCase()) ||
    item.id_ingreso.toLowerCase().includes(filterText.toLowerCase()) ||
    getProveedorById(item.id_proveedor).toLowerCase().includes(filterText.toLowerCase()) ||
    item.total.toString().toLowerCase().includes(filterText.toLowerCase()) ||
    item.fecha.toLowerCase().includes(filterText.toLowerCase())
);
const handleFilterChange = (e) => {
  setFilterText(e.target.value);
};





// Fetch user data
useEffect(() => {
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/user/all');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  fetchUsers();
}, []);

// Function to get username by user ID
const getUserNameById = (userId) => {
  const user = users.find((u) => u._id === userId);
  return user ? user.username : 'Desconocido';
};

  const columns = [
    { name: 'Id', selector: '_id', sortable: true,center:true },
    { name: 'Id Ingreso', selector: 'id_ingreso', sortable: true },
     { name: 'Usuario', selector: 'id_usuario', sortable: true, cell: row => getUserNameById(row.id_usuario) },
    { name: 'Proveedor', selector: 'id_proveedor', sortable: true ,cell :row =>getProveedorById(row.id_proveedor) },
    {
      name: 'Total C$',
      selector: 'total',
      sortable: true,
      cell: row => parseFloat(row.total).toFixed(2),
    },
    { name: 'Fecha', selector: 'fecha', sortable: true },
    {
      name: 'Acciones',
      cell: row => (
        <div>
          <button style={{ width: '35px', height: '35px', backgroundColor: 'blue', marginRight: '2px', borderRadius: '5px', color: 'white' }} onClick={() => handleViewDetails(row)} ><FaEye /></button>
          <button style={{ width: '35px', height: '35px', backgroundColor: 'blue', borderRadius: '5px', color: 'white' }} onClick={() => handlePrint(row)} ><MdPrint /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <MyNavbar />
    
      <div style={{ width: '90%', margin: 'auto', borderRadius: '5px', border: '2px solid black', textAlign: 'center' }}>
      <DataTable
          title="Historial de Ingresos"
          columns={columns}
          data={filteredData}
          pagination
          subHeader
          subHeaderComponent={
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
             <input
          type="text"
          placeholder="Buscar... "
          value={filterText}
          onChange={handleFilterChange}
          style={{ width: '250px', marginRight: '10px', borderRadius: '5px' }}
        />
            </div>
          }
        />
      </div>

      <Modal
        size="xl"
        show={modalVisible}
        onHide={closeModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Detalle del Ingreso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRecord && (
            <div>
            <DataTable
              title="Artículos"
              columns={[
                { name: 'Artículo', selector: 'id_articulo', sortable: true, cell: row => getNombreArticulo(row.id_articulo) },
                { name: 'Categoria', selector: 'id_categoria', sortable: true, cell: row => getNombreCategoriaById(row.id_categoria) },
                { name: 'Marca', selector: 'id_marca', sortable: true, cell: row => getMarcaNombreById(row.id_marca) },
                { name: 'Material', selector: 'id_material', sortable: true, cell: row => getMaterialNameById(row.id_material) },
                { name: 'Color', selector: 'id_color', sortable: true, cell: row => getColorNameById(row.id_color) },
                { name: 'Diseño', selector: 'id_diseño', sortable: true, cell: row => obtenerNombreDisenoPorId(row.id_diseño) },
                { name: 'Estilo', selector: 'id_estilo', sortable: true, cell: row => mapEstiloIdToNombre(row.id_estilo) },
                { name: 'Tallas', selector: 'id_talla',sortable:true, cell: row =>getNombreTalla(row.id_talla) },
                { name: 'Promocion', selector: 'id_promocion', sortable: true, cell: row => row.id_promocion ? row.id_promocion : 'N/D' },
                { name: 'Bodega', selector: 'id_bodega', sortable: true, cell: row => row.id_bodega ? row.id_bodega : 'N/D' },
                { name: 'Cantidad', selector: 'cantidad', sortable: true },
                { name: 'Precio Proveedor', selector: 'precio_proveedor', sortable: TbRuler3 },
                { name: 'Subtotal', selector: 'subtotal', sortable: true },
              ]}
              data={selectedRecord.articulos}
              pagination
            />
          </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>


      <Footer />
    </div>
  );
};

export default HistorialIngresosView;
