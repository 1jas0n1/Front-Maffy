import React, { useState, useEffect } from "react";
import { PiCoinsBold } from "react-icons/pi";
import { FaSackDollar } from "react-icons/fa6";
import { Modal, Button } from "react-bootstrap";
import "../conversion/convertion.css";

const Conversion = () => {
  const [showDolarModal, setShowDolarModal] = useState(false);
  const [showCordobaModal, setShowCordobaModal] = useState(false);
  const [tipoCambioDolar, setTipoCambioDolar] = useState(null);
  const [amountInDollars, setAmountInDollars] = useState(0);
  const [convertedAmountDolar, setConvertedAmountDolar] = useState(0);
  const [amountInCordoba, setAmountInCordoba] = useState(0);
  const [convertedAmountCordoba, setConvertedAmountCordoba] = useState(0);

  const handleDolarClick = () => setShowDolarModal(true);
  const handleCordobaClick = () => setShowCordobaModal(true);

  const handleCloseDolar = () => setShowDolarModal(false);
  const handleCloseCordoba = () => setShowCordobaModal(false);

  const handleAmountDolarChange = (e) => {
    const value = parseFloat(e.target.value);
    setAmountInDollars(isNaN(value) ? 0 : value);
  };

  const handleAmountCordobaChange = (e) => {
    const value = parseFloat(e.target.value);
    setAmountInCordoba(isNaN(value) ? 0 : value);
  };

  useEffect(() => {
    // Fetch tipo de cambio on component mount
    fetch("https://api-mafy-store.onrender.com/api/configuracion")
      .then((response) => response.json())
      .then((data) => {
        const tipoCambio = data?.data[0]?.tipo_de_cambio_dolar;
        setTipoCambioDolar(tipoCambio);
      })
      .catch((error) => console.error("Error al obtener la configuración:", error));
  }, []);

  useEffect(() => {
    // Update converted amount when amountInDollars or tipoCambioDolar changes
    setConvertedAmountDolar(amountInDollars * tipoCambioDolar);
  }, [amountInDollars, tipoCambioDolar]);

  useEffect(() => {
    // Update converted amount when amountInCordoba or tipoCambioDolar changes
    setConvertedAmountCordoba(amountInCordoba / tipoCambioDolar);
  }, [amountInCordoba, tipoCambioDolar]);

  return (
    <div>
      <div className="icon-bar" style={{ /*... (existing style) */ }}>
        <a href="#" className="dolar" onClick={handleDolarClick}>
          <FaSackDollar style={{ fontSize: "22px" }} />
        </a>
        <a href="#" className="cordoba" onClick={handleCordobaClick}>
          <PiCoinsBold style={{ fontSize: "22px" }} />
        </a>
      </div>

      <Modal show={showDolarModal} onHide={handleCloseDolar}>
        <Modal.Header closeButton>
          <Modal.Title style={{textAlign:'center'}}>Dolar a Cordoba</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{textAlign:'center'}}>
          <label htmlFor="amountDolarInput">Ingrese la cantidad de Dólares</label>
          <input
  style={{ borderRadius: '5px', margin: '0 auto' }}
  type="number"
  id="amountDolarInput"
  value={amountInDollars}
  onChange={handleAmountDolarChange}
  min="0"
  pattern="\d*"
/>

          <p style={{fontSize:'22px'}} >Convertido a {convertedAmountDolar.toFixed(2)} Cordobas</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" style={{ width: '120px', height: '60px' }} onClick={handleCloseDolar}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showCordobaModal} onHide={handleCloseCordoba}>
        <Modal.Header closeButton>
          <Modal.Title style={{textAlign:'center'}}>Cordoba a Dolar</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{textAlign:'center'}}>
          <label htmlFor="amountCordobaInput" >Ingrese la cantidad en Cordoba</label>
          <input
  style={{ borderRadius: '5px', margin: '0 auto' }}
  type="number"
  id="amountCordobaInput"
  value={amountInCordoba}
  onChange={handleAmountCordobaChange}
  min="0"
  pattern="\d*"
/>

          <p style={{fontSize:'22px'}} >Convertido a {convertedAmountCordoba.toFixed(2)} Dólares</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" style={{ width: '120px', height: '60px' }} onClick={handleCloseCordoba}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Conversion;
