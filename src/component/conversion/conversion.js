import React, { useState } from 'react';
import Modal from 'react-modal';
import './conversion.css'; // Ajusta el nombre del archivo CSS según sea necesario
import { FaCircleDollarToSlot } from "react-icons/fa6";

Modal.setAppElement('#root'); // Asegúrate de que se establezca el elemento raíz del modal

const Convertion = () => {
  const [modalIsOpenC, setModalIsOpenC] = useState(false);
  const [modalIsOpenD, setModalIsOpenD] = useState(false);
  const [valueC, setValueC] = useState(0);
  const [valueD, setValueD] = useState(0);

  const openModalC = () => {
    setModalIsOpenC(true);
  };

  const openModalD = () => {
    setModalIsOpenD(true);
  };

  const closeModalC = () => {
    setModalIsOpenC(false);
  };

  const closeModalD = () => {
    setModalIsOpenD(false);
  };

  return (
    <div className="social">
      <ul>
        <li>
          <button style={{ paddingRight: '50px', color: 'white' }} onClick={openModalC}>
            <span>C$</span>
          </button>
          <Modal
            isOpen={modalIsOpenC}
            onRequestClose={closeModalC}
            contentLabel="Currency Modal C$"
            className="Modal"
            overlayClassName="Overlay"
          >
            <Modal.Header>
              <h2>Currency Modal C$</h2>
            </Modal.Header>
            <Modal.Body>
              <form>
                <label>
                  C$ Amount:
                  <input type="number" value={valueC} onChange={(e) => setValueC(e.target.value)} />
                </label>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <button onClick={closeModalC}>Close</button>
            </Modal.Footer>
          </Modal>
        </li>
        <li>
          <button style={{ padding: '0', color: 'white' }} onClick={openModalD}>
            <span>$</span>
          </button>
          <Modal
            isOpen={modalIsOpenD}
            onRequestClose={closeModalD}
            contentLabel="Currency Modal $"
            className="Modal"
            overlayClassName="Overlay"
          >
            <Modal.Header>
              <h2>Currency Modal $</h2>
            </Modal.Header>
            <Modal.Body>
              <form>
                <label>
                  $ Amount:
                  <input type="number" value={valueD} onChange={(e) => setValueD(e.target.value)} />
                </label>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <button onClick={closeModalD}>Close</button>
            </Modal.Footer>
          </Modal>
        </li>
      </ul>
    </div>
  );
};

export default Convertion;
