import React, { useState } from 'react';
import Navbar from '../component/Navbar';
import Footer from '../component/footer/footer';

const ReporteServiciosView = () => {
  const [fechaInicial, setFechaInicial] = useState('');
  const [fechaFinal, setFechaFinal] = useState('');
  const [error, setError] = useState('');

  const handleFechaInicialChange = (e) => {
    setFechaInicial(e.target.value);
  };

  const handleFechaFinalChange = (e) => {
    setFechaFinal(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (fechaFinal < fechaInicial) {
      setError('La fecha final no puede ser anterior a la fecha inicial.');
      return;
    }

    setError('');

    // Lógica para generar reporte
    console.log('Fecha inicial:', fechaInicial);
    console.log('Fecha final:', fechaFinal);
  };

  return (
    <div>
      <Navbar />

      <div className="container my-5" style={{ fontFamily: 'MV Boli' }}> {/* Añadir MV Boli a todo el contenedor */}
        <h2 className="text-center mb-4" style={{ color: 'black' }}>Reporte de Servicios</h2>

        <div className="card mx-auto" style={{ maxWidth: '400px' }}>
          <div className="card-body">
            <form onSubmit={handleSubmit} className="text-center">
              <div className="mb-3">
                <label htmlFor="fechaInicial" className="form-label">Fecha Inicial:</label>
                <input
                  type="date"
                  id="fechaInicial"
                  value={fechaInicial}
                  onChange={handleFechaInicialChange}
                  className="form-control form-control-sm"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="fechaFinal" className="form-label">Fecha Final:</label>
                <input
                  type="date"
                  id="fechaFinal"
                  value={fechaFinal}
                  onChange={handleFechaFinalChange}
                  className="form-control form-control-sm"
                  required
                />
              </div>

              {error && <div className="alert alert-danger">{error}</div>}

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '200px', height: '60px' }}>
                Generar Reporte
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ReporteServiciosView;
