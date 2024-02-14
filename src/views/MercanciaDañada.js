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



  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy');
  };


  useEffect(() => {
    axios.get('http://localhost:4000/api/mercancia/')
      .then(response => {
        setData(response.data);
      })
  }, []);


  useEffect(() => {
    const fetchTallas = async () => {
      const response = await axios.get('http://localhost:4000/api/tallas');
      setTallas(response.data);
    };
    fetchTallas();
  }, []);

  useEffect(() => {
    axios.get('http://localhost:4000/api/user/all')
      .then(response => {
        setUserData(response.data);
      })
  }, []);


  const getUsernameById = (userId) => {
    const user = userData.find(user => user._id === userId);
    return user ? user.username : 'Desconocido';
  };



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
    const fetchMarcas = async () => {
      const response = await axios.get('http://localhost:4000/api/marcas');
      setMarcas(response.data);
    };
    fetchMarcas();
  }, []);

  useEffect(() => {
    const fetchCategorias = async () => {
      const response = await axios.get('http://localhost:4000/api/categorias');
      setCategorias(response.data);
    };
    fetchCategorias();
  }, []);

  const columns = [
    { name: '_id', selector: '_id', sortable: true,   center: true, },
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
      selector: 'id_usuario',
      sortable: true,
      center: true,
      cell: (row) => getUsernameById(row.id_usuario),

    },

    { name: 'Fecha', selector: 'Fecha', sortable: true, center: true,
      cell: (row) => formatDate(row.Fecha) },
      {
        name: 'Categoría',
        selector: (row) => {
          const categoria = categorias.find((c) => c._id === row.id_categoria);
          return categoria ? categoria.categoria : 'Desconocida';
        },
        sortable: true,
        center: true,
      },
    { name: 'Marca',
    selector: (row) => {
      const marca = marcas.find((marca) => marca._id === row.id_marca);
      return marca ? marca.marca : 'Desconocida';
    },
    sortable: true,
    center: true, },
    {     name: 'Talla',
    selector: (row) => {
      const talla = tallas.find((talla) => talla._id === row.id_talla);
      return talla ? talla.talla : 'Desconocida';
    },
    sortable: true,
    center: true, },
    {   name: 'Color',
    selector: (row) => {
      const color = colores.find((color) => color._id === row.id_color);
      return color ? color.color : 'Desconocido';
    },
    sortable: true,
    center: true,},
    { name: 'id_ingreso', selector: 'id_ingreso', sortable: true,   center: true, },
    { name: 'Cantidad', selector: 'Cantidad', sortable: true,   center: true, },
    {
      name: 'Daños',
      selector: 'Daños',
      sortable: true,
      center: true,

    },
    { name: 'Estado', selector: 'Estado', sortable: true,   center: true,      cell: row => row.Daños ? 'Activo' : 'Inactivo', },
    { name: 'Descripcion', selector: 'Descripcion', sortable: true,   center: true, },
  ];

  return (
    <div>
      <MyNavbar />
      <div style={{width:'90%',margin:'0 auto',border:'2px solid black',borderRadius:'3px',textAlign:'center'}}>
        <DataTable
        style={{textAlign: 'center'}}
          title="Mercancía Dañada"
          columns={columns}
          data={data}
        />
      </div>
      <Footer />
    </div>
  );
};

export default MercanciaDañada;
