import React, { useState, useEffect, useMemo } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import * as Styles from '../css/styles_colores';
import Footer from '../component/footer/footer';
import {  FaEdit } from 'react-icons/fa';
import Navbar from '../component/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TbShoppingBagX } from "react-icons/tb";

import Cookies from 'js-cookie';
const MercanciaView = () => {
  const [stock, setStock] = useState([]);
  const [existencias, setExistencias] = useState(0);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [filteredStock, setFilteredStock] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [articulos, setArticulos] = useState([]);
  const [colores, setColores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [tiposDeEstilo, setTiposDeEstilo] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [disenos, setDisenos] = useState([]);
  const [promociones, setPromociones] = useState([]);
  const [bodegas, setBodegas] = useState([]);

  const [newItem, setNewItem] = useState({
    Id_articulo: '',
    Id_usuario: '',
    Id_color: '',
    Id_marca: '',
    Id_talla: '',
    Id_estilo: '',
    Id_material: '',
    Id_diseño: '',
    Descuento: 0,
    Descuento_maximo: 0,
    Precio_prov: 0,
    Precio_venta: 0,
    Estado: true,
    Daños: false,
    Descripcion: '',
    Id_ingreso: '',
    Cod_barra: 0,
    Id_promocion: null,
  });
  const [selectedItem, setSelectedItem] = useState(null);

  const handleClose = () => {
    
    setShowUpdateModal(false);
    setNewItem({
      Id_articulo: '',
      Id_usuario: '',
      Id_color: '',
      Id_marca: '',
      Id_talla: '',
      Id_estilo: '',
      Id_material: '',
      Id_diseño: '',
      Descuento: 0,
      Descuento_maximo: 0,
      Precio_prov: 0,
      Precio_venta: 0,
      Estado: true,
      Daños: false,
      Descripcion: '',
      Id_ingreso: '',
      Cod_barra: 0,
      Id_promocion: null,
    });
    setSelectedItem(null);
  };

  const handleNotification = () => {
    toast.success('Operation successful');
  };

  const handleUpdate = (itemId) => {
    const selected = stock.find((item) => item._id === itemId);
    setSelectedItem(selected);
    setShowUpdateModal(true);
  };

  const showData = async () => {
    try {
      const urls = [
        'https://api-tammys.onrender.com/api/marcas/',
        'https://api-tammys.onrender.com/api/categorias/',
        'https://api-tammys.onrender.com/api/articulos',
        'https://api-tammys.onrender.com/api/colores',
        'https://api-tammys.onrender.com/api/tallas/',
        'https://api-tammys.onrender.com/api/materiales',
        'https://api-tammys.onrender.com/api/estilos/',
        'https://api-tammys.onrender.com/api/disenos',
        'https://api-tammys.onrender.com/api/promociones',
        'https://api-tammys.onrender.com/api/stock/',
        'https://api-tammys.onrender.com/api/bodegas'
      ];
      const responses = await Promise.all(urls.map(url => fetch(url)));
      const jsonData = await Promise.all(responses.map(response => response.json()));
      setMarcas(jsonData[0]);
      setCategorias(jsonData[1]);
      setArticulos(jsonData[2]);
      setColores(jsonData[3]);
      setTallas(jsonData[4]);
      setMateriales(jsonData[5]);
      setTiposDeEstilo(jsonData[6]);
      setDisenos(jsonData[7]);
      setPromociones(jsonData[8]);
      setStock(jsonData[9]);
      setFilteredStock(jsonData[9]);
      setBodegas(jsonData[10]);
    } catch (error) {

    }
  };

useEffect(() => {
  const lowerCaseFilter = filterText.toLowerCase();
  const filteredData = stock.filter((item) => {
    const articulo = articulos.find((articulo) => articulo._id === item.Id_articulo);
    const categoria = categorias.find((categoria) => categoria._id ===  item.Id_categoria);
    const color = colores.find((color) => color._id === item.Id_color);
    const marca = marcas.find((marca) => marca._id === item.Id_marca);
    const talla = tallas.find((talla) => talla._id === item.Id_talla);
    const estilo = tiposDeEstilo.find((tipoDeEstilo) => tipoDeEstilo._id === item.Id_estilo);
    const material = materiales.find((material) => material._id === item.Id_material);
    const diseno = disenos.find((diseno) => diseno._id === item.Id_diseño);
    const promocion = promociones.find((promocion) => promocion._id === item.Id_promocion);
    const bodega = bodegas.find((bodega) => bodega._id === item.Id_bodega);
    return (
      articulo && articulo.nombre.toLowerCase().includes(lowerCaseFilter) ||
      categoria && categoria.categoria.toLowerCase().includes(lowerCaseFilter) ||
      color && color.color.toLowerCase().includes(lowerCaseFilter) ||
      marca && marca.marca.toLowerCase().includes(lowerCaseFilter) ||
      talla && talla.talla.toLowerCase().includes(lowerCaseFilter) ||
      estilo && estilo.estilo.toLowerCase().includes(lowerCaseFilter) ||
      material && material.material.toLowerCase().includes(lowerCaseFilter) ||
      diseno && diseno.diseno.toLowerCase().includes(lowerCaseFilter) ||
      promocion && promocion.promocion.toLowerCase().includes(lowerCaseFilter) ||
      bodega && bodega.bodega.toLowerCase().includes(lowerCaseFilter) ||
      item._id.toLowerCase().includes(lowerCaseFilter) 
    );
  });
  setFilteredStock(filteredData);
}, [filterText, stock, articulos,categorias, colores, marcas, tallas, tiposDeEstilo, materiales, disenos, promociones, bodegas]);

const [showDamageModal, setShowDamageModal] = useState(false);
const [damageData, setDamageData] = useState({
  id_stock: "",
  id_articulo: "",
  id_usuario: "",
  id_categoria: "",
  id_marca: "",
  id_talla: "",
  id_color: "",
  id_ingreso: "",
});

const moveItemDamage = (row) => {
  const userId = Cookies.get('_id');
  const {
    _id,
    Estado,
    Id_articulo,
    Id_usuario,
    Id_categoria,
    Id_marca,
    Id_talla,
    Id_color,
    Id_ingreso,
  } = row;

  setDamageData({
    id_stock: _id,
    id_articulo: Id_articulo,
    id_usuario: userId,
    id_categoria: Id_categoria,
    id_marca: Id_marca,
    id_talla: Id_talla,
    id_color: Id_color,
    id_ingreso: Id_ingreso,
    Daños: "",
    Estado: Estado,
    Cantidad: 0,
    Descripcion: "",
    Fecha: '', 
    existencias: row.Existencias, 
  });
  setExistencias(row.existencias);
  setShowDamageModal(true);
};

const handleDamageSubmit = async () => {
  const token = Cookies.get('token');
  try {
    if (!damageData.Daños || damageData.Cantidad <= 0 || !damageData.Descripcion || !damageData.Fecha) {
      toast.warning('Completa los datos del Modal.');
      return;
    }
    if (damageData.Cantidad > damageData.existencias) {
      toast.warning('Se está intentando pasar más cantidad que la existencia');
      return;
    }
    if (!(damageData.Fecha instanceof Date)) {
      damageData.Fecha = new Date(damageData.Fecha);
    }
    if (isNaN(damageData.Fecha.getTime())) {
      toast.error('Fecha no válida');
      return;
    }
    console.log('JSON being sent to server:', JSON.stringify(damageData, null, 2));
    const response = await fetch('https://api-tammys.onrender.com/api/mercancia/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(damageData),
    });

    if (response.ok) {
      const DiferenciaExistencias = damageData.existencias - damageData.Cantidad;
      toast.success('Mercancia dañada registrada.');
   
      setShowDamageModal(false);
      const updateStockUrl = `https://api-tammys.onrender.com/api/stock/update/${damageData.id_stock}`;
      const updateStockResponse = await fetch(updateStockUrl, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: damageData.id_stock, DiferenciaExistencias }),
      });
      if (updateStockResponse.ok) {
 
      } else {
    
      }
    } else {
   
    }
  } catch (error) {

  }
};

  const columns = [
    {
      name: 'ID',
      selector: (row) => row._id,
      sortable: true,
      center: true,
      width:'225px'
    },
 {
  name: 'Articulo',
  selector: (row) => {
    const articulo = articulos.find((articulo) => articulo._id === row.Id_articulo);
    return articulo ? articulo.nombre : 'Desconocido';
  },
  sortable: true,
  center: true,
},
{
  name: 'Categoria',
  selector: (row) => {
    const categoria = categorias.find((categoria) => categoria._id === row.Id_categoria);
    return categoria ? categoria.categoria : 'Desconocida';
  },
  sortable: true,
  center: true,
},
   {
  name: 'Color',
  selector: (row) => {
    const color = colores.find((color) => color._id === row.Id_color);
    return color ? color.color : 'Desconocido';
  },
  sortable: true,
  center: true,
},{
  name:'Bodega',
  selector:(row) =>{
    const bodega = bodegas.find((bodega) => bodega._id === row.Id_bodega);
    return bodega ? bodega.bodega: 'Desconocida';
  }
  ,
  sortable: true,
  center: true,
},
  {
  name: 'Marca',
  selector: (row) => {
    const marca = marcas.find((marca) => marca._id === row.Id_marca);
    return marca ? marca.marca : 'Desconocida';
  },
  sortable: true,
  center: true,
},
  {
  name: 'Talla',
  selector: (row) => {
    const talla = tallas.find((talla) => talla._id === row.Id_talla);
    return talla ? talla.talla : 'Desconocida';
  },
  sortable: true,
  center: true,
},
{
  name: 'Estilo',
  selector: (row) => {
    const tipoDeEstilo = tiposDeEstilo.find((tipoDeEstilo) => tipoDeEstilo._id === row.Id_estilo);
    return tipoDeEstilo ? tipoDeEstilo.estilo : 'Desconocido';
  },
  sortable: true,
  center: true,
},
{
  name: 'Material',
  selector: (row) => {
    const material = materiales.find((material) => material._id === row.Id_material);
    return material ? material.material : 'Desconocido';
  },
  sortable: true,
  center: true,
},
{
  name: 'Diseño',
  selector: (row) => {
    const diseno = disenos.find((diseno) => diseno._id === row.Id_diseño);
    return diseno ? diseno.diseno : '';
  },
  sortable: true,
  center: true,
},
{
name:'Existencias',
selector:(row) => row.Existencias,
sortable:true,
centre:true,
},
{
name: 'Descuento',
selector: (row) => row.Descuento,
sortable: true,
center: true,
},
{
name: 'Descuento Máximo',
selector: (row) => row.Descuento_maximo,
sortable: true,
center: true,
},
{
name: 'Precio Prov',
selector: (row) => row.Precio_prov,
sortable: true,
center: true,
},
{
name: 'Precio Venta',
selector: (row) => row.Precio_venta.toFixed(2),
sortable: true,
center: true,
},
{
      name: 'Estado',
      selector: (row) => (row.Estado ? 'Activo' : 'Descontinuado'),
      sortable: true,
      center: true,
    },
    {
      name: 'Daños',
      selector: (row) => (row.Daños ? 'SI' : 'NO'),
      sortable: true,
      center: true,
    },
    {
      name: 'Descripción',
      selector: (row) => row.Descripcion,
      sortable: true,
      center: true,
    },
    {
      name: 'ID Ingreso',
      selector: (row) => row.Id_ingreso,
      sortable: true,
      center: true,
      width:'225px'
    },
    {
      name: 'Código de Barras',
      selector: (row) => row.Cod_barra,
      sortable: true,
      center: true,
      width:'200px'
    },  
    {
      width: '200px',
      name: 'Acciones',
      cell: (row) => (
        <div style={{
          display: 'flex', 
          flexDirection: 'row', 
          gap: '10px', 
          justifyContent: 'center'
        }}>
          <Button  
            style={{
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              width: '40px',
              height: '40px',
              backgroundColor: 'green',
              color: 'white',
              borderRadius: '10px',
            }}  
            onClick={() => handleUpdate(row._id)} 
            update
          >
            <FaEdit />
          </Button>
          <Button
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
            }}  
            onClick={() => moveItemDamage(row)}  
          >
            <TbShoppingBagX />
          </Button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      center: true,
    },
    
  ];
  
  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div style={{ display: 'flex', margin: '0 auto', marginBottom: '5px' }}>
        <input
          type="text"
          placeholder="Buscar ..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          style={{borderRadius:'5px'}}
        />
      </div>
    );
  }, [filterText, resetPaginationToggle]);

 const handleUpdateSubmit = async () => {
  try {
    if (!selectedItem || !selectedItem._id) {

      return;
    }
    const urlWithId = `https://api-tammys.onrender.com/api/stock/update/${selectedItem._id}`;
    console.log('JSON being sent:', JSON.stringify(selectedItem, null, 2));
    const response = await fetch(urlWithId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedItem),
    });
    if (response.ok) {
      handleNotification();
      handleClose();
    } else {

    }
  } catch (error) {

  }
};


  useEffect(() => {
    showData();
  }, []);

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
    <Styles.AppContainer  >
      <Navbar />
      <h2 >
      <img
          src="https://fontmeme.com/permalink/241028/bc5137c42720be8c737ae33af044c803.png"
          alt="titulo de comic"
          style={{ width: '85%', height: 'auto', maxWidth: '900px' }} 
        />
      </h2>
<Styles.StyledDataTable
  columns={columns}
  customStyles={customStyles}
  data={filteredStock}
  pagination
  paginationResetDefaultPage={resetPaginationToggle}
  subHeader
  subHeaderComponent={subHeaderComponentMemo}
  persistTableHead
/>

<Styles.StyledModal show={showUpdateModal} onHide={handleClose}>
  <Modal.Header closeButton>
    <Modal.Title>Actualizar</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
<Form.Group controlId="formDescuento">
  <Form.Label>Descuento</Form.Label>
  <Form.Control
    type="number"
    placeholder="Enter Descuento"
    value={selectedItem ? selectedItem.Descuento : 0}
    onChange={(e) =>
      setSelectedItem({
        ...selectedItem,
        Descuento: e.target.value,
      })
    }
  />
</Form.Group>
<Form.Group controlId="formDescuentoMaximo">
  <Form.Label>Descuento Máximo</Form.Label>
  <Form.Control
    type="number"
    placeholder="Enter Descuento Máximo"
    value={selectedItem ? selectedItem.Descuento_maximo : 0}
    onChange={(e) =>
      setSelectedItem({
        ...selectedItem,
        Descuento_maximo: e.target.value,
      })
    }
  />
</Form.Group>
<Form.Group controlId="formPrecioProveedor">
  <Form.Label>Precio Proveedor</Form.Label>
  <Form.Control
    type="number"
    placeholder="Enter Precio Proveedor"
    value={selectedItem ? selectedItem.Precio_prov : 0}
    onChange={(e) =>
      setSelectedItem({
        ...selectedItem,
        Precio_prov: e.target.value,
      })
    }
  />
</Form.Group>
<Form.Group controlId="formPrecioVenta">
  <Form.Label>Precio Venta</Form.Label>
  <Form.Control
    type="number"
    placeholder="Enter Precio Venta"
    value={selectedItem ? selectedItem.Precio_venta : 0}
    onChange={(e) =>
      setSelectedItem({
        ...selectedItem,
        Precio_venta: e.target.value,
      })
    }
  />
</Form.Group>
<Form.Group controlId="formEstado">
  <Form.Label>Estado</Form.Label>
  <Form.Control
    as="select"
    value={selectedItem ? selectedItem.Estado : true}
    onChange={(e) =>
      setSelectedItem({
        ...selectedItem,
        Estado: e.target.value,
      })
    }
  >
    <option value={true}>Activo</option>
    <option value={false}>Inactivo</option>
  </Form.Control>
</Form.Group>
<Form.Group controlId="formDaños">
  <Form.Label>Daños</Form.Label>
  <Form.Control
    as="select"
    value={selectedItem ? selectedItem.Daños : false}
    onChange={(e) =>
      setSelectedItem({
        ...selectedItem,
        Daños: e.target.value,
      })
    }
  >
    <option value={false}>No</option>
    <option value={true}>SI</option>
  </Form.Control>
</Form.Group>
<Form.Group controlId="formDescripcion">
  <Form.Label>Descripción Daños</Form.Label>
  <Form.Control
    type="text"
    placeholder="Descripción"
    value={selectedItem ? selectedItem.Descripcion : ''}
    onChange={(e) =>
      setSelectedItem({
        ...selectedItem,
        Descripcion: e.target.value,
      })
    }
  />
</Form.Group>

<Form.Group controlId="formCodBarra">
  <Form.Label>Código de Barras</Form.Label>
  <Form.Control
    type="number"
    placeholder="Enter Código de Barras"
    value={selectedItem ? selectedItem.Cod_barra : 0}
    onChange={(e) =>
      setSelectedItem({
        ...selectedItem,
        Cod_barra: e.target.value,
      })
    }
  />
</Form.Group>



<Form.Group controlId="formIdBodega">
  <Form.Label>Bodega</Form.Label>
  <Form.Control
    as="select"
    value={selectedItem ? selectedItem.Id_bodega : ''}
    onChange={(e) =>
      setSelectedItem({
        ...selectedItem,
        Id_bodega: e.target.value,
      })
    }
  >
    <option value="">Selecciona una bodega</option>
    {bodegas.map((bodega) => (
      <option key={bodega._id} value={bodega._id}>
        {bodega.bodega}
      </option>
    ))}
  </Form.Control>
</Form.Group>

</Form>
  </Modal.Body>
  <Styles.ModalFooter>
    <Button className="otros" variant="primary" onClick={handleUpdateSubmit}>
      Save Changes
    </Button>
    <Button className="otros" variant="secondary" onClick={handleClose}>
      Close
    </Button>
  </Styles.ModalFooter>
</Styles.StyledModal>


<Styles.StyledModal show={showDamageModal} onHide={() => setShowDamageModal(false)}>
<Modal.Header closeButton>
          <Modal.Title>Mover Mercancia Dañada</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <Form.Group controlId="formDaños">
            <Form.Label>Descripcion Daños </Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese la Descripcion ..."
              value={damageData.Daños}
              onChange={(e) => setDamageData({ ...damageData, Daños: e.target.value })}
            />
          </Form.Group>
          <Form.Group controlId="formCantidad">
  <Form.Label>Cantidad</Form.Label>
  <Form.Control
    type="number"
    placeholder="Ingrese la  Cantidad ..."
    value={damageData.Cantidad}
    onChange={(e) => setDamageData({ ...damageData, Cantidad: parseInt(e.target.value, 10) || 0 })}
    onKeyPress={(e) => {
  
      const isNumber = /^\d+$/;
      if (!isNumber.test(e.key)) {
        e.preventDefault();
      }
      const enteredValue = parseInt(e.target.value + e.key, 10) || 0;
      if (enteredValue > existencias) {
        e.preventDefault();
        toast.warning('Stock insuficiente');
      }
    }}
  />
</Form.Group>

          <Form.Group controlId="formDescripcion">
            <Form.Label>Descripcion Articulo</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingresa Descripcion ..."
              value={damageData.Descripcion}
              onChange={(e) => setDamageData({ ...damageData, Descripcion: e.target.value })}
            />
          </Form.Group>
          <Form.Group controlId="formFecha">
  <Form.Label>Fecha</Form.Label>
  <Form.Control
    type="date"
    value={damageData.Fecha instanceof Date ? damageData.Fecha.toISOString().split('T')[0] : damageData.Fecha}
    onChange={(e) => setDamageData({ ...damageData, Fecha: new Date(e.target.value) })}
  />
</Form.Group>
        </Modal.Body>
        <Styles.ModalFooter>
          <Button className="otros" variant="primary" onClick={handleDamageSubmit}>
            Guardar Daños
          </Button>
          <Button className="otros" variant="secondary" onClick={() => setShowDamageModal(false)}>
            Cerrar
          </Button>
        </Styles.ModalFooter>
      </Styles.StyledModal>
<Footer />
<ToastContainer />
</Styles.AppContainer>
);
  }
export default MercanciaView;
