import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import MyNavbar from '../component/Navbar';
import Footer from '../component/footer/footer';
import { FaEye } from "react-icons/fa";
import { MdPrint } from "react-icons/md";
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';

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
  const [tipoCambio, setTipoCambio] = useState(null);

  const updateFechaIngresoField = async (id_ingreso) => {
    try {
      const response = await axios.get(`https://apitammy-closset.fra1.zeabur.app/api/ingresos/${id_ingreso}`);
      const fechaDate = new Date(response.data.fecha);
      const formattedFecha = fechaDate.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      });
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
    const fetchTipoCambio = async () => {
      try {
        const response = await axios.get('https://apitammy-closset.fra1.zeabur.app/api/configuracion');
        const cambio = response.data.data[0].tipo_de_cambio_dolar;
        setTipoCambio(cambio);
      } catch (error) {
        console.error("Error fetching tipo de cambio:", error);
      }
    };
    fetchTipoCambio();
  }, []);

  const convertirACordobasADolares = (totalCordobas) => {
    return tipoCambio ? (totalCordobas / tipoCambio).toFixed(2) : 'Cargando...';
  };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          marcasRes,
          materialesRes,
          estilosRes,
          disenosRes,
          articulosRes,
          categoriasRes,
          proveedoresRes,
          coloresRes,
          tallasRes
        ] = await Promise.all([
          axios.get('https://apitammy-closset.fra1.zeabur.app/api/marcas'),
          axios.get('https://apitammy-closset.fra1.zeabur.app/api/materiales'),
          axios.get('https://apitammy-closset.fra1.zeabur.app/api/estilos'),
          axios.get('https://apitammy-closset.fra1.zeabur.app/api/disenos'),
          axios.get('https://apitammy-closset.fra1.zeabur.app/api/articulos'),
          axios.get('https://apitammy-closset.fra1.zeabur.app/api/categorias'),
          axios.get('https://apitammy-closset.fra1.zeabur.app/api/proveedores'),
          axios.get('https://apitammy-closset.fra1.zeabur.app/api/colores'),
          axios.get('https://apitammy-closset.fra1.zeabur.app/api/tallas')
        ]);
  
        setMarcas(marcasRes.data);
        setMateriales(materialesRes.data);
        setEst(estilosRes.data);
        setDisenos(disenosRes.data);
        setArticulos(articulosRes.data);
        setCategorias(categoriasRes.data);
        setProveedores(proveedoresRes.data);
        setColores(coloresRes.data);
        setTallas(tallasRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);
  
  useEffect(() => {
    fetch('https://apitammy-closset.fra1.zeabur.app/api/detalleingreso')
      .then(response => response.json())
      .then(async data => {
        const formattedData = await Promise.all(data.map(async item => {
          const incomeResponse = await axios.get(`https://apitammy-closset.fra1.zeabur.app/api/ingresos/${item.id_ingreso}`);
          const incomeData = incomeResponse.data;
          updateFechaIngresoField(item.id_ingreso);
          return {
            _id: item._id,
            id_ingreso: item.id_ingreso,
            id_usuario: incomeData.id_usuario,
            id_proveedor: incomeData.id_proveedor,
            total: item.total,
            articulos: item.articulos,
            fecha: '',
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
    const printUrl = `https://apitammy-closset.fra1.zeabur.app/api/detalleingreso/${id}/print`;
    const newTab = window.open(printUrl, '_blank');
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
    return categoria ? categoria.categoria : 'Desconocida';
  };

  const getNombreArticulo = (idArticulo) => {
    const articulo = articulos.find((a) => a._id === idArticulo);
    return articulo ? articulo.nombre : 'Desconocido';
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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://apitammy-closset.fra1.zeabur.app/api/user/all');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUsers();
  }, []);

  const getUserNameById = (userId) => {
    const user = users.find((u) => u._id === userId);
    return user ? user.username : 'Desconocido';
  };

  const columns = [
    { name: 'Id Ingreso', cell: (row) => row.id_ingreso, sortable: true, width: '215px' },
    { name: 'Usuario', cell: (row) => getUserNameById(row.id_usuario), sortable: true },
    { name: 'Proveedor', cell: (row) => getProveedorById(row.id_proveedor), sortable: true },
    { 
      name: 'Total C$', 
      cell: (row) => <span style={{ color: 'green' }}>{parseFloat(row.total).toFixed(2)}</span>, 
      sortable: true 
    },
    { 
      name: 'Total $', 
      cell: (row) => <span style={{ color: 'green' }}>$ {convertirACordobasADolares(row.total)}</span>, 
      sortable: true 
    },
    { name: 'Fecha', cell: (row) => row.fecha },
    {
      name: 'Acciones',
      cell: (row) => (
        <div>
          <button style={{ width: '35px', height: '35px', backgroundColor: 'blue', marginRight: '2px', borderRadius: '5px', color: 'white' }} onClick={() => handleViewDetails(row)}><FaEye /></button>
          <button style={{ width: '35px', height: '35px', backgroundColor: 'blue', borderRadius: '5px', color: 'white' }} onClick={() => handlePrint(row)}><MdPrint /></button>
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
    <div>
      <MyNavbar />
      <div style={{ width: '95%', margin: 'auto' }}>
        <h2> 
      <img src="https://fontmeme.com/permalink/241031/7450d34fbea9272addf3e5c7e468cf62.png" alt="fuentes-de-comics" border="0"
            style={{ width: '85%', height: 'auto', maxWidth: '900px' }}></img>
        </h2>
        <DataTable
          columns={columns}
          customStyles={customStyles}
          data={filteredData}
          pagination
          subHeader
          subHeaderComponent={
            <div style={{ margin:'0 auto',marginTop:'10px',marginBottom:'10px'}}>
              <input
                type="text"
                placeholder="Buscar... "
                value={filterText}
                onChange={handleFilterChange}
                style={{ margin:'0 auto', borderRadius: '5px' }}
              />
            </div>
          }
        />
      </div>
      <Modal
        size="xl"
        show={modalVisible}
        onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Articulos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRecord && (
            <div>
              <DataTable
              
                customStyles={customStyles}
                const columns={[
                  { name: 'Artículo', cell: (row) => getNombreArticulo(row.id_articulo), sortable: true },
                  { name: 'Categoria', cell: (row) => getNombreCategoriaById(row.id_categoria), sortable: true,width:'150px' },
                  { name: 'Marca', cell: (row) => getMarcaNombreById(row.id_marca), sortable: true },
                  { name: 'Material', cell: (row) => getMaterialNameById(row.id_material), sortable: true },
                  { name: 'Color', cell: (row) => getColorNameById(row.id_color), sortable: true },
                  { name: 'Diseño', cell: (row) => obtenerNombreDisenoPorId(row.id_diseño), sortable: true },
                  { name: 'Estilo', cell: (row) => mapEstiloIdToNombre(row.id_estilo), sortable: true },
                  { name: 'Tallas', cell: (row) => getNombreTalla(row.id_talla), sortable: true },
                  { name: 'Bodega', cell: (row) => row.id_bodega ? row.id_bodega : 'N/D', sortable: true,width:'100px' },
                  { name: 'Cantidad', cell: (row) => row.cantidad, sortable: true },
                  { name: 'Precio Proveedor', cell: (row) => row.precio_proveedor, sortable: true,width:'150px' },
                  { name: 'Subtotal', cell: (row) => row.subtotal, sortable: true },
                ]}
                data={selectedRecord.articulos}
                pagination
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" style={{ width: '100px', height: '50px' }} onClick={closeModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      <Footer />
    </div>
  );
};

export default HistorialIngresosView;
