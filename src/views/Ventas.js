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


  // Inside the component, after setting the selected items state
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
    const fetchData = async () => {
      const response = await axios.get('https://api-mafy-store.onrender.com/api/stock');
      const receivedStockData = response.data;
      setStockData(receivedStockData);
    };

    fetchData();
  }, []);




  useEffect(() => {
    const fetchBodega = async () => {
      const response = await axios.get('https://api-mafy-store.onrender.com/api/bodegas');
      const receivedBodegaData = response.data;
      setBodegas(receivedBodegaData);
    };
    fetchBodega();
  }, []);

  useEffect(() => {
    const fetchTallas = async () => {
      const response = await axios.get('https://api-mafy-store.onrender.com/api/tallas');
      setTallas(response.data);
    };
    fetchTallas();
  }, []);


  useEffect(() => {
    const fetchPromotions = async () => {
      const response = await axios.get('https://api-mafy-store.onrender.com/api/promociones');
      setPromotions(response.data);
    };

    fetchPromotions();
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
      cantidad: 1, // You may adjust this based on your logic for the quantity
      precio: Precio_venta,
      descuento: row.Daños ? Descuento_maximo : Descuento, // Use Descuento_maximo for damaged items
      Existencias,
      Id_promocion,
      subtotal: 0, // Initialize subtotal
    };

    // Calculate subtotal based on quantity, price, and discount
    newItem.subtotal = newItem.cantidad * newItem.precio - newItem.descuento;

    // If you want to ensure the subtotal is not negative
    newItem.subtotal = Math.max(newItem.subtotal, 0);


    setSelectedItems([...selectedItems, newItem]);
    setSelectedRow(row);
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
        descuento: totalDiscount + promotionDiscount, // Sumar los dos descuentos
        subtotal: total - (totalDiscount + promotionDiscount), // Restar los dos descuentos del total
        total: total,
        estado: true,
      };

      // Mostrar el JSON que se enviará en la primera petición POST
      console.log('JSON enviado en la primera petición de venta:', ventaData);


      const responseVenta = await axios.post('https://api-mafy-store.onrender.com/api/ventas', ventaData, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token, 
        },
      });
      

      // Extraer el ID de la venta creada
      const ventaId = responseVenta.data._id;
      console.log('ID de la venta creada:', ventaId);

      // Construir la data de los artículos asociados a la venta (en el formato especificado)
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
          descuento: rest.danos ? 0 : rest.descuento, // Ajustar según tu lógica de descuento
          _id: rest._id, // Mantener el ID original
        })),
        total: total - (totalDiscount + promotionDiscount), // Restar los descuentos al total
      };

      // Mostrar el JSON que se enviará en la segunda petición POST
      console.log('JSON enviado en la segunda petición de artículos:', articulosVentaData);

      // Realizar la segunda petición POST a la URL correspondiente para los artículos
      const responseArticulos = await axios.post('https://api-mafy-store.onrender.com/api/detalleventa', articulosVentaData, {
       headers: {
        'Content-Type': 'application/json',
         'x-access-token': token, 
                 },
                  });

      console.log('Segunda petición de artículos realizada con éxito:', responseArticulos.data);

      setRequestStatus({ loading: false, success: true, error: null });
      console.log('Venta realizada con éxito');
    } catch (error) {
      setRequestStatus({ loading: false, success: false, error: error.message });
      console.error('Error realizando la venta:', error);
    }

    // ... (tu código existente)

    for (const item of selectedItems) {
      const updatedExistencias = item.Existencias - item.cantidad;
      const stockUpdateData = {
        Existencias: updatedExistencias,
        estado: updatedExistencias === 0 ? false : true,
      };

      const stockUpdateUrl = `https://api-mafy-store.onrender.com/api/stock/${item._id}`;

      try {
        // Realiza la solicitud PUT para actualizar el stock
        const responseStockUpdate = await axios.put(stockUpdateUrl, stockUpdateData, {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token, // Reemplaza 'tuTokenAquí' con el valor real del token
          },
        });
        
        limpiarTabla();
        toast('Venta realizda')
        console.log(`Stock actualizado para el artículo con _id ${item.Id_articulo}`);
      } catch (error) {
        console.error('Error actualizando el stock:', error);
        // Maneja el error según sea necesario
      }
    }

  };







  useEffect(() => {
    const fetchColores = async () => {
      const response = await axios.get('https://api-mafy-store.onrender.com/api/colores');
      setColores(response.data);
    };
    fetchColores();
  }, []);

  useEffect(() => {
    const fetchArticulos = async () => {
      const response = await axios.get('https://api-mafy-store.onrender.com/api/articulos');
      setArticulos(response.data);
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
    const fetchEstilos = async () => {
      const response = await axios.get('https://api-mafy-store.onrender.com/api/estilos');
      setEst(response.data);
    };
    fetchEstilos();
  }, []);

  useEffect(() => {
    const fetchMarcas = async () => {
      const response = await axios.get('https://api-mafy-store.onrender.com/api/marcas');
      setMarcas(response.data);
    };
    fetchMarcas();
  }, []);

  useEffect(() => {
    const fetchDisenos = async () => {
      const response = await axios.get('https://api-mafy-store.onrender.com/api/disenos');
      setDisenos(response.data);
    };
    fetchDisenos();
  }, []);

  useEffect(() => {
    const fetchMateriales = async () => {
      const response = await axios.get('https://api-mafy-store.onrender.com/api/materiales');
      setMateriales(response.data);
    };
    fetchMateriales();
  }, []);


  

  const getNombreArticulo = (idArticulo) => {
    const articulo = articulos.find((a) => a._id === idArticulo);
    return articulo ? articulo.nombre : 'Desconocido';
  };

  const getNombreBodega = (idBodega) => {
    const bodega = bodegas.find((a) => a._id === idBodega);
    return bodega ? bodega.bodega : 'Desconocido';
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
      toast.error('Stock insuficiente');
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

  const filteredData = stockData.filter(
    item =>
      item._id.toLowerCase().includes(filterText.toLowerCase()) ||
      getNombreArticulo(item.Id_articulo).toLowerCase().includes(filterText.toLowerCase()) ||
      getNombreBodega(item.Id_bodega).toLowerCase().includes(filterText.toLowerCase()) ||
      item.Precio_venta.toString().toLowerCase().includes(filterText.toLowerCase()) ||
      item.Existencias.toString().toLowerCase().includes(filterText.toLowerCase()) ||
      estadoFormatter(item).toLowerCase().includes(filterText.toLowerCase()) ||
      danosFormatter(item).toLowerCase().includes(filterText.toLowerCase()) ||
      item.Descripcion.toLowerCase().includes(filterText.toLowerCase())
  );

  const getMarcaNombreById = (id) => {
    const marca = marcas.find((marca) => marca._id === id);
    return marca ? marca.marca : '';
  };

  const tableData = filteredData;
  const columns = [
    { name: '_id', cell: (row) => row._id, sortable: true },
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
    {
      name: 'Diseño',
      cell: (row) => {
        const diseno = disenos.find((diseno) => diseno._id === row.Id_diseño);
        return diseno ? diseno.diseno : 'Desconocido';
      },
      sortable: true,
    },
    { name: 'Descuento', cell: (row) => row.Descuento, sortable: true },
    { name: 'Descuento_maximo', cell: (row) => row.Descuento_maximo, sortable: true },
    {
      name: 'Bodega',
      cell: (row) => {
        const bodega = bodegas.find((bodega) => bodega._id === row.Id_bodega);
        return bodega ? bodega.bodega : 'Desconocida';
      },
      sortable: true,
    },
    { name: 'Precio', cell: (row) => row.Precio_venta, sortable: true },
    { name: 'Existencias', cell: (row) => row.Existencias, sortable: true },
    { name: 'Estado', cell: (row) => estadoFormatter(row), sortable: true },
    { name: 'Daños', cell: (row) => danosFormatter(row), sortable: true },
    { name: 'Descripcion', cell: (row) => row.Descripcion, sortable: true },
    {
      name: 'Promoción',
      cell: (row) => {
        const promocion = promotions.find((promocion) => promocion._id === row.Id_promocion);
        return promocion ? promocion.promocion : 'Desconocida';
      },
      sortable: true,
    },
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
        Registro de Ventas
      </h2>
      <Form style={{ width: '95%', backgroundColor: 'white', marginTop: '10px', marginLeft: '3%', marginRight: 'auto', borderRadius: '5px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Form.Group style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '55px' }}>
          <Form.Label style={{ marginLeft: '40px' }}>Fecha de Venta</Form.Label>
          <Form.Control
            id="fechaVenta"
            type="date"
            className="form-control"
            style={estilos.inputStyle2}
          />
        </Form.Group>
        <Form.Group style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Form.Label style={{ marginLeft: '50px' }}>Cliente</Form.Label>
          <Form.Control
            id="clienteVenta"
            type="text"
            style={estilos.inputStyle2}
            className="form-control"
          />
        </Form.Group>
      </Form>

      <Button style={estilos.search} variant="outline-secondary" onClick={handleShowModal} >
        Agregar Articulos
      </Button>

      <div style={{ marginTop: '25px', width: '95%', margin: '0 auto', overflowX: 'auto' }} >
        <table style={{ textAlign: 'center', marginTop: '10px' }} className="table table-bordered table-striped"  >
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
              <th>Descuento</th>
              <th>Prom Desc</th>
              <th>Opciones</th>
            </tr>
          </thead>
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
                <td>{item.subtotal.toFixed(2)}</td>
                <td>{item.Daños ? 'Sin daños' : item.descuento}</td>
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
      </div>

      <div style={{ margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '400px', backgroundColor: 'white', padding: '10px', borderRadius: '5px', marginTop: '10px' }}>


        <div style={{ marginTop: '10px' }}>
          <h4>Total: C${total.toFixed(2)}</h4>
          <h5>Descuento Total: C${totalDiscount}</h5>
          <h5>Promoción Descuento Total: C${promotionDiscount}</h5>
        </div>

      </div>

      <Button variant="success" style={{ width: '150px', height: '50px', marginTop: '20px', marginLeft: '45%' }} onClick={handleRealizarVenta} >
        Realizar Venta
      </Button>
      <Footer />
      <Modal show={showModal} onHide={handleCloseModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Agregar Articulos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <DataTable
  columns={columns}  // Assuming 'columns' is defined in your component
  data={tableData}    // Assuming 'tableData' is defined in your component
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
                // Permite solo números y teclas de control (por ejemplo, borrar)
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