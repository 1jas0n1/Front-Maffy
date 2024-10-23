import React from "react";
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import Home from "./component/Home";
import ColoresView from "./views/Colores.js";
import EstilosView from "./views/Estilos.js";
import CategoriasView from "./views/Categorias.js";
import BodegasView from "./views/Bodegas.js";
import MarcasView from "./views/Marcas.js";
import MaterialesView from "./views/Materiales.js";
import TallasView from "./views/Tallas.js";
import ProveedoresView from "./views/Proveedores.js";
import DisenosView from "./views/Diseños.js";
import PromocionesView from "./views/Promociones.js";
import ConfigView from "./views/Configuracion.js";
import LoginView from "./views/Login.js";
import ArticulosView from "./views/Articulos.js";
import VentasView from "./views/Ventas.js";
import IngresosView from "./views/Ingresos.js";
import UsuariosView from "./views/usuarios.js";
import MercanciaView from "./views/Stock.js";
import HistorialIngresos from "./views/HistorialIngresos.js";
import HistorialVentas from "./views/HistorialVentas.js";
import DetalleIngresosView from "./views/Detalle-ingresos.js";
import UserInfo from "./views/ListUser.js";
import MercanciaDañada from "./views/MercanciaDañada.js";
import Reporteventas from "./views/Reportes.js";
import ServiciosView from "./views/Servicios.js";
import FacturacionServicioView from "./views/FacturacionServicio.js";
import ReporteServiciosView from "./views/ReporteServicios.js";
import ReporteComprasView from "./views/ReporteCompras.js";
import ReporteVentasView from "./views/ReporteVentas";

function App() {
  return (
   
      <Router >
        <Routes>
          <Route path='/' element={<LoginView />} />
          <Route path='/index' element={<Home />} />
          <Route path='/configuracion' element={<ConfigView />} />
          <Route path='/colores' element={<ColoresView />} />
          <Route path='/estilos' element={<EstilosView />} />
          <Route path='/categorias' element={<CategoriasView />} />
          <Route path='/bodegas' element={<BodegasView />} />
          <Route path='/marcas' element={<MarcasView />} />
          <Route path='/materiales' element={<MaterialesView />} />
          <Route path='/tallas' element={<TallasView />} />
          <Route path='/proveedores' element={<ProveedoresView />} />
          <Route path='/disenos' element={<DisenosView />} />
          <Route path='/promociones' element={<PromocionesView />} />
          <Route path='/articulos' element={<ArticulosView />} />
          <Route path='/ventas-art' element={<VentasView />} />
          <Route path='/ingresos-art' element={<IngresosView />} />
          <Route path='/create-user' element={<UsuariosView />} />
          <Route path='/mercancia' element={<MercanciaView />} />
          <Route path='/historial-ingreso' element={<HistorialIngresos />} />
          <Route path='/historial-venta' element={<HistorialVentas />} />
          <Route path='/ingresos-detalles' element={<DetalleIngresosView />} />
          <Route path='/list-user' element={<UserInfo />} />
          <Route path='/mercancia-dañada' element={<MercanciaDañada />} />
          <Route path='/reportes' element={<Reporteventas></Reporteventas>}/>
          <Route path='/servicios' element={<ServiciosView/>} />
          <Route path='/FactServicios' element={<FacturacionServicioView/>} />
          <Route path='/ReporteServicios' element={<ReporteServiciosView />} />
          <Route path='/ReporteVentas' element={<ReporteVentasView/>} />
          <Route path='/ReporteCompras' element={<ReporteComprasView/>} />
        </Routes>
      </Router>
   
  );
}

export default App;
