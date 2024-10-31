import styled from 'styled-components';
import { Button, Modal } from 'react-bootstrap';
import DataTable from 'react-data-table-component';

export const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;


`;

export const StyledDataTable = styled(DataTable)`
  border: 2px solid #333;
  border-radius: 3px;
  width: 90%;
  margin-bottom: 5px;
`;

export const ActionButton = styled.button`
  background-color: ${(props) => (props.update ? '#4CAF50' : '#f44336')};
  color: #fff;
  border: none;
  padding: 8px 16px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 12px;
  margin:2px;
  cursor: pointer;
  border-radius: 4px;
  width: 75px;
  height: 35px;
`;

export const CreateButton = styled(Button)`
  margin-top: 20px;
  margin-bottom: 20px;
  background-color:darkred;
  width: 110px;
  height: 60px;
`;
export const StyledModal = styled(Modal)`
  .modal-content {
    background-color: #4a4a4a;
    color: white;
    text-align: center;
    width:450px;
    padding: 10px 10px 10px 10px;
    margin: 10px 10px 10px 10px;
  }
`;

export const ModalFooter = styled(Modal.Footer)`
  .otros {
    width: 150px;  // Adjust the width as needed
    height: 60px;  // Adjust the height as needed
  }
`;


export const PrintButton = styled.button`
  background-color: ${(props) => (props.update ? '#FF8066' : '#FF8066')};
  
  color: #fff;
  border: none;

  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 18px;
  margin: 4px 2px;
  cursor: pointer;
  
  border-radius: 4px;
  width: 40px;
  height: 40px;
`;