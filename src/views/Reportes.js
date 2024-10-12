import React, { useState,useEffect } from 'react';
import MyNavbar from '../component/Navbar';
import Footer from '../component/footer/footer';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

import MonthlySalesChart from '../component/barMeses';
import BarChartComponent from '../component/barCharts';

const ReportesVentas = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState({});
  const [selectedYear, setSelectedYear] = useState('2022');
  const [selectedYearCategories, setSelectedYearCategories] = useState('2022');
  const [totalVentas, setTotalVentas] = useState(null);
  const [totalVentasCategories, setTotalVentasCategories] = useState(null);
  const [barChartData, setBarChartData] = useState(null);


 
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data for the first chart
        const response = await fetch("https://apimafy.zeabur.app/api/detalleventa/total-Cat/2024");
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        setChartData(data);
  
        const categoriesResponse = await fetch("https://apimafy.zeabur.app/api/categorias");
        if (!categoriesResponse.ok) {
          throw new Error(`Error ${categoriesResponse.status}: ${categoriesResponse.statusText}`);
        }
        const categoriesData = await categoriesResponse.json();
        const categoriesMap = {};
        categoriesData.forEach(category => {
          categoriesMap[category._id] = category.categoria;
        });
        setCategories(categoriesMap);
  
        // Set totalVentas for the first card
        const totalVentasResponse = await axios.get(`https://apimafy.zeabur.app/api/ventas/total/2024`);
        const { totalVentas } = totalVentasResponse.data;
        setTotalVentas(totalVentas);
  
        // Fetch data for the second chart
        const totalVentasCategoriesResponse = await axios.get(`https://apimafy.zeabur.app/api/detalleventa/total-Cat/2022`);
        const { data: totalVentasCategoriesData } = totalVentasCategoriesResponse;
        setTotalVentasCategories(totalVentasCategoriesData);
        const chartData = {
          labels: totalVentasCategoriesData.map(item => item._id),
          datasets: [
            {
              label: 'Monto Vendido',
              data: totalVentasCategoriesData.map(item => item.totalVendido),
              backgroundColor: 'rgba(255,255,255,0.6)',
              borderColor: 'rgba(255,255,255,0.6)',
              color:'white',
              borderWidth: 1,
            },
          ],
        };
        setBarChartData(chartData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  const getCategoryById = (categoryId) => {
    return categories[categoryId] || "Categoría no encontrada"; // Manejar el caso cuando la categoría no está disponible
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  // Reemplazar el _id con la categoría correspondiente en la tabla
  const updatedChartData = chartData.map(item => ({
    ...item,
    categoria: getCategoryById(item._id),
  }));
 
  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleYearChangeCategories = (event) => {
    setSelectedYearCategories(event.target.value);
  };

  const handleGetTotal = async () => {
    try {
      const response = await axios.get(`https://apimafy.zeabur.app/api/ventas/total/${selectedYear}`);
      const { totalVentas } = response.data;
      setTotalVentas(totalVentas);
    } catch (error) {
      console.error('Error al obtener el total de ventas', error);
    }
  };

  const handleSearchCategories = async () => {
    try {
      const response = await axios.get(`https://apimafy.zeabur.app/api/detalleventa/total-Cat/${selectedYearCategories}`);
      const { data } = response;
      setTotalVentasCategories(data);
      const chartData = {
        labels: data.map(item => item._id),
        datasets: [
          {
            label: 'Monto Vendido',
            data: data.map(item => item.totalVendido),
            backgroundColor: 'rgba(255,255,255,0.6)',
            borderColor: 'rgba(255,255,255,0.6)',
            color:'white',
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
    <div style={{ backgroundImage: 'linear-gradient(to right top, #f9b7dc, #f9b5e0, #f8b3e4, #f7b1e8, #f5b0ed, #e3b9f8, #d2c1fe, #c3c8ff, #a8d7ff, #8ee5ff, #80f1ff, #89fbf4)'}}>
      <MyNavbar />
      <h2 style={{ color: 'black', fontSize: '35px' }}>Reportes de Ventas</h2>

      <div className="d-flex vh-50">
        <Card style={{ width: '18rem' ,height:'400px', marginLeft: '5%',order:1  }}>
          <Card.Body style={{textAlign:'center'}}>
            <Card.Title style={{ textAlign: 'center' }}>Ventas 2024</Card.Title>

          

            {totalVentas !== null && (
              <div style={{ marginTop: '15px', textAlign: 'center' }}>
                <label>Total: C${totalVentas}</label>
              </div>
            )}


            <Card.Title>Semana</Card.Title>
            <p>Total : C$ </p>
           

            <Card.Title>Hoy</Card.Title>
            <p>Total : C$ </p>
          </Card.Body>
        </Card>

       


        <Card style={{ width: '52.5rem', marginLeft: '5%',color:'white',order:2 }}>
          <Card.Body style={{color:'white'}}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
             
              <p style={{ textAlign: 'center', fontSize: '18px', margin: '0 auto' }}>
                Ventas por categorías
              </p>
            </div >
            {totalVentasCategories !== null && (
        <div style={{color:'white'}} >
        
        
        
          <div style={{ marginTop: '15px',color:'white' }}>
          <BarChartComponent data={updatedChartData}  />
          </div>
        </div>
      )}
       
          </Card.Body>
        </Card>
        </div>

        <Card style={{ width: '75rem', marginLeft: '5%',order:3,textAlign:'center' }}>
          <Card.Title>Ventas Mensuales 2024</Card.Title>
          <Card.Body style={{ color: 'white',backgroundColor:'white', borderRadius:'3px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width:'100%'}}>
              <MonthlySalesChart />
            </div>
          </Card.Body>
        </Card>




      

      <Footer />
    </div>
  );
};

export default ReportesVentas;
