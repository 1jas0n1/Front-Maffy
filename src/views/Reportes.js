import React, { useState } from 'react';
import MyNavbar from '../component/Navbar';
import Footer from '../component/footer/footer';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';

const ReportesVentas = () => {
  const [selectedYear, setSelectedYear] = useState('2022');
  const [selectedYearCategories, setSelectedYearCategories] = useState('2022');
  const [totalVentas, setTotalVentas] = useState(null);
  const [totalVentasCategories, setTotalVentasCategories] = useState(null);
  const [barChartData, setBarChartData] = useState(null);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleYearChangeCategories = (event) => {
    setSelectedYearCategories(event.target.value);
  };

  const handleGetTotal = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/ventas/total/${selectedYear}`);
      const { totalVentas } = response.data;
      setTotalVentas(totalVentas);
    } catch (error) {
      console.error('Error al obtener el total de ventas', error);
    }
  };

  const handleSearchCategories = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/detalleventa/total-Cat/${selectedYearCategories}`);
      const { data } = response;

      setTotalVentasCategories(data);

      // Prepare data for the bar chart
      const chartData = {
        labels: data.map(item => item._id),
        datasets: [
          {
            label: 'Monto Vendido',
            data: data.map(item => item.totalVendido),
            backgroundColor: 'rgba(75,192,192,0.6)',
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 1,
          },
        ],
      };
      

      setBarChartData(chartData);
    } catch (error) {
      console.error('Error al obtener el total de ventas por categorías', error);
    }
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'category', // Ensure the type is 'category' for x-axis
      },
      y: {
        beginAtZero: true,
      },
    },
  };
  

  return (
    <div>
      <MyNavbar />
      <h2 style={{ color: 'black', fontSize: '35px' }}>Reportes de Ventas</h2>

      <div className="d-flex  vh-50">
        <Card style={{ width: '18rem', marginLeft: '5%' }}>
          <Card.Body>
            <Card.Title style={{ textAlign: 'center' }}>Ventas</Card.Title>
            <Form.Group controlId="selectYear">
              <Form.Label>Selecciona el año:</Form.Label>
              <Form.Control as="select" value={selectedYear} onChange={handleYearChange}>
                <option>2022</option>
                <option>2023</option>
                <option>2024</option>
              </Form.Control>
            </Form.Group>

            <button
              style={{
                width: '120px',
                height: '60px',
                backgroundColor: 'red',
                color: 'white',
                borderRadius: '5px',
                marginTop: '15px',
                marginLeft: '25%',
              }}
              onClick={handleGetTotal}
            >
              Obtener Total
            </button>

            {totalVentas !== null && (
              <div style={{ marginTop: '15px', textAlign: 'center' }}>
                <label>Total: {totalVentas}</label>
              </div>
            )}
          </Card.Body>
        </Card>
        <Card style={{ width: '45rem', marginLeft: '5%' }}>
          <Card.Body>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              {/* Removed the original button */}
              {/* New Form for selecting years for categories */}
              <Form.Group controlId="selectYearCategories" style={{ display: 'flex', alignItems: 'center' }}>
                <Form.Label style={{ marginRight: '10px' }}>Selecciona el año:</Form.Label>
                <Form.Control as="select" value={selectedYearCategories} onChange={handleYearChangeCategories}>
                  <option>2022</option>
                  <option>2023</option>
                  <option>2024</option>
                </Form.Control>
                {/* Search button with lupa icon */}
                <button
                  style={{
                    width: '30px',
                    height: '30px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onClick={handleSearchCategories}
                >
                  <FaSearch size={20} color="black" />
                </button>
              </Form.Group>
              <p style={{ textAlign: 'center', fontSize: '18px', margin: '0 auto' }}>
                Ventas por categorías
              </p>
            </div>
            {totalVentasCategories !== null && (
        <div>
          <label>Total categorías:</label>
          <pre>{JSON.stringify(totalVentasCategories, null, 2)}</pre>
          {/* Bar chart */}
          <div style={{ marginTop: '15px' }}>
            <Bar data={barChartData} options={options} />
          </div>
        </div>
      )}
       
          </Card.Body>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default ReportesVentas;
