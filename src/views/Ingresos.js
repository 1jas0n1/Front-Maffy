import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Modal, Alert } from 'react-bootstrap';
import estilos from '../css/ingresos-estilos';
import '../css/detalle-ingresos.css';
import axios from 'axios';
import Footer from '../component/footer/footer';
import MyNavbar from '../component/Navbar';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import Cookies from 'js-cookie';
import AddButton from '../component/AddButton';
import DeleteButton from'../component/DeleteButton';
import Drop from '../component/Drop';
import SellButton from '../component/SellButton'
import TotalsCard from '../component/Ticket';

  const IngresosView = () => {
  const [articulos, setArticulos] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [colores, setColores] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [est, setEst] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [disenos, setDisenos] = useState([]);
  const [articulosIngresados, setArticulosIngresados] = useState([]);
  const [subTotalTotal, setSubTotalTotal] = useState(0);
  const [descuentosTotal, setDescuentosTotal] = useState(0);
  const [ivaTotal, setIvaTotal] = useState(0);
  const [editIndex, setEditIndex] = useState(-1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const [formulario, setFormulario] = useState({
    idArticulo: '',
    idProveedor: '',
    idTalla: '',
    idColor: '',
    cantidad: '',
    idMarca: '',
    idMaterial: '',
    idEstilo: '',
    idDiseño: '',
    descuento: '',
    idCategoria: '',
    precioprov: '',
    total: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          articulosResponse,
          categoriasResponse,
          proveedoresResponse,
          coloresResponse,
          marcasResponse,
          tallasResponse,
          materialesResponse,
          estilosResponse,
          disenosResponse
        ] = await Promise.all([
          axios.get('https://api-tammys.onrender.com/api/articulos'),
          axios.get('https://api-tammys.onrender.com/api/categorias'),
          axios.get('https://api-tammys.onrender.com/api/proveedores'),
          axios.get('https://api-tammys.onrender.com/api/colores'),
          axios.get('https://api-tammys.onrender.com/api/marcas'),
          axios.get('https://api-tammys.onrender.com/api/tallas'),
          axios.get('https://api-tammys.onrender.com/api/materiales'),
          axios.get('https://api-tammys.onrender.com/api/estilos'),
          axios.get('https://api-tammys.onrender.com/api/disenos')
        ]);  
        setArticulos(articulosResponse.data);
        setCategorias(categoriasResponse.data);
        setProveedores(proveedoresResponse.data);
        setColores(coloresResponse.data);
        setMarcas(marcasResponse.data);
        setTallas(tallasResponse.data);
        setMateriales(materialesResponse.data);
        setEst(estilosResponse.data);
        setDisenos(disenosResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const subTotal = articulosIngresados.reduce((total, articulo) => {
      const iva = parseFloat(calculateIVA(articulo.cantidad, articulo.precioprov, articulo.descuento));
      const discountedPrice = parseFloat((articulo.cantidad * articulo.precioprov * (1 - articulo.descuento / 100)).toFixed(2));
      return total + discountedPrice + iva;
    }, 0);
    setSubTotalTotal(subTotal);

    const descuentos = articulosIngresados.reduce((total, articulo) => {
      return total + parseFloat((articulo.cantidad * articulo.precioprov * (articulo.descuento / 100)).toFixed(2));
    }, 0);
    setDescuentosTotal(descuentos);

    const iva = articulosIngresados.reduce((total, articulo) => {
      return total + parseFloat(calculateIVA(articulo.cantidad, articulo.precioprov, articulo.descuento));
    }, 0);
    setIvaTotal(iva);
  }, [articulosIngresados]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormulario((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const updateTotals = (articulos) => {
    const subTotal = articulos.reduce((total, articulo) => {
      return (
        total +
        parseFloat(calculateIVA(articulo.cantidad, articulo.precioprov, articulo.descuento)) +
        parseFloat((articulo.cantidad * articulo.precioprov * (1 - articulo.descuento / 100)).toFixed(2))
      );
    }, 0);
    setSubTotalTotal(subTotal);

    const descuentos = articulos.reduce((total, articulo) => {
      return total + parseFloat((articulo.cantidad * articulo.precioprov * (articulo.descuento / 100)).toFixed(2));
    }, 0);
    setDescuentosTotal(descuentos);

    const iva = articulos.reduce((total, articulo) => {
      return total + parseFloat(calculateIVA(articulo.cantidad, articulo.precioprov, articulo.descuento));
    }, 0);
    setIvaTotal(iva);
  };

  const handleEliminarArticulo = (index) => {
    const nuevosArticulos = [...articulosIngresados];
    nuevosArticulos.splice(index, 1);
    setArticulosIngresados(nuevosArticulos);
 
    const subTotal = nuevosArticulos.reduce((total, articulo) => {
      return (
        total +
        parseFloat(calculateIVA(articulo.cantidad, articulo.precioprov, articulo.descuento)) +
        parseFloat((articulo.cantidad * articulo.precioprov * (1 - articulo.descuento / 100)).toFixed(2))
      );
    }, 0);
    setSubTotalTotal(subTotal);

    const descuentos = nuevosArticulos.reduce((total, articulo) => {
      return total + parseFloat((articulo.cantidad * articulo.precioprov * (articulo.descuento / 100)).toFixed(2));
    }, 0);
    setDescuentosTotal(descuentos);

    const iva = nuevosArticulos.reduce((total, articulo) => {
      return total + parseFloat(calculateIVA(articulo.cantidad, articulo.precioprov, articulo.descuento));
    }, 0);
    setIvaTotal(iva);
    handleLimpiar();
  };

  const calculateIVA = (cantidad, precio, descuento) => {
    const precioConDescuento = precio * (1 - descuento / 100);
    const ivaPercentage = 15; 
    const iva = (cantidad * precioConDescuento * ivaPercentage) / 100;
    return iva.toFixed(2);
  };

  const handleGuardar = () => {
    if (
      formulario.idArticulo === '' ||
      formulario.idTalla === '' ||
      formulario.idColor === '' ||
      formulario.idMarca === '' ||
      formulario.idMaterial === '' ||
      formulario.idEstilo === '' ||
      formulario.idDiseño === '' ||
      formulario.cantidad === '' ||
      formulario.precioprov === '' ||
      formulario.idCategoria === '' ||
      formulario.descuento === ''
    ) {
      setShowAlert(true);
      handleLimpiar();
      return;
    }

    if (editIndex !== -1) {
      setArticulosIngresados((prevArticulos) => {
        const updatedArticulos = [...prevArticulos];
        updatedArticulos[editIndex] = formulario;
        return updatedArticulos;
      });
    } else {
      setArticulosIngresados((prevArticulos) => [...prevArticulos, formulario]);
    }
    const updatedArticulos = [...articulosIngresados, formulario];

    const subTotal = updatedArticulos.reduce((total, articulo) => {
      return (
        total +
        parseFloat(calculateIVA(articulo.cantidad, articulo.precioprov, articulo.descuento)) +
        parseFloat((articulo.cantidad * articulo.precioprov * (1 - articulo.descuento / 100)).toFixed(2))
      );
    }, 0);
    setSubTotalTotal(subTotal);

    const descuentos = updatedArticulos.reduce((total, articulo) => {
      return total + parseFloat((articulo.cantidad * articulo.precioprov * (articulo.descuento / 100)).toFixed(2));
    }, 0);
    setDescuentosTotal(descuentos);

    const iva = updatedArticulos.reduce((total, articulo) => {
      return total + parseFloat(calculateIVA(articulo.cantidad, articulo.precioprov, articulo.descuento));
    }, 0);
    setIvaTotal(iva);
    handleLimpiar();
    setShowEditModal(false);
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
    return color ? color.color : '';
  };

  const handleEditarArticulo = (index) => {
    setFormulario({ ...articulosIngresados[index] });
    setEditIndex(index);
    setShowEditModal(true);
  };

  const getMarcaNombreById = (id) => {
    const marca = marcas.find((marca) => marca._id === id);
    return marca ? marca.marca : 'Desconocida';
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

const handleFacturarIngreso = async () => {
  const id_user = Cookies.get('_id');
  const token = Cookies.get('token'); 

  try {
      const ingresoData = {
          id_usuario: id_user,
          id_proveedor: formulario.idProveedor,
          fecha: new Date().toISOString(),
          iva: ivaTotal,
          descuento: descuentosTotal,
          subtotal: subTotalTotal,
          total: subTotalTotal - descuentosTotal + ivaTotal,
      };
      console.log('Datos del ingreso a enviar:', ingresoData);
      const responseIngreso = await axios.post('https://api-tammys.onrender.com/api/ingresos', ingresoData, {
          headers: {
              'Content-Type': 'application/json',
              'x-access-token': token,
          },
      });
      const idIngreso = responseIngreso.data._id;
      console.log('Ingreso creado correctamente:', responseIngreso);
      const articulosData = {
          id_ingreso: idIngreso,
          articulos: articulosIngresados.map((articulo) => ({
              id_articulo: articulo.idArticulo,
              id_categoria: articulo.idCategoria,
              id_talla: articulo.idTalla,
              id_color: articulo.idColor,
              id_marca: articulo.idMarca,
              id_material: articulo.idMaterial,
              id_estilo: articulo.idEstilo,
              id_diseño: articulo.idDiseño,
              cantidad: parseInt(articulo.cantidad),
              precio_proveedor: parseFloat(articulo.precioprov),
              iva: parseFloat(calculateIVA(articulo.cantidad, articulo.precioprov, articulo.descuento)),
              descuento: parseFloat((articulo.cantidad * articulo.precioprov * (articulo.descuento / 100)).toFixed(2)),
              subtotal: parseFloat(((articulo.cantidad * articulo.precioprov * (1 - articulo.descuento / 100)) + parseFloat(calculateIVA(articulo.cantidad, articulo.precioprov, articulo.descuento))).toFixed(2)),
          })),
          total: subTotalTotal - descuentosTotal + ivaTotal,
      };
      console.log('Datos de los artículos a enviar:', articulosData);
      const responseArticulos = await axios.post('https://api-tammys.onrender.com/api/detalleingreso', articulosData, {
          headers: {
              'Content-Type': 'application/json',
              'x-access-token': token,
          },
      });

      for (const articulo of articulosIngresados) {
          const stockData = {
              Id_articulo: articulo.idArticulo,
              Id_usuario: id_user,
              Id_categoria: articulo.idCategoria,
              Id_color: articulo.idColor,
              Id_marca: articulo.idMarca,
              Id_talla: articulo.idTalla,
              Id_estilo: articulo.idEstilo,
              Id_material: articulo.idMaterial,
              Id_diseño: articulo.idDiseño,
              Descuento: articulo.descuento,
              Descuento_maximo: articulo.descuento * 1.1,
              Precio_prov: parseFloat(articulo.precioprov),
              Precio_venta: parseFloat(((articulo.precioprov * (1 - articulo.descuento / 100)) + parseFloat(calculateIVA(articulo.cantidad, articulo.precioprov, articulo.descuento))).toFixed(2)),
              Estado: true,
              Daños: false,
              Descripcion: "",
              Id_ingreso: idIngreso,
              Cod_barra: 123456789,
              Id_bodega: articulo.idBodega || null,
              Id_promocion: articulo.idPromocion || null,
              Existencias: articulo.cantidad,
          };
          console.log('Datos del stock a enviar:', stockData);
          const responseStock = await axios.post('https://api-tammys.onrender.com/api/stock', stockData, {
              headers: {
                  'Content-Type': 'application/json',
                  'x-access-token': token,
              },
          });
          console.log('Stock creado correctamente:', responseStock);
      }

      toast.success('Venta realizada Exitosamente');
      setArticulosIngresados([]); 
      setFormulario({          
          idProveedor: '',
      });

  } catch (error) {
      if (error.response && error.response.status === 409) {
          console.error('Error 409: Conflicto al crear el documento en la colección "Stock".');
      } else {
          console.error('Error al facturar ingreso:', error);
      }
  }
};

  const handleLimpiar = () => {
    setFormulario({
      idArticulo: '',
      idTalla: '',
      idColor: '',
      cantidad: '',
      idMarca: '',
      idMaterial: '',
      idEstilo: '',
      idDiseño: '',
      descuento: '',
      idCategoria: '',
      precioprov: '',
      total: '',
    });
  };

  return (

    <Container fluid style={{height: '100%',padding:'0',width: '100%'}}>
      <MyNavbar/>
      <h2>
      <img
          src="https://fontmeme.com/permalink/241029/0188d6df889a2ef459c18c6759ddd714.png"
          alt="fuentes-de-comics"
          border="0"
          style={{ width: '85%', height: 'auto', maxWidth: '900px' }}
        />
      </h2>
      <Form style={{ width: '95%', backgroundColor: 'transparent', marginTop: '10px', marginLeft: 'auto', marginRight: 'auto', borderRadius: '5px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
  <Form.Group controlId="formFechaVenta" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: '35px' }}>
    <Form.Label style={{ textAlign: 'center', marginBottom: '5px',color:'black',fontsize:'35' }}>Fecha de Venta</Form.Label>
    <Form.Control type="date" style={{ width: '60%', alignSelf: 'center',textAlign:'center', padding: '5px' }} />
  </Form.Group>

  <Form.Group controlId="formProveedor" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <Form.Label style={{ textAlign: 'center', marginBottom: '5px',color:'black',fontsize:'35' }}>Proveedor</Form.Label>
    <select
      className="form-control"
      style={{ width: '60%', alignSelf: 'center', padding: '5px',textAlign:'center' }}
      value={formulario.idProveedor}
      onChange={(e) => setFormulario({ ...formulario, idProveedor: e.target.value })}
    >
      <option value="">Proveedores...</option>
      {proveedores.map((proveedor) => (
        <option key={proveedor._id} value={proveedor._id}>
          {proveedor.nombre}
        </option>
      ))}
    </select>
  </Form.Group>
</Form>
      <Form style={estilos.formStyle}>
        <fieldset className="form-row">
          <Row>
            <Col md={2}>
              <label style={estilos.labelStyle} htmlFor="id-articulo">
                Articulo
              </label>
              <Drop
      id="id-articulo"
      options={[{ value: '', label: 'Artículos...' }, ...articulos.map((articulo) => ({ value: articulo._id, label: articulo.nombre }))]}
      value={formulario.idArticulo}
      onChange={(newValue) => setFormulario({ ...formulario, idArticulo: newValue })}
      placeholder="Artículos..."
    />
            </Col>

            <Col md={2}>
              <label style={estilos.labelStyle3} htmlFor="id-talla">
                Talla
              </label>
              <Drop
      id="id-talla"
      options={[{ value: '', label: 'Tallas...' }, ...tallas.map((talla) => ({ value: talla._id, label: talla.talla }))]}
      value={formulario.idTalla}
      onChange={(newValue) => setFormulario({ ...formulario, idTalla: newValue })}
      placeholder="Tallas..."
    />
            </Col>

            <Col md={2}>
              <label style={estilos.labelStyle3} htmlFor="id-color">
                Color
              </label>
              <Drop
      id="id-color"
      options={[{ value: '', label: 'Colores...' }, ...colores.map((color) => ({ value: color._id, label: color.color }))]}
      value={formulario.idColor}
      onChange={(newValue) => setFormulario({ ...formulario, idColor: newValue })}
      placeholder="Colores..."
    />
            </Col>

            <Col md={2}>
              <label style={estilos.labelStyle3} htmlFor="id-marca">
                Marca
              </label>
              <Drop
      id="id-marca"
      options={[{ value: '', label: 'Marcas...' }, ...marcas.map((marca) => ({ value: marca._id, label: marca.marca }))]}
      value={formulario.idMarca}
      onChange={(newValue) => setFormulario({ ...formulario, idMarca: newValue })}
      placeholder="Marcas..."
    />
            </Col>

            <Col md={2}>
              <label style={estilos.labelStyle} htmlFor="id-material">
                Material
              </label>
              <Drop
      id="id-material"
      options={[{ value: '', label: 'Materiales...' }, ...materiales.map((material) => ({ value: material._id, label: material.material }))]}
      value={formulario.idMaterial}
      onChange={(newValue) => setFormulario({ ...formulario, idMaterial: newValue })}
      placeholder="Materiales..."
    />
            </Col>
            <Col md={2}>
              <label style={estilos.labelStyle} htmlFor="id-estilo">
                Estilo
              </label>
              <Drop
  id="id-estilo"
  options={[
    { value: '', label: 'Estilos...' }, 
    ...est.map((estilo) => ({ value: estilo._id, label: estilo.estilo }))
  ]}
  value={formulario.idEstilo}
  onChange={(newValue) => setFormulario({ ...formulario, idEstilo: newValue })}
  placeholder="Estilos..."
/>
            </Col>
          </Row>
          <hr style={{ margin: '10px 0', border: '1px solid #ccc' }} />
          <Row>
            <Col md={2}>
              <label style={estilos.labelStyle} htmlFor="id-diseno">
                Diseño
              </label>
              <Drop
      id="id-diseno"
      options={[{ value: '', label: 'Diseños...' }, ...disenos.map((diseno) => ({ value: diseno._id, label: diseno.diseno }))]}
      value={formulario.idDiseño}
      onChange={(newValue) => setFormulario({ ...formulario, idDiseño: newValue })}
      placeholder="Diseños..."
    />
            </Col>

            <Col md={2}>
              <label style={estilos.labelStyle} htmlFor="id-categoria">
                Categoria
              </label>
              <Drop
      id="id-categoria"
      options={[{ value: '', label: 'Categoría...' }, ...categorias.map((categoria) => ({ value: categoria._id, label: categoria.categoria }))]}
      value={formulario.idCategoria}
      onChange={(newValue) => setFormulario({ ...formulario, idCategoria: newValue })}
      placeholder="Categoría..."
    />
            </Col>

            <Col md={2}>
              <label htmlFor="cantidad" style={estilos.labelStyle}>
                Cantidad
              </label>
              <input
                type="text"
                id="cantidad"
                className="form-control"
                value={formulario.cantidad}
                onChange={handleInputChange}
                required
                style={estilos.inputStyle}
              />
            </Col>
            <Col md={2}>
              <label htmlFor="Precio Proveedor" style={estilos.labelStyle4}>
                Precio-Prov
              </label>
              <input
                type="text"
                id="precioprov"
                className="form-control"
                value={formulario.precioprov}
                onChange={handleInputChange}
                required
                style={estilos.inputStyle}
              />
            </Col>
            <Col md={2}>
  <label htmlFor="descuento" style={estilos.labelStyle}>  
  C$ Descuento X Unidad
  </label>
  <input
    type="number"
    id="descuento"
    className="form-control"
    value={formulario.descuento}
    onChange={(e) => {
      const value = e.target.value;
      if (value === '' || (Number(value) >= 0 && !isNaN(value))) {
        handleInputChange(e); 
      }
    }}
    min="0" 
    required
    style={estilos.inputStyle}
  />
</Col>

          </Row>
          <hr style={{ margin: '10px 0', border: '1px solid #ccc' }} />
          <Row>
            <AddButton onClick={handleGuardar}/ >
            <DeleteButton onClick={handleLimpiar}> </DeleteButton>
          </Row>
        </fieldset>
      </Form>

      {showAlert && (
        <Alert variant="danger" style={{ width: '50%', margin: '0 auto', marginTop: '25px',marginBottom:'25px' }} onClose={() => setShowAlert(false)} dismissible>
          Por favor, completa todos los campos antes de agregar el artículo.
        </Alert>
      )}

{articulosIngresados.length > 0 && (
  <div style={{ marginTop: '10px', width: '95%', margin: '0 auto', overflowX: 'auto' }}>
    <h3 style={{ color: 'white', textAlign: 'center' }}>Artículos Ingresados</h3>
    <table style={{ textAlign: 'center' }} className="table table-bordered table-striped">
      <thead>
        <tr style={{ backgroundColor: '#00FFBD' }}>
          <th>Articulo</th>
          <th>Categoría</th>
          <th>Talla</th>
          <th>Color</th>
          <th>Marca</th>
          <th>Material</th>
          <th>Diseño</th>
          <th>Estilo</th>
          <th>Cantidad</th>
          <th>Precio</th>
          <th>Descuento</th>
          <th>IVA</th>
          <th>Subtotal</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {articulosIngresados.map((articulo, index) => (
          <tr key={index}>
            <td>{getNombreArticulo(articulo.idArticulo)}</td>
            <td>{getNombreCategoriaById(articulo.idCategoria)}</td>
            <td>{getNombreTalla(articulo.idTalla)}</td>
            <td>{getColorNameById(articulo.idColor)}</td>
            <td>{getMarcaNombreById(articulo.idMarca)}</td>
            <td>{getMaterialNameById(articulo.idMaterial)}</td>
            <td>{obtenerNombreDisenoPorId(articulo.idDiseño)}</td>
            <td>{mapEstiloIdToNombre(articulo.idEstilo)}</td>
            <td>{articulo.cantidad}</td>
            <td>{articulo.precioprov}</td>
            <td>{articulo.descuento}</td>
            <td>{calculateIVA(articulo.cantidad, articulo.precioprov, articulo.descuento)}</td>
            <td>{((articulo.cantidad * articulo.precioprov * (1 - articulo.descuento / 100)) + parseFloat(calculateIVA(articulo.cantidad, articulo.precioprov, articulo.descuento))).toFixed(2)}</td>
            <td>
              <Button
                style={{ width: '75px', height: '35px', marginRight: '5px' }}
                variant="info"
                size="sm"
                onClick={() => handleEditarArticulo(index)}
              >
                Editar
              </Button>
              <Button
                style={{ width: '75px', height: '35px' }}
                variant="danger"
                size="sm"
                onClick={() => handleEliminarArticulo(index)}
              >
                Eliminar
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <TotalsCard 
  subTotalTotal={subTotalTotal} 
  descuentosTotal={descuentosTotal} 
  ivaTotal={ivaTotal} 
/>
  </div>
)}
      <SellButton
        variant="success"
        onClick={handleFacturarIngreso}>
        Facturar Ingreso
      </SellButton>
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header style={{ backgroundColor: '#4a4a4a', color: 'white' }} closeButton>
          <Modal.Title>Editar Artículo</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#4a4a4a', color: 'white' }}>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group controlId="formPrecioProv">
                  <Form.Label>Precio Proveedor</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Precio del Proveedor"
                    value={formulario.precioprov}
                    onChange={(e) => setFormulario({ ...formulario, precioprov: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formDescuento">
                  <Form.Label>Descuento %</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Descuento por Unidad"
                    value={formulario.descuento}
                    onChange={(e) => setFormulario({ ...formulario, descuento: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group controlId="formCantidad">
                  <Form.Label>Cantidad</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Cantidad"
                    value={formulario.cantidad}
                    onChange={(e) => setFormulario({ ...formulario, cantidad: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>

        <Modal.Footer style={{ backgroundColor: '#4a4a4a', color: 'white' }}>
          <Button variant="primary" onClick={handleGuardar} style={{ width: '100px', height: '50px' }} >
            Guardar
          </Button>
          <Button variant="secondary" onClick={() => setShowEditModal(false)} style={{ width: '100px', height: '50px' }}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      <Footer />
      <ToastContainer/>
    </Container>
  );
};

export default IngresosView;