import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import MyNavbar from '../component/Navbar';
import Footer from '../component/footer/footer';
import { FaEye } from "react-icons/fa";
import { MdPrint } from "react-icons/md";
import { Button, Modal } from 'react-bootstrap';
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
      const response = await axios.get(`https://api-mafy-store.onrender.com/api/ingresos/${id_ingreso}`);
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
    const fetchMarcas = async () => {
      const response = await axios.get('https://api-mafy-store.onrender.com/api/marcas');
      setMarcas(response.data);
    };
    fetchMarcas();
  }, []);

  useEffect(() => {
    const fetchMateriales = async () => {
      const response = await axios.get('https://api-mafy-store.onrender.com/api/materiales');
      setMateriales(response.data);
    };
    fetchMateriales();
  }, []);

  useEffect(() => {
    const fetchEstilos = async () => {
      const response = await axios.get('https://api-mafy-store.onrender.com/api/estilos');
      setEst(response.data);
    };
    fetchEstilos();
  }, []);

  useEffect(() => {
    const fetchDisenos = async () => {
      const response = await axios.get('https://api-mafy-store.onrender.com/api/disenos');
      setDisenos(response.data);
    };
    fetchDisenos();
  }, []);

  useEffect(() => {
    const fetchArticulos = async () => {
      try {
        const response = await axios.get('https://api-mafy-store.onrender.com/api/articulos');
        setArticulos(response.data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };
    fetchArticulos();
  }, []);

  useEffect(() => {
    const fetchCategorias = async () => {
      const response = await axios.get('https://api-mafy-store.onrender.com/api/categorias');
      setCategorias(response.data);
    };
    fetchCategorias();
  }, []);

  useEffect(() => {

    const fetchProveedores = async () => {
      try {
        const response = await axios.get('https://api-mafy-store.onrender.com/api/proveedores');
        setProveedores(response.data);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    };
    fetchProveedores();
  }, []);


  useEffect(() => {
    const fetchColores = async () => {
      const response = await axios.get('https://api-mafy-store.onrender.com/api/colores');
      setColores(response.data);
    };
    fetchColores();
  }, []);

  useEffect(() => {
    const fetchTallas = async () => {
      const response = await axios.get('https://api-mafy-store.onrender.com/api/tallas');
      setTallas(response.data);
    };
    fetchTallas();
  }, []);

  useEffect(() => {
    fetch('https://api-mafy-store.onrender.com/api/detalleingreso')
      .then(response => response.json())
      .then(async data => {
        const formattedData = await Promise.all(data.map(async item => {
          const incomeResponse = await axios.get(`https://api-mafy-store.onrender.com/api/ingresos/${item.id_ingreso}`);
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
    const printUrl = `https://api-mafy-store.onrender.com/api/detalleingreso/${id}/print`;
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
        const response = await axios.get('https://api-mafy-store.onrender.com/api/user/all');
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
    { name: 'Id', cell: (row) => row._id, sortable: true, },
    { name: 'Id Ingreso', cell: (row) => row.id_ingreso, sortable: true },
    { name: 'Usuario', cell: (row) => getUserNameById(row.id_usuario), sortable: true },
    { name: 'Proveedor', cell: (row) => getProveedorById(row.id_proveedor), sortable: true },
    { name: 'Total C$', cell: (row) => parseFloat(row.total).toFixed(2), sortable: true },
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

  return (
    <div>
      <MyNavbar />
      <div style={{ width: '90%', margin: 'auto', borderRadius: '5px', border: '2px solid black' }}>
        <DataTable
          title="Historial de Ingresos"
          columns={columns}
          data={filteredData}
          pagination
          subHeader
          subHeaderComponent={
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
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
        onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Detalle del Ingreso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRecord && (
            <div>
              <DataTable
                title="Artículos"
                const columns={[
                  { name: 'Artículo', cell: (row) => getNombreArticulo(row.id_articulo), sortable: true },
                  { name: 'Categoria', cell: (row) => getNombreCategoriaById(row.id_categoria), sortable: true },
                  { name: 'Marca', cell: (row) => getMarcaNombreById(row.id_marca), sortable: true },
                  { name: 'Material', cell: (row) => getMaterialNameById(row.id_material), sortable: true },
                  { name: 'Color', cell: (row) => getColorNameById(row.id_color), sortable: true },
                  { name: 'Diseño', cell: (row) => obtenerNombreDisenoPorId(row.id_diseño), sortable: true },
                  { name: 'Estilo', cell: (row) => mapEstiloIdToNombre(row.id_estilo), sortable: true },
                  { name: 'Tallas', cell: (row) => getNombreTalla(row.id_talla), sortable: true },
                  { name: 'Promocion', cell: (row) => row.id_promocion ? row.id_promocion : 'N/D', sortable: true },
                  { name: 'Bodega', cell: (row) => row.id_bodega ? row.id_bodega : 'N/D', sortable: true },
                  { name: 'Cantidad', cell: (row) => row.cantidad, sortable: true },
                  { name: 'Precio Proveedor', cell: (row) => row.precio_proveedor, sortable: true },
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
