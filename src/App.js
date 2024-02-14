import React from "react";

import Home from "./component/Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
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
      <Router>
        <Switch>
          <Route path='/' component={LoginView} exact />
          <Route path='/index' component={Home} exact />
          <Route path='/configuracion' component={ConfigView} exact />
          <Route path='/colores' component={ColoresView} exact />
          <Route path='/estilos' component={EstilosView} exact />
          <Route path='/categorias' component={CategoriasView} exact />
          <Route path='/bodegas' component={BodegasView} />
          <Route path='/marcas' component={MarcasView}  />
          <Route path='/materiales' component={MaterialesView}  />
          <Route path='/tallas' component={TallasView}  />
          <Route path='/proveedores' component={ProveedoresView}  />
          <Route path='/disenos' component={DisenosView}  />
          <Route path='/promociones' component={PromocionesView}  />
          <Route path='/articulos' component={ArticulosView}  />
          <Route path='/ventas' component={VentasView}/>
          <Route path='/ingresos' component={IngresosView} exact />
          <Route path='/createuser' component={UsuariosView}></Route>
          <Route path='/mercancia' component={MercanciaView}></Route>
          <Route path='/historial-ingresos' component={HistorialIngresos}></Route>
          <Route path='/historial-Ventas' component={HistorialVentas}></Route>
          <Route path='/ingresos-detalles' component={DetalleIngresosView} ></Route>
          <Route path='/listuser' component={UserInfo} exact />   
          <Route path='/mercancia-dañada' component={MercanciaDañada} exact />   

        </Switch>
      </Router>
    </>
  );
}

export default App;
