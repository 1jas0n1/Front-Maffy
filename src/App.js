import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

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

function App() {
  return (
    <>
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
          <Route path='/ventas' element={<VentasView />} />
          <Route path='/ingresos' element={<IngresosView />} />
          <Route path='/createuser' element={<UsuariosView />} />
          <Route path='/mercancia' element={<MercanciaView />} />
          <Route path='/historialingresos' element={<HistorialIngresos />} />
          <Route path='/historialventas' element={<HistorialVentas />} />
          <Route path='/ingresosdetalles' element={<DetalleIngresosView />} />
          <Route path='/listuser' element={<UserInfo />} />
          <Route path='/mercanciadañada' element={<MercanciaDañada />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
