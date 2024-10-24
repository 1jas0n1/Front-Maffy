import React, { useState, useEffect } from "react";
import MyNavbar from "../component/Navbar";
import Footer from "../component/footer/footer";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileInvoiceDollar,faMoneyCheckDollar,faCoins } from '@fortawesome/free-solid-svg-icons';
import {  Button } from 'react-bootstrap'; 
import Card from "react-bootstrap/Card";
import axios from "axios";
import MonthlySalesChart from "../component/barMeses";
import BarChartComponent from "../component/barCharts";
import { NavLink } from 'react-router-dom';
import Loader from "../component/Loader"


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
    return <Loader />; 
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
    <div>
      <MyNavbar />

      <div className="d-flex justify-content-around" style={{ marginBottom: "20px" }}>
        
      <Card style={{ width: "30%", height: "400px", textAlign: "center" }}>
      <Card.Body style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Card.Title>Reporte Compras</Card.Title>
          <FontAwesomeIcon icon={faCoins} size="10x" bounce style={{color: "#FFD43B",}} />
        </div>
        <NavLink to="/ReporteCompras" style={{ textDecoration: 'none' }}>
          <Button variant="primary" style={{ marginTop: 'auto', width: '150px', height:'50px' }}>
            Generar Reporte
          </Button>
        </NavLink>
      </Card.Body>
    </Card>

      <Card style={{ width: "30%", height: "400px", textAlign: "center" }}>
      <Card.Body style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Card.Title>Reporte Ventas</Card.Title>
          <FontAwesomeIcon icon={faMoneyCheckDollar} size="10x" bounce style={{color: "#fafafa",}} />
        </div>
        <NavLink to="/ReporteVentas" style={{ textDecoration: 'none' }}>
          <Button variant="primary" style={{ marginTop: 'auto', width: '150px', height:'50px' }}>
            Generar Reporte
          </Button>
        </NavLink>
      </Card.Body>
    </Card>

      <Card style={{ width: "30%", height: "400px", textAlign: "center" }}>
      <Card.Body style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Card.Title>Reporte Servicios</Card.Title>
          <FontAwesomeIcon icon={faFileInvoiceDollar} bounce size="10x" style={{ color: "#74C0FC" }} />
        </div>
        <NavLink to="/ReporteServicios" style={{ textDecoration: 'none' }}>
          <Button variant="primary" style={{ marginTop: 'auto', width: '150px', height:'50px' }}>
            Generar Reporte
          </Button>
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
           
            marginBottom:"10%",
            color: "white",
            order: 2,
          }}
        >
          <Card.Body style={{ color: "white" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderRadius:"10%",
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



export default ReportesVentas;