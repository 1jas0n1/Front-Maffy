import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Card = ({ total }) => {
  const [tipoCambio, setTipoCambio] = useState(1); // Tipo de cambio inicial
  const [montoConvertido, setMontoConvertido] = useState(total); // Monto actual mostrado en la tarjeta
  const [esConvertido, setEsConvertido] = useState(false); // Controla si se muestra el valor convertido o no

  useEffect(() => {
    fetch("https://apitammy-closset.fra1.zeabur.app/api/configuracion")
      .then((response) => response.json())
      .then((data) => {
        const cambio = data.data[0].tipo_de_cambio_dolar || 1; // Acceder al primer objeto del array "data"
        setTipoCambio(cambio);
        console.log("Tipo de cambio obtenido:", cambio); // Mostrar el tipo de cambio en la consola
      })
      .catch((error) => console.error("Error al obtener el tipo de cambio:", error));
  }, []);

  useEffect(() => {
    if (esConvertido && tipoCambio > 0) {
      setMontoConvertido(total / tipoCambio);
    } else {
      setMontoConvertido(total);
    }
  }, [total, tipoCambio, esConvertido]);

  const handleClick = () => {
    setEsConvertido(!esConvertido); // Cambiar el estado para alternar entre valores
  };

  if (total === 0) {
    return null;
  }

  return (
    <StyledWrapper>
      <div className="card">
        <div className="title">
          <span onClick={handleClick} style={{ cursor: 'pointer' }}>
            <svg
              width="20"
              fill="currentColor"
              height="20"
              viewBox="0 0 1792 1792"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M1362 1185q0 153-99.5 263.5t-258.5 136.5v175q0 14-9 23t-23 9h-135q-13 0-22.5-9.5t-9.5-22.5v-175q-66-9-127.5-31t-101.5-44.5-74-48-46.5-37.5-17.5-18q-17-21-2-41l103-135q7-10 23-12 15-2 24 9l2 2q113 99 243 125 37 8 74 8 81 0 142.5-43t61.5-122q0-28-15-53t-33.5-42-58.5-37.5-66-32-80-32.5q-39-16-61.5-25t-61.5-26.5-62.5-31-56.5-35.5-53.5-42.5-43.5-49-35.5-58-21-66.5-8.5-78q0-138 98-242t255-134v-180q0-13 9.5-22.5t22.5-9.5h135q14 0 23 9t9 23v176q57 6 110.5 23t87 33.5 63.5 37.5 39 29 15 14q17 18 5 38l-81 146q-8 15-23 16-14 3-27-7-3-3-14.5-12t-39-26.5-58.5-32-74.5-26-85.5-11.5q-95 0-155 43t-60 111q0 26 8.5 48t29.5 41.5 39.5 33 56 31 60.5 27 70 27.5q53 20 81 31.5t76 35 75.5 42.5 62 50 53 63.5 31.5 76.5 13 94z"></path>
            </svg>
          </span>
          <p style={{ marginLeft: '20%' }}><strong>TOTAL</strong></p>
        </div>
        <div className="data">
          <p>{esConvertido ? `$${montoConvertido.toFixed(2)}` : `C$${montoConvertido.toFixed(2)}`}</p> {/* Alterna entre moneda local y dólares */} 
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card {
    padding: 1rem;
    background-color: #fff;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    max-width: 320px;
    border-radius: 20px;
  }

  .title {
    display: flex;
    align-items: center;
  }

  .title span {
    position: relative;
    padding: 0.5rem;
    background-color: #10B981;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 9999px;
    cursor: pointer;
  }

  .title span svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #ffffff;
    height: 1rem;
  }

  p {
    text-align: center;
    color: black;
  }

  .data {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  .data p {
    margin-top: 1rem;
    margin-bottom: 1rem;
    color: #1F2937;
    font-size: 2.25rem;
    line-height: 2.5rem;
    font-weight: 700;
    text-align: center;
  }
`;

export default Card;
