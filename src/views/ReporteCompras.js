import React, { useState } from 'react';
import Navbar from '../component/Navbar';
import Footer from '../component/footer/footer';

const ReporteComprasView = () => {
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

    const fechaInicio = new Date(fechaInicial);
    const fechaFin = new Date(fechaFinal);

    if (fechaFin < fechaInicio) {
      setError('La fecha final no puede ser anterior a la fecha inicial.');
      return;
    }

    setError('');

    try {
      const response = await fetch(`https://apimafy.zeabur.app/api/Ingresos/reportes?startDate=${fechaInicial}&endDate=${fechaFinal}`);

      if (!response.ok) {
        throw new Error('Error al generar el reporte');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Compras_${fechaInicial}_to_${fechaFinal}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError('Ocurrió un error al generar el reporte: ' + error.message);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="container my-5" style={{ fontFamily: 'MV Boli' }}>
        <h2 className="text-center mb-4" style={{ color: 'black' }}>Reporte de Compras</h2>

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
                style={{ width: '200px', height: '60px', backgroundColor: 'white', borderRadius: '5px' }}>
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

export default ReporteComprasView;
