import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { FaEye, FaPrint } from 'react-icons/fa';
import Modal from 'react-modal';
import MyNavbar from '../component/Navbar';
import Footer from '../component/footer/footer';
import { useParams } from 'react-router-dom';

const DataTableComponent = () => {
  
  const [data, setData] = useState([]);
  const [clientNames, setClientNames] = useState({});
  const [selectedSaleArticles, setSelectedSaleArticles] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  const [categorias, setCategorias] = useState([]);
  const [articulos, setArticulos] = useState([]);
  const [colores, setColores] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [est, setEst] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [disenos, setDisenos] = useState([]);
  const [promotions, setPromotions] = useState([]);

// Import useState and useEffect if not already imported
// Add this function outside the DataTableComponent component

const updateFechaField = async (id_ventas) => {
  try {
    // Fetch the data for the specified id_ventas from the ventas endpoint
    const response = await axios.get(`http://localhost:4000/api/ventas/${id_ventas}`);

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
        row.id_ventas === id_ventas ? { ...row, fecha: formattedFecha } : row
      )
    );
  } catch (error) {
    console.error('Error updating fecha field:', error);
  }
};

// Inside the first useEffect
useEffect(() => {
  axios.get('http://localhost:4000/api/detalleventa')
    .then(response => {
      setData(response.data);

      response.data.forEach(row => {
        axios.get(`http://localhost:4000/api/ventas/${row.id_ventas}`)
          .then(clientResponse => {
            setClientNames(prevNames => ({
              ...prevNames,
              [row.id_ventas]: clientResponse.data.cliente
            }));

            // Call the updateFechaField function with the id_ventas
            updateFechaField(row.id_ventas);
          })
          .catch(clientError => {
            console.error('Error al obtener el nombre del cliente:', clientError);
          });
      });
    })
    .catch(error => {
      console.error('Error al obtener datos:', error);
    });
}, []);


  useEffect(() => {
    const fetchTallas = async () => {
        const response = await axios.get('http://localhost:4000/api/tallas');
        setTallas(response.data);
    };
    fetchTallas();
  }, []);

  useEffect(() => {
    const fetchColores = async () => {
        const response = await axios.get('http://localhost:4000/api/colores');
        setColores(response.data);
    };
    fetchColores();
  }, []);

  useEffect(() => {
    const fetchArticulos = async () => {
        const response = await axios.get('http://localhost:4000/api/articulos');
        setArticulos(response.data);
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
    const fetchEstilos = async () => {
        const response = await axios.get('http://localhost:4000/api/estilos');
        setEst(response.data);
    };
    fetchEstilos();
  }, []);

  useEffect(() => {
    const fetchMarcas = async () => {
        const response = await axios.get('http://localhost:4000/api/marcas');
        setMarcas(response.data);
    };
    fetchMarcas();
  }, []);

  useEffect(() => {
    const fetchDisenos = async () => {
        const response = await axios.get('http://localhost:4000/api/disenos');
        setDisenos(response.data);
    };
    fetchDisenos();
  }, []);

  useEffect(() => {
    const fetchMateriales = async () => {
        const response = await axios.get('http://localhost:4000/api/materiales');
        setMateriales(response.data);
    };
    fetchMateriales();
  }, []);


  useEffect(() => {
    const fetchPromotions = async () => {
        const response = await axios.get('http://localhost:4000/api/promociones');
        setPromotions(response.data);
    };

    fetchPromotions();
  }, []);


  const handlePrintButtonClick = (id) => {
    // Construct the print URL with the 'id' parameter
    const printUrl = `http://localhost:4000/api/detalleventa/${id}/print`;


    window.open(printUrl, '_blank');
  };

  

  const getMaterialNameById = (materialId) => {
    const material = materiales.find((m) => m._id === materialId);
    return material ? material.material : 'Nombre no encontrado';
  };


const obtenerNombreDisenoPorId = (idDiseno) => {
  const disenoSeleccionado = disenos.find(diseno => diseno._id === idDiseno);
  return disenoSeleccionado ? disenoSeleccionado.diseno : 'Diseño no encontrado';
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
  const getNombreCategoriaById = (categoriaId) => {
    const categoria = categorias.find((c) => c._id === categoriaId);
    return categoria ? categoria.categoria : 'Desconocido';
  };
  const mapEstiloIdToNombre = (id) => {
    const estilo = est.find((e) => e._id === id);
    return estilo ? estilo.estilo : 'Desconocido ';
  };

  
  const getMarcaNombreById = (id) => {
    const marca = marcas.find((marca) => marca._id === id);
    return marca ? marca.marca : '';
  };



  const openModal = (articles) => {
    setSelectedSaleArticles(articles);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedSaleArticles([]);
    setModalOpen(false);
  };

  const columns = [
    { name: 'ID', selector: '_id', sortable: true },
    { name: 'ID Ventas', selector: 'id_ventas', sortable: true },
    { name: 'Total', selector: 'total', sortable: true },
    {
      name: 'Nombre del Cliente',
      selector: 'id_ventas',
      cell: row => clientNames[row.id_ventas],
      sortable: true,
    },
    { name: 'Fecha', selector: 'fecha', sortable: true },
    {
      name: 'Acciones',
      cell: row => (
        <div>
          <button
            style={{ width: '35px', height: '35px', backgroundColor: 'blue', borderRadius: '5px', color: 'white' }}
            onClick={() => openModal(row.articulos)}
          >
            <FaEye />
          </button>
          <button
        style={{ width: '35px', height: '35px', backgroundColor: 'blue', borderRadius: '5px', color: 'white', marginLeft: '3px' }}
        onClick={() => handlePrintButtonClick(row._id)}  // Pass the row's _id to the function
      >
        <FaPrint />
      </button>
        </div>
      ),
      button: true,
    },
  ];
  const filteredData = data.filter(
    item =>
      item._id.toLowerCase().includes(filterText.toLowerCase()) ||
      item.id_ventas.toLowerCase().includes(filterText.toLowerCase()) ||
      item.total.toString().toLowerCase().includes(filterText.toLowerCase()) ||
      clientNames[item.id_ventas].toLowerCase().includes(filterText.toLowerCase()) ||
      item.fecha.toLowerCase().includes(filterText.toLowerCase())
  );

  const articlesTableColumns = [
    // Define columns for the articles table based on your data structure
    {
      name: 'Articulo',
      selector: 'id_articulo',
      sortable: true,
      cell: (row) => getNombreArticulo(row.id_articulo),
    },
    { name: 'Categoria', selector: 'id_categoria', sortable: true, cell: (row) => getNombreCategoriaById(row.id_categoria) },
    { name: 'Marca', selector: 'id_marca', sortable: true, cell: (row) => getMarcaNombreById(row.id_marca) },
    { name: 'Color', selector: 'id_color', sortable: true, cell: (row) => getColorNameById(row.id_color) },
    { name: 'Estilo', selector: 'id_estilo', sortable: true, cell: (row) => mapEstiloIdToNombre(row.id_estilo) },
    { name: 'Material', selector: 'id_material', sortable: true, cell: (row) => getMaterialNameById(row.id_material) },
    { name: 'Talla', selector: 'id_talla', sortable: true, cell: (row) => getNombreTalla(row.id_talla) },
    { name: 'Diseño', selector: 'id_diseño', sortable: true, cell: (row) => obtenerNombreDisenoPorId(row.id_diseño) },

    { name: 'Cantidad', selector: 'cantidad', sortable: true },
    { name: 'Precio', selector: 'precio', sortable: true },
    { name: 'Subtotal', selector: 'subtotal', sortable: true },
    { name: 'Descuento', selector: 'descuento', sortable: true },

  ];

  return (
    <div>
      <MyNavbar />
      <div style={{ width: '90%', margin: 'auto', border: '2px solid black', borderRadius: '2px', marginTop: '5%', marginBottom: '5%', textAlign: 'center' }}>
        <DataTable
          style={{fontSize:'55px'}}
          title="Historial Ventas"
          columns={columns}
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
              style={{ width: '250px', marginRight: '10px', borderRadius: '5px' }}
            />
          }
          paginationResetDefaultPage={resetPaginationToggle}
       
          persistTableHead
        />
      </div>

      <Modal
      
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Detalles de Artículos"
      >
        <h2 style={{color:'black'}}>Detalles de Artículos</h2>
        <DataTable
          style={{border:'2px solid black'}}
          columns={articlesTableColumns}
          data={selectedSaleArticles}
          responsive
          pagination
        />
        <button style={{width:'100px',height:'40px',backgroundColor:'blue',color:'white',borderRadius:'5px'}} onClick={closeModal}>Cerrar</button>
      </Modal>

      <Footer />
    </div>
  );
};

export default DataTableComponent;
