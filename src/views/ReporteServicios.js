import React, { useState } from 'react';
import Navbar from '../component/Navbar';
import Footer from '../component/footer/footer';

const ReporteServiciosView = () => {
  const [fechaInicial, setFechaInicial] = useState('');
  const [fechaFinal, setFechaFinal] = useState('');
  const [error, setError] = useState('');
  const handleFechaInicialChange = (e) => {
    const nuevaFechaInicial = e.target.value;
    const fechaInicio = new Date(nuevaFechaInicial);
    const fechaFin = new Date(fechaFinal);
  
    if (fechaFin < fechaInicio) {
      setError('La fecha final no puede ser anterior a la fecha inicial.');
    } else {
      setError('');
    }
    setFechaInicial(nuevaFechaInicial);
  };

  const handleFechaFinalChange = (e) => {
    const nuevaFechaFinal = e.target.value;
    const fechaInicio = new Date(fechaInicial);
    const fechaFin = new Date(nuevaFechaFinal);
  
    if (fechaFin < fechaInicio) {
      setError('La fecha final no puede ser anterior a la fecha inicial.');
    } else {
      setError('');
      setFechaFinal(nuevaFechaFinal);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (fechaFinal < fechaInicial) {
      setError('La fecha final no puede ser anterior a la fecha inicial.');
      return;
    }
    setError('');

    try {
      const response = await fetch(`https://api-tammys.onrender.com/api/facturaServicio/reporte?startDate=${fechaInicial}&endDate=${fechaFinal}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al generar el reporte');
      }

      const blob = await response.blob(); 
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a'); 
      link.href = url;
      link.download = `Facturas_${fechaInicial}_to_${fechaFinal}.xlsx`; 
      link.click(); 
      window.URL.revokeObjectURL(url); 

    } catch (error) {
      console.error('Error al descargar el archivo:', error);
      setError('Hubo un problema al descargar el archivo. Intenta nuevamente.');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container my-5"> 
        <h2>
          <img 
            src="https://fontmeme.com/permalink/241102/3975458e60ab28e1268701782716ce1a.png" 
            alt="Comic Text" 
            style={{ width: '85%', height: 'auto', maxWidth: '900px' }}
          />
        </h2>
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
              {error && <div className="alert alert-danger">{error}
              </div>}
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '200px', height: '60px' }}
                >
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
