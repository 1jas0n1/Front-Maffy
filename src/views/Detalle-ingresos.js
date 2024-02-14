import React, { useState, useEffect, useMemo } from 'react';
//import { Form, Button, Modal } from 'react-bootstrap';
import * as Styles from '../css/styles_colores';
import Footer from '../component/footer/footer';
import { FaTrash, FaEdit } from 'react-icons/fa';
import Navbar from '../component/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Detalle_IngresosView = () => {
  const [detalleIngresos, setDetalleIngresos] = useState([]);

  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [newDetalleIngreso, setNewDetalleIngreso] = useState({
    id_ingreso: '',
    articulos: [],
    total: 0,
  });
  const [selectedDetalleIngreso, setSelectedDetalleIngreso] = useState(null);
  const [nombresArticulos, setNombresArticulos] = useState({});
  const [nombresTallas, setNombresTallas] = useState({});
  const [nombresColores, setNombresColores] = useState({});
  const [nombresMarcas, setNombresMarcas] = useState({});
  const [nombresMateriales, setNombresMateriales] = useState({});
  const [nombresEstilos, setNombresEstilos] = useState({});
   const [nombresDisenos, setNombresDisenos] = useState({});

  const handleClose = () => {
   
    setNewDetalleIngreso({
      id_ingreso: '',
      articulos: [],
      total: 0,
    });
    setSelectedDetalleIngreso(null);
  };
  const showData = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/detalleingreso');
      const data = await response.json();
      setDetalleIngresos(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    showData();
  }, []);
  const obtenerNombresArticulos = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/articulos');
      const data = await response.json();
      const nombres = {};

      data.forEach((articulo) => {
        nombres[articulo._id] = articulo.nombre;
      });

      setNombresArticulos(nombres);
    } catch (error) {
      console.error('Error obteniendo nombres de artículos:', error);
    }
  };

  const obtenerNombresTallas = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/tallas');
      const data = await response.json();
      const nombres = {};

      data.forEach((talla) => {
        nombres[talla._id] = talla.talla;
      });

      setNombresTallas(nombres);
    } catch (error) {
      console.error('Error obteniendo nombres de tallas:', error);
    }
  };
  const obtenerNombresColores = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/colores');
      const data = await response.json();
      const nombres = {};

      data.forEach((color) => {
        nombres[color._id] = color.color;
      });

      setNombresColores(nombres);
    } catch (error) {
      console.error('Error obteniendo nombres de colores:', error);
    }
  };

  const obtenerNombresMarcas = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/marcas');
      const data = await response.json();
      const nombres = {};

      data.forEach((marca) => {
        nombres[marca._id] = marca.marca;
      });

      setNombresMarcas(nombres);
    } catch (error) {
      console.error('Error obteniendo nombres de marcas:', error);
    }
  };

  const obtenerNombresMateriales = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/materiales');
      const data = await response.json();
      const nombres = {};

      data.forEach((material) => {
        nombres[material._id] = material.material;
      });

      setNombresMateriales(nombres);
    } catch (error) {
      console.error('Error obteniendo nombres de materiales:', error);
    }
  };
   const obtenerNombresEstilos = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/estilos');
      const data = await response.json();
      const nombres = {};

      data.forEach((estilo) => {
        nombres[estilo._id] = estilo.estilo;
      });

      setNombresEstilos(nombres);
    } catch (error) {
      console.error('Error obteniendo nombres de estilos:', error);
    }
  };


   const obtenerNombresDisenos = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/disenos');
      const data = await response.json();
      const nombres = {};

      data.forEach((diseno) => {
        nombres[diseno._id] = diseno.diseno;
      });

      setNombresDisenos(nombres);
    } catch (error) {
      console.error('Error obteniendo nombres de diseños:', error);
    }
  };


  useEffect(() => {
    obtenerNombresArticulos();
    obtenerNombresTallas();
    obtenerNombresColores();
    obtenerNombresMarcas();
    obtenerNombresMateriales();
    obtenerNombresEstilos();
    obtenerNombresDisenos();
  }, []);



  const filteredItems = detalleIngresos.filter(
    (item) =>
      item.id_ingreso && item.id_ingreso.toLowerCase().includes(filterText.toLowerCase())
  );

  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div style={{ display: 'flex', margin: '0 auto', marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Buscar por ID de Ingreso"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>
    );
  }, [filterText, resetPaginationToggle]);

  const columns = [
    {
      name: 'ID Ingreso',
      selector: (row) => row.id_ingreso,
      sortable: true,
      center: true,
    },
    {
      name: 'Nombre Artículo',
      selector: (row) => row.nombre_articulo,
      sortable: true,
      center: true,
    },{
      name: 'Nombre Talla',
      selector: (row) => row.nombre_talla,
      sortable: true,
      center: true,
    },
    {
      name: 'Nombre Color',
      selector: (row) => row.nombre_color,
      sortable: true,
      center: true,
    },
    {
      name: 'Nombre Marca',
      selector: (row) => row.nombre_marca,
      sortable: true,
      center: true,
    },
    {
      name: 'Nombre Material',
      selector: (row) => row.nombre_material,
      sortable: true,
      center: true,
    },
     {
      name: 'Nombre Estilo',
      selector: (row) => row.nombre_estilo,
      sortable: true,
      center: true,
    },
   {
      name: 'Nombre Diseño',
      selector: (row) => row.nombre_diseno,
      sortable: true,
      center: true,
    },
    {
      name: 'Cantidad',
      selector: (row) => row.cantidad,
      sortable: true,
      center: true,
    },
    {
      name: 'Precio Proveedor',
      selector: (row) => row.precio_proveedor,
      sortable: true,
      center: true,
    },
    {
      name: 'IVA',
      selector: (row) => row.iva,
      sortable: true,
      center: true,
    },
    {
      name: 'Descuento',
      selector: (row) => row.descuento,
      sortable: true,
      center: true,
    },
    {
      name: 'Subtotal',
      selector: (row) => row.subtotal,
      sortable: true,
      center: true,
    },
    {
      name: 'Acciones',
      cell: (row) => (
        <div>
          <Styles.ActionButton update>
            <FaEdit />
          </Styles.ActionButton>
          
        </div>
      ),
      center: true,
    },
  ];



  const flattenedData = detalleIngresos.flatMap((current) =>
  current.articulos.map((articulo) => ({
    id_ingreso: current.id_ingreso,
    nombre_articulo: nombresArticulos[articulo.id_articulo] || 'Desconocido',
    id_articulo: articulo.id_articulo,
    nombre_talla: nombresTallas[articulo.id_talla] || 'Desconocido',
    id_talla: articulo.id_talla,
    nombre_color: nombresColores[articulo.id_color] || 'Desconocido',
    id_color: articulo.id_color,
    nombre_marca: nombresMarcas[articulo.id_marca] || 'Desconocido',
    id_marca: articulo.id_marca,
    nombre_material: nombresMateriales[articulo.id_material] || 'Desconocido',
    id_material: articulo.id_material,
    nombre_estilo: nombresEstilos[articulo.id_estilo] || 'Desconocido',
    id_estilo: articulo.id_estilo,
    nombre_diseno: nombresDisenos[articulo.id_diseño] || 'Desconocido',
    id_diseno: articulo.id_diseno,
    cantidad: articulo.cantidad,
    precio_proveedor: articulo.precio_proveedor,
    iva: articulo.iva,
    descuento: articulo.descuento,
    subtotal: articulo.subtotal,
  }))
);


  return (
    <Styles.AppContainer>
      <Navbar />
     
      <Styles.StyledDataTable
        columns={columns}
        data={flattenedData}
        pagination
        paginationResetDefaultPage={resetPaginationToggle}
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        persistTableHead
        scrollX
      />
      <Footer />
      <ToastContainer />
    </Styles.AppContainer>
  );
};

export default Detalle_IngresosView;
