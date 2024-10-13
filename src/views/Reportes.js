import React, { useState, useEffect } from "react";
import MyNavbar from "../component/Navbar";
import Footer from "../component/footer/footer";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileInvoiceDollar } from '@fortawesome/free-solid-svg-icons';

import Card from "react-bootstrap/Card";
import axios from "axios";
import MonthlySalesChart from "../component/barMeses";
import BarChartComponent from "../component/barCharts";
import { FaFileInvoiceDollar } from "react-icons/fa6";
import { NavLink } from 'react-router-dom';
import { FaSackDollar } from "react-icons/fa6";
import { FaChartPie } from "react-icons/fa";


const ReportesVentas = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState({});
  const [selectedYear, setSelectedYear] = useState("2022");
  const [selectedYearCategories, setSelectedYearCategories] = useState("2022");
  const [totalVentas, setTotalVentas] = useState(null);
  const [totalVentasCategories, setTotalVentasCategories] = useState(null);
  const [barChartData, setBarChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://apimafy.zeabur.app/api/detalleventa/total-Cat/2024"
        );
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        setChartData(data);

        const categoriesResponse = await fetch(
          "https://apimafy.zeabur.app/api/categorias"
        );
        if (!categoriesResponse.ok) {
          throw new Error(
            `Error ${categoriesResponse.status}: ${categoriesResponse.statusText}`
          );
        }
        const categoriesData = await categoriesResponse.json();
        const categoriesMap = {};
        categoriesData.forEach((category) => {
          categoriesMap[category._id] = category.categoria;
        });
        setCategories(categoriesMap);

        const totalVentasResponse = await axios.get(
          `https://apimafy.zeabur.app/api/ventas/total/2024`
        );
        const { totalVentas } = totalVentasResponse.data;
        setTotalVentas(totalVentas);

        const totalVentasCategoriesResponse = await axios.get(
          `https://apimafy.zeabur.app/api/detalleventa/total-Cat/2022`
        );
        const { data: totalVentasCategoriesData } =
          totalVentasCategoriesResponse;
        setTotalVentasCategories(totalVentasCategoriesData);
        const chartData = {
          labels: totalVentasCategoriesData.map((item) => item._id),
          datasets: [
            {
              label: "Monto Vendido",
              data: totalVentasCategoriesData.map((item) => item.totalVendido),
              backgroundColor: "rgba(255,255,255,0.6)",
              borderColor: "rgba(255,255,255,0.6)",
              color: "white",
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
    return categories[categoryId] || "Categoría no encontrada";
  };

  if (loading) {
    return (
      <div style={loadingStyles.container}>
        <div style={loadingStyles.loadingBar}>
          <div style={loadingStyles.loadingProgress}></div>
        </div>
        <p style={loadingStyles.loadingText}>Cargando...</p>
      </div>
    );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const updatedChartData = chartData.map((item) => ({
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
      const response = await axios.get(
        `https://apimafy.zeabur.app/api/ventas/total/${selectedYear}`
      );
      const { totalVentas } = response.data;
      setTotalVentas(totalVentas);
    } catch (error) {
      console.error("Error al obtener el total de ventas", error);
    }
  };

  const handleSearchCategories = async () => {
    try {
      const response = await axios.get(
        `https://apimafy.zeabur.app/api/detalleventa/total-Cat/${selectedYearCategories}`
      );
      const { data } = response;
      setTotalVentasCategories(data);
      const chartData = {
        labels: data.map((item) => item._id),
        datasets: [
          {
            label: "Monto Vendido",
            data: data.map((item) => item.totalVendido),
            backgroundColor: "rgba(255,255,255,0.6)",
            borderColor: "rgba(255,255,255,0.6)",
            color: "white",
            borderWidth: 1,
          },
        ],
      };

      setBarChartData(chartData);
    } catch (error) {
      console.error(
        "Error al obtener el total de ventas por categorías",
        error
      );
    }
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "category",
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div
      style={{
        backgroundImage:
          "linear-gradient(to right top, #f9b7dc, #f9b5e0, #f8b3e4, #f7b1e8, #f5b0ed, #e3b9f8, #d2c1fe, #c3c8ff, #a8d7ff, #8ee5ff, #80f1ff, #89fbf4)",
      }}
    >
      <MyNavbar />

      <div className="d-flex justify-content-around" style={{ marginBottom: "20px" }}>
        
      <Card style={{ width: "30%", height: "400px", textAlign: "center" }}>
        <Card.Body>
          <NavLink to="/ruta-del-reporte-ventas" style={{ textDecoration: 'none', color: 'white' }}>
            
            <Card.Title>Reporte Ventas</Card.Title>
            <FaFileInvoiceDollar size={40} />
          </NavLink>
        </Card.Body>
      </Card>

      <Card style={{ width: "30%", height: "400px", textAlign: "center" }}>
        <Card.Body>
          <NavLink to="/ruta-del-reporte-ventas" style={{ textDecoration: 'none', color: 'white' }}>
          <Card.Title>Reporte Compras</Card.Title>
          <FaSackDollar size={40} />
          </NavLink>
        </Card.Body>
      </Card>

      <Card style={{ width: "30%", height: "400px", textAlign: "center" }}>
        <Card.Body>
          <NavLink to="/ruta-del-reporte-ventas" style={{ textDecoration: 'none', color: 'white' }}>
          <Card.Title>Reporte Ganancias </Card.Title>
          <FontAwesomeIcon icon={faFileInvoiceDollar} bounce size="10x" style={{ color: "#74C0FC" }} />

          </NavLink>
        </Card.Body>
      </Card>

      </div>

      <div className="d-flex vh-50">
        <Card
          style={{
            width: "29rem",
            height: "400px",
            margin:"0 auto",
            order: 1,
          }}
        >
          <Card.Body style={{ textAlign: "center" }}>
            <Card.Title style={{ textAlign: "center" }}>Reporte </Card.Title>
          </Card.Body>
        </Card>

        <Card
          style={{
            width: "52rem",
           
            marginBottom:"5%",
            color: "white",
            order: 2,
          }}
        >
          <Card.Body style={{ color: "white" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <p
                style={{
                  textAlign: "center",
                  fontSize: "18px",
                  margin: "0 auto",
                }}
              >
                Ventas por categorías
              </p>
            </div>
            {totalVentasCategories !== null && (
              <div style={{ color: "white" }}>
                <div style={{ marginTop: "15px", color: "white" }}>
                  <BarChartComponent data={updatedChartData} />
                </div>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>

      <Card
        style={{
          width: "79rem",
          margin:"0 auto",
          order: 3,
          textAlign: "center",
        }}
      >
        <Card.Title>Ventas Mensuales 2024</Card.Title>
        <Card.Body
          style={{
            color: "white",
            backgroundColor: "white",
            borderRadius: "3px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <MonthlySalesChart />
          </div>
        </Card.Body>
      </Card>

      <Footer />
    </div>
  );
};

const loadingStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    color: '#333',
  },
  loadingBar: {
    width: '50%',
    height: '20px',
    backgroundColor: '#ddd',
    borderRadius: '5px',
    overflow: 'hidden',
  },
  loadingProgress: {
    width: '100%',
    height: '100%',
    backgroundColor: '#4caf50',
    animation: 'loading 2s infinite',
  },
  loadingText: {
    marginTop: '10px',
    fontSize: '18px',
  },
};

export default ReportesVentas;
