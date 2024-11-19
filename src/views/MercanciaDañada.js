import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import Footer from '../component/footer/footer';
import MyNavbar from '../component/Navbar';
import { format } from 'date-fns';
import Cookies from 'js-cookie';


const MercanciaDañada = () => {
  const [data, setData] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [articulos, setArticulos] = useState([]);
  const [colores, setColores] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [userData, setUserData] = useState([]);

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: '#4A2148',
        color: '#fff',
        fontWeight: 'bold',
      },
    },
  };

  
  const getUsernameById = (userId) => {
    const user = userData.find(user => user._id === userId);
    return user ? user.username : 'Desconocido';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy');
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          mercanciaResponse,
          tallasResponse,
          userResponse,
          coloresResponse,
          articulosResponse,
          categoriasResponse,
          marcasResponse,
        ] = await Promise.all([
          axios.get('https://api-tammys.onrender.com/api/mercancia/'),
          axios.get('https://api-tammys.onrender.com/api/tallas'),
          axios.get('https://api-tammys.onrender.com/api/user/all'),
          axios.get('https://api-tammys.onrender.com/api/colores'),
          axios.get('https://api-tammys.onrender.com/api/articulos'),
          axios.get('https://api-tammys.onrender.com/api/categorias'),
          axios.get('https://api-tammys.onrender.com/api/marcas'),
        ]);

        setData(mercanciaResponse.data);
        setTallas(tallasResponse.data);
        setUserData(userResponse.data);
        setColores(coloresResponse.data);
        setArticulos(articulosResponse.data);
        setCategorias(categoriasResponse.data);
        setMarcas(marcasResponse.data);
      } catch (error) {
      }
    };
    fetchData();
  }, []);

  const columns = [
    { name: '_id', selector: (row) => row._id, sortable: true, center: true },
    {
      name: 'Articulo',
      selector: (row) => {
        const articulo = articulos.find((articulo) => articulo._id === row.id_articulo);
        return articulo ? articulo.nombre : 'Desconocido';
      },
      sortable: true,
      center: true,
    },
    {
      name: 'Usuario',
      selector: (row) => row.id_usuario,
      sortable: true,
      center: true,
      cell: (row) => getUsernameById(row.id_usuario),
    },
    {
      name: 'Fecha',
      selector: (row) => row.Fecha,
      sortable: true,
      center: true,
      cell: (row) => formatDate(row.Fecha),
    },
    {
      name: 'Categoría',
      selector: (row) => {
        const categoria = categorias.find((c) => c._id === row.id_categoria);
        return categoria ? categoria.categoria : 'Desconocida';
      },
      sortable: true,
      center: true,
    },
    {
      name: 'Marca',
      selector: (row) => {
        const marca = marcas.find((marca) => marca._id === row.id_marca);
        return marca ? marca.marca : 'Desconocida';
      },
      sortable: true,
      center: true,
    },
    {
      name: 'Talla',
      selector: (row) => {
        const talla = tallas.find((talla) => talla._id === row.id_talla);
        return talla ? talla.talla : 'Desconocida';
      },
      sortable: true,
      center: true,
    },
    {
      name: 'Color',
      selector: (row) => {
        const color = colores.find((color) => color._id === row.id_color);
        return color ? color.color : 'Desconocido';
      },
      sortable: true,
      center: true,
    },
    { name: 'id_ingreso', selector: (row) => row.id_ingreso, sortable: true, center: true },
    { name: 'Cantidad', selector: (row) => row.Cantidad, sortable: true, center: true },
    {
      name: 'Daños',
      selector: (row) => row.Daños,
      sortable: true,
      center: true,
    },
    {
      name: 'Estado',
      selector: (row) => row.Daños ? 'Activo' : 'Inactivo',
      sortable: true,
      center: true,
    },
    { name: 'Descripcion', selector: (row) => row.Descripcion, sortable: true, center: true },
  ];

  return (
    <div>
      <MyNavbar />
      <h2>
      <img 
        src="https://fontmeme.com/permalink/241104/ffeaaae4f42cc6e7c4a93e04797285e1.png" 
        alt="Comic Font"
        style={{ width: '85%', height: 'auto', maxWidth: '900px' }}
      />
      </h2>
      <div style={{width:'95%',margin:'0 auto',borderRadius:'3px',textAlign:'center'}}>
        <DataTable
        style={{textAlign: 'center'}}
          columns={columns}
          customStyles={customStyles}
          data={data}
        />
      </div>
      <Footer />
    </div>
  );
};

export default MercanciaDañada;
