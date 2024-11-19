import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Modal } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import estilos from '../css/ingresos-estilos';
import '../css/detalle-ingresos.css';
import Footer from '../component/footer/footer';
import { FaPlus, FaPencilAlt } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdDeleteForever } from "react-icons/md";
import MyNavbar from '../component/Navbar';
import Cookies from 'js-cookie';
import ButtonM from '../component/BtnAgregar2';
import SellButton from '../component/SellButton'

const VentasView = () => {
  const [filterText, setFilterText] = useState('');
  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };
  const estadoFormatter = row => (row.Estado ? 'Activo' : 'Descontinuados');
  const danosFormatter = row => (row.Daños ? 'Sí' : 'No');
  const bodegaFormatter = row => (row.Id_bodega ? row.Id_bodega : 'S/B');
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [articulos, setArticulos] = useState([]);
  const [colores, setColores] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [est, setEst] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [disenos, setDisenos] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [bodegas, setBodegas] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [damageDiscount, setDamageDiscount] = useState(0);
  const [promotionDiscount, setPromotionDiscount] = useState(0);

  const calculateTotalsAndDiscounts = () => {
    let newTotal = 0;
    let newTotalDiscount = 0;
    let newDamageDiscount = 0;
    let newPromotionDiscount = 0;
    selectedItems.forEach((item) => {
      newTotal += item.subtotal;
      newTotalDiscount += item.Daños ? 0 : item.descuento;
      newDamageDiscount += item.Daños ? item.descuento : 0;
      newPromotionDiscount += getDiscountById(item.Id_promocion);
    });
    setTotal(newTotal);
    setTotalDiscount(newTotalDiscount);
    setDamageDiscount(newDamageDiscount);
    setPromotionDiscount(newPromotionDiscount);
  };

  useEffect(() => {
    calculateTotalsAndDiscounts();
  }, [selectedItems]);

  const [editingItem, setEditingItem] = useState(null);
  const [newQuantity, setNewQuantity] = useState(0);
  const handleShowModal = () => {
  setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    const fetchData = async (url, setData) => {
      const response = await axios.get(url);
      setData(response.data);
    };
    fetchData('https://api-tammys.onrender.com/api/stock', setStockData);
    fetchData('https://api-tammys.onrender.com/api/bodegas', setBodegas);
    fetchData('https://api-tammys.onrender.com/api/tallas', setTallas);
    fetchData('https://api-tammys.onrender.com/api/promociones', setPromotions);
    fetchData('https://api-tammys.onrender.com/api/colores', setColores);
    fetchData('https://api-tammys.onrender.com/api/articulos', setArticulos);
    fetchData('https://api-tammys.onrender.com/api/categorias', setCategorias);
    fetchData('https://api-tammys.onrender.com/api/estilos', setEst);
    fetchData('https://api-tammys.onrender.com/api/marcas', setMarcas);
    fetchData('https://api-tammys.onrender.com/api/disenos', setDisenos);
    fetchData('https://api-tammys.onrender.com/api/materiales', setMateriales);
  }, []);
  


  const handleAddToCart = (row) => {
    const { _id, Id_articulo, Id_categoria, Id_marca, Id_color, Id_estilo, Id_material, Id_talla, Id_diseño, Existencias, Precio_venta, Descuento, Descuento_maximo, Id_promocion } = row;
    const isItemInCart = selectedItems.some((item) => item._id === _id);
    if (isItemInCart) {
      toast.error('Este Articulo ya a sido seleccionado');
      return;
    }

    const newItem = {
      _id,
      Id_articulo,
      Id_categoria,
      Id_marca,
      Id_color,
      Id_estilo,
      Id_material,
      Id_talla,
      Id_diseño,
      cantidad: 1, 
      precio: Precio_venta,
      descuento: row.Daños ? Descuento_maximo : Descuento, 
      Existencias,
      Id_promocion,
      subtotal: 0, 
    };
    newItem.subtotal = newItem.cantidad * newItem.precio - newItem.descuento;
    newItem.subtotal = Math.max(newItem.subtotal, 0);
    setSelectedItems([...selectedItems, newItem]);
    setSelectedRow(row);
  };


  const getNombreArticulo = (idArticulo) => {
    const articulo = articulos.find((a) => a._id === idArticulo);
    return articulo ? articulo.nombre : 'S/B';
  };

  const getNombreBodega = (idBodega) => {
    const bodega = bodegas.find((a) => a._id === idBodega);
    return bodega ? bodega.bodega : 'S/B';
  };

  const handleEditOpen = (item) => {
    setEditingItem(item);
    setNewQuantity(item.cantidad);
  };

  const getDiscountById = (promoId) => {
    const promotion = promotions.find((p) => p._id === promoId);
    return promotion ? promotion.descuento : 0;
  };


  const handleEditSave = () => {
    const newQuantityNumber = parseInt(newQuantity, 10);

    if (newQuantityNumber > editingItem.Existencias) {
      toast.error('S/B');
      return;
    }

    const updatedItems = selectedItems.map((item) =>
      item._id === editingItem._id ? { ...item, cantidad: newQuantityNumber, subtotal: newQuantityNumber * item.precio - item.descuento } : item
    );

    setSelectedItems(updatedItems);
    setEditingItem(null);
  };

  const handleDeleteItem = (itemId) => {
    const updatedItems = selectedItems.filter(item => item._id !== itemId);
    setSelectedItems(updatedItems);
  };

  const handleEditClose = () => {
    setEditingItem(null);
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

  const [requestStatus, setRequestStatus] = useState({ loading: false, success: false, error: null });
  const limpiarTabla = () => {
    setSelectedItems([]);
    document.getElementById('fechaVenta').value = '';
    document.getElementById('clienteVenta').value = '';
    setTotal(0);
    setTotalDiscount(0);
    setPromotionDiscount(0);
  };

  const handleRealizarVenta = async () => {
    const token = Cookies.get('token');
    setRequestStatus({ loading: true, success: false, error: null });
    try {
      const fechaVenta = document.getElementById('fechaVenta').value;
      const clienteVenta = document.getElementById('clienteVenta').value;
      if (!fechaVenta || !clienteVenta) {
        toast.error('Por favor, ingrese la fecha y el cliente.');
        return;
      }
      const ventaData = {
        cliente: clienteVenta,
        fecha: fechaVenta,
        descuento: totalDiscount + promotionDiscount, 
        subtotal: total - (totalDiscount + promotionDiscount),
        total: total,
        estado: true,
      };

      const responseVenta = await axios.post('https://api-tammys.onrender.com/api/ventas', ventaData, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token, 
        },
      });
      const ventaId = responseVenta.data._id;
      const articulosVentaData = {
        id_ventas: ventaId,
        articulos: selectedItems.map(({ Existencias, Id_articulo, Id_categoria, Id_color, Id_diseño, Id_estilo, Id_marca, Id_material, Id_promocion, Id_talla, ...rest }) => ({
          ...rest,
          id_articulo: Id_articulo,
          id_categoria: Id_categoria,
          id_color: Id_color,
          id_diseño: Id_diseño,
          id_estilo: Id_estilo,
          id_marca: Id_marca,
          id_material: Id_material,
          id_promocion: Id_promocion,
          id_talla: Id_talla,
          cantidad: parseInt(rest.cantidad, 10),
          subtotal: rest.subtotal,
          descuento: rest.danos ? 0 : rest.descuento, 
          _id: rest._id, 
        })),
        total: total - (totalDiscount + promotionDiscount), 
      };

      const responseArticulos = await axios.post('https://api-tammys.onrender.com/api/detalleventa', articulosVentaData, {
       headers: {
        'Content-Type': 'application/json',
         'x-access-token': token, 
                 },
                  });
      setRequestStatus({ loading: false, success: true, error: null });
      console.log('Venta realizada con éxito');
    } catch (error) {
      setRequestStatus({ loading: false, success: false, error: error.message });
      console.error('Error realizando la venta:', error);
    }

    for (const item of selectedItems) {
      const updatedExistencias = item.Existencias - item.cantidad;
      const stockUpdateData = {
        Existencias: updatedExistencias,
        estado: updatedExistencias === 0 ? false : true,
      };

      const stockUpdateUrl = `https://api-tammys.onrender.com/api/stock/${item._id}`;
      try {
        const responseStockUpdate = await axios.put(stockUpdateUrl, stockUpdateData, {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token, 
          },
        });
        limpiarTabla();
      
        toast('Venta realizda')
        window.location.reload();
      } catch (error) {
        console.error('Error actualizando el stock:', error);
      }
    }
  };

  const filteredData = stockData
  .filter(
    (item) =>
      item._id.toLowerCase().includes(filterText.toLowerCase()) ||
      getNombreArticulo(item.Id_articulo).toLowerCase().includes(filterText.toLowerCase()) ||
      getNombreBodega(item.Id_bodega).toLowerCase().includes(filterText.toLowerCase()) ||
      item.Precio_venta.toString().toLowerCase().includes(filterText.toLowerCase()) ||
      item.Existencias.toString().toLowerCase().includes(filterText.toLowerCase()) ||
      estadoFormatter(item).toLowerCase().includes(filterText.toLowerCase()) ||
      danosFormatter(item).toLowerCase().includes(filterText.toLowerCase()) ||
      item.Descripcion.toLowerCase().includes(filterText.toLowerCase())
  )
  .filter((item) => item.Existencias > 0);
  const getMarcaNombreById = (id) => {
    const marca = marcas.find((marca) => marca._id === id);
    return marca ? marca.marca : '';
  };

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: '#4A2148',
        color: '#fff',
        fontWeight: 'bold',
      },
    },
  };

  const tableData = filteredData;
  const columns = [
    { name: '_id', cell: (row) => row._id, sortable: true,width:'215px',center:'true' },
    {
      name: 'Articulo',
      cell: (row) => {
        const articulo = articulos.find((articulo) => articulo._id === row.Id_articulo);
        return articulo ? articulo.nombre : 'Desconocido';
      },
      sortable: true,
    },
    {
      name: 'Categoria',
      cell: (row) => {
        const categoria = categorias.find((categoria) => categoria._id === row.Id_categoria);
        return categoria ? categoria.categoria : 'Desconocida';
      },
      sortable: true,
    },
    {
      name: 'Color',
      cell: (row) => {
        const color = colores.find((color) => color._id === row.Id_color);
        return color ? color.color : 'Desconocido';
      },
      sortable: true,
    },
    {
      name: 'Marca',
      cell: (row) => {
        const marca = marcas.find((marca) => marca._id === row.Id_marca);
        return marca ? marca.marca : 'Desconocida';
      },
      sortable: true,
    },
    {
      name: 'Talla',
      cell: (row) => {
        const talla = tallas.find((talla) => talla._id === row.Id_talla);
        return talla ? talla.talla : 'Desconocida';
      },
      sortable: true,
    },
    { name: 'Estilo', sortable: true, cell: (row) => mapEstiloIdToNombre(row.Id_estilo) },
    {
      name: 'Material',
      cell: (row) => {
        const material = materiales.find((material) => material._id === row.Id_material);
        return material ? material.material : 'Desconocido';
      },
      sortable: true,
    },
    {name: 'Diseño',cell: (row) => {const diseno = disenos.find((diseno) => diseno._id === row.Id_diseño);return diseno ? diseno.diseno : 'Desconocido';},sortable: true,},
    { name: 'Bodega',cell: (row) => {const bodega = bodegas.find((bodega) => bodega._id === row.Id_bodega); return bodega ? bodega.bodega : 'Desc.';},sortable: true,},
    { name: 'Precio', cell: (row) => row.Precio_venta, sortable: true },
    { name: 'Existencias', cell: (row) => row.Existencias, sortable: true },
    { name: 'Estado', cell: (row) => estadoFormatter(row), sortable: true },
    { name: 'Daños', cell: (row) => danosFormatter(row), sortable: true },
    { name: 'Descripcion', cell: (row) => row.Descripcion, sortable: true },
    {
      name: 'Opciones',
      cell: (row) => (
        <Button
          variant="primary"
          style={{ width: '40px', height: '40px', color: 'white' }}
          onClick={() => handleAddToCart(row)}
          disabled={selectedRow === row}
        >
        <FaPlus />
        </Button>
      ),
      button: true,
    },
  ];

  return (
    <Container fluid style={estilos.containerStyle}>
      <MyNavbar style={{ height: '100%', width: '100%' }}> </MyNavbar>
      <h2 className=" mt-4 center-text" style={estilos.titulo}>
        <img
          src="https://fontmeme.com/permalink/241029/fcf06085752b4e16dd86da3d365e5203.png"
          alt="fuentes-de-comics"
          border="0"
          style={{ width: '85%', height: 'auto', maxWidth: '900px' }}
        />
      </h2>
      <Form style={{ width: '95%', backgroundColor: 'transparent', marginTop: '10px', marginLeft: '3%', marginRight: 'auto', borderRadius: '5px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Form.Group style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '75px' }}>
          <Form.Label style={{ marginLeft: '65px',color:'black' }}>Fecha de Venta</Form.Label>
          <Form.Control
            id="fechaVenta"
            type="date"
            className="form-control"
            style={estilos.inputStyle2}
          />
        </Form.Group>
        <Form.Group style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Form.Label style={{ marginLeft: '275px',color:'black' }}>Cliente</Form.Label>
          <Form.Control
            id="clienteVenta"
            type="text"
            style={{ color:'black',
            width: '50%',
            marginBottom:'10px',
            padding: '5px',
            marginLeft:'150px'}}
            className="form-control"
          />
        </Form.Group>
      </Form>

      <div style={{ marginTop: '25px', width: '95%', margin: '0 auto', overflowX: 'auto' }}>

      <ButtonM style={{marginLeft:'750px'}} onClick={handleShowModal}  />

  <table style={{ textAlign: 'center', marginTop: '10px' }} className="table table-bordered table-striped">
    {selectedItems.length > 0 && (
      <thead>
        <tr>
          <th>Artículo</th>
          <th>Categoría</th>
          <th>Marca</th>
          <th>Color</th>
          <th>Talla</th>
          <th>Cantidad</th>
          <th>Precio</th>
          <th>Subtotal</th>
          <th>Opciones</th>
        </tr>
      </thead>
    )}
    <tbody>
      {selectedItems.map((item) => (
        <tr key={item._id}>
          <td>{getNombreArticulo(item.Id_articulo)}</td>
          <td>{getNombreCategoriaById(item.Id_categoria)}</td>
          <td>{getMarcaNombreById(item.Id_marca)}</td>
          <td>{getColorNameById(item.Id_color)}</td>
          <td>{getNombreTalla(item.Id_talla)}</td>
          <td>{item.cantidad}</td>
          <td>{item.precio}</td>
          <td>{getDiscountById(item.Id_promocion)}</td>
          <td>
            <Button variant="primary" style={{ width: '30px', height: '30px', marginRight: '5px', fontSize: '17px', padding: '0' }} onClick={() => handleEditOpen(item)}>
              <FaPencilAlt />
            </Button>
            <Button variant="danger" style={{ width: '30px', height: '30px', fontSize: '20px', padding: '0' }} onClick={() => handleDeleteItem(item._id)}>
              <MdDeleteForever style={{ marginBottom: '5px' }} />
            </Button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
  {selectedItems.length === 0 && <p> </p>}
</div>

      <div style={{ margin: '0 auto', display: 'flex', flexDirection: 'column',marginBottom:'35px', alignItems: 'center', maxWidth: '400px', backgroundColor: 'white', padding: '10px', borderRadius: '5px', marginTop: '10px' }}>
        <div style={{ marginTop: '10px' }}>
          <h4>Total: C${total.toFixed(2)}</h4>
          <h5>Descuento Total: C${totalDiscount}</h5>
          <h5>Promoción Descuento Total: C${promotionDiscount}</h5>
        </div>
      </div>

      <SellButton variant="success" style={{ width: '150px', height: '50px', marginTop: '25px', marginLeft: '45%' }} onClick={handleRealizarVenta} >

      </SellButton>
      <Footer />
      <Modal show={showModal} onHide={handleCloseModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Agregar Articulos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <DataTable
  columns={columns} 
  customStyles={customStyles}
  data={tableData}  
  pagination
  responsive
  conditionalRowStyles={conditionalRowStyles}
  subHeader
  subHeaderComponent={
    <div style={{ display: 'flex', margin: '0 auto', marginBottom: '5px' }}>
      <input
        type="text"
        placeholder="Buscar ..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        style={{ borderRadius: '5px' }}
      />
    </div>
  }
/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" style={{ width: '100px', height: '40px' }} onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={editingItem !== null} onHide={handleEditClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{ textAlign: 'center' }}>Editar Cantidad</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formNewQuantity">
            <Form.Label>Cantidad</Form.Label>
            <Form.Control
              type="number"
              value={newQuantity}
              onChange={(e) => setNewQuantity(e.target.value)}
              onKeyPress={(e) => {
                const validKey = /[0-9]|[\b]/.test(e.key);
                if (!validKey) {
                  e.preventDefault();
                }
              }}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" style={{ width: '100px', height: '40px' }} onClick={handleEditSave}>
            Guardar
          </Button>
          <Button variant="secondary" style={{ width: '100px', height: '40px' }} onClick={handleEditClose}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </Container>
  );
};

export default VentasView;

const conditionalRowStyles = [
  {
    when: row => row.Daños === true,
    style: {
      backgroundColor: '#F64663',
    },
  },
];