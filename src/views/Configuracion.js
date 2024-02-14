import React, { Component } from 'react';
import axios from 'axios';
import '../css/ConfigView.css';
import Navbar from '../component/Navbar';
import Footer from '../component/footer/footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


class ConfigView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      nombre_negocio: '',
      direccion: '',
      correo_electronico: '',
      telefono_1: '',
      telefono_2: '',
      eslogan: '',
      tipo_de_cambio_dolar: '',
    };

    // Bind the handleChange method to the class
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    if (this.state.isEditing) {
      this.fetchData();
    }
  }

  fetchData() {
    axios.get('http://localhost:4000/api/configuracion')
      .then(response => {
        const configData = response.data.data[0];

        this.setState({
          id: configData._id,
          nombre_negocio: configData.nombre_negocio || '',
          direccion: configData.direccion || '',
          correo_electronico: configData.correo_electronico || '',
          telefono_1: configData.telefono_1 || '',
          telefono_2: configData.telefono_2 || '',
          eslogan: configData.eslogan || '',
          tipo_de_cambio_dolar: configData.tipo_de_cambio_dolar || '',
        });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  handleEditClick = () => {
    this.setState({ isEditing: true }, () => {
      this.fetchData();
    });
  };

  handleSaveClick = () => {
    const { id, nombre_negocio, direccion, correo_electronico, telefono_1, telefono_2, eslogan, tipo_de_cambio_dolar } = this.state;

    const newData = {
      nombre_negocio,
      direccion,
      correo_electronico,
      telefono_1,
      telefono_2,
      eslogan,
      tipo_de_cambio_dolar,
    };

    axios.put(`http://localhost:4000/api/configuracion/${id}`, newData)
      .then(response => {
        console.log('Data updated successfully:', response.data);
        this.setState({ isEditing: false });
        toast.success('Cambios guardados correctamente', { position: toast.POSITION.TOP_CENTER });
      })
      .catch(error => {
        toast.error('Complete todos los campos', { position: toast.POSITION.TOP_CENTER });
        console.error('Error updating data:', error);
        toast.error('Error al guardar cambios');
      });
  };


  render() {
    return (
      <div className="config-container" style={{backgroundImage:'linear-gradient(to right top, #80285a, #742a62, #652d69, #54306e, #3f3371, #323d7a, #204781, #005086, #006290, #007393, #008391, #04928b)',}} >
        <Navbar />
        <h1 className="config-title" style={{color:'white'}}>Configuracion</h1>
        <div className="config-grid">
          <form className="config-form">
            <div className="config-column">
              <label style={{fontSize:'25px',color:'white'}} htmlFor="nombre_negocio">Nombre del Negocio</label>
              <input 
                type="text"
                id="nombre_negocio"
                name="nombre_negocio"
                value={this.state.isEditing ? this.state.nombre_negocio : ''}
                className="config-input campos"
                style={{textAlign:'center',fontSize:'20px',borderRadius:'5px'}}
                readOnly={!this.state.isEditing}
                onChange={this.handleChange}
              />

              <label style={{fontSize:'25px',color:'white'}} className="campos" htmlFor="direccion">Dirección</label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={this.state.isEditing ? this.state.direccion : ''}
                className="config-input campos"
                style={{textAlign:'center',fontSize:'20px',borderRadius:'5px'}}
                readOnly={!this.state.isEditing}
                onChange={this.handleChange}
              />

              <label style={{fontSize:'25px',color:'white',borderRadius:'5px'}} className="campos" htmlFor="correo_electronico">Correo Electrónico</label>
              <input
                type="text"
                id="correo_electronico"
                name="correo_electronico"
                value={this.state.isEditing ? this.state.correo_electronico : ''}
                className="config-input campos"
                style={{textAlign:'center',fontSize:'20px',borderRadius:'5px'}}
                readOnly={!this.state.isEditing}
                onChange={this.handleChange}
              />

              <label style={{fontSize:'25px',color:'white'}} className="campos" htmlFor="telefono_1">Teléfono 1</label>
              <input
                type="text"
                id="telefono_1"
                name="telefono_1"
                value={this.state.isEditing ? this.state.telefono_1 : ''}
                className="config-input campos"
                style={{textAlign:'center',fontSize:'20px',borderRadius:'5px'}}
                readOnly={!this.state.isEditing}
                onChange={this.handleChange}
              />
            </div>

            <div className="config-column">
              <label style={{fontSize:'25px',color:'white'}} className="campos" htmlFor="telefono_2">Teléfono 2</label>
              <input
                type="text"
                id="telefono_2"
                name="telefono_2"
                value={this.state.isEditing ? this.state.telefono_2 : ''}
                className="config-input campos"
                style={{textAlign:'center',fontSize:'20px',borderRadius:'5px'}}
                readOnly={!this.state.isEditing}
                onChange={this.handleChange}
              />

              <label style={{fontSize:'25px',color:'white'}} htmlFor="eslogan">Eslogan</label>
              <input
                type="text"
                id="eslogan"
                name="eslogan"
                value={this.state.isEditing ? this.state.eslogan : ''}
                className="config-input campos"
                style={{textAlign:'center',fontSize:'20px',borderRadius:'5px'}}
                readOnly={!this.state.isEditing}
                onChange={this.handleChange}
              />

              <label style={{fontSize:'25px',color:'white'}} className='etiqueta' htmlFor="tipo_de_cambio_dolar">Tipo de Cambio Dólar</label>
              <input
                type="text"
                id="tipo_de_cambio_dolar"
                name="tipo_de_cambio_dolar"
                value={this.state.isEditing ? this.state.tipo_de_cambio_dolar : ''}
                className="config-input campos"
                readOnly={!this.state.isEditing}
                style={{textAlign:'center',fontSize:'20px',borderRadius:'5px'}}
                onChange={this.handleChange}
              />
            </div>
          </form>
        </div>
        <button type="button" className="config-button" onClick={this.handleSaveClick} disabled={!this.state.isEditing}>
          Guardar
        </button>
        <button type="button" className="edit-button" onClick={this.handleEditClick} disabled={this.state.isEditing}>
          Editar
        </button>
        <Footer />
        <ToastContainer />
      </div>
    );
  }
}

export default ConfigView;
