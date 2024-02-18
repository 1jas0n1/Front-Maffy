import React from "react";
import { Bar, ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS


const BarChartComponent = ({ data }) => {
  return (
    <div className="container" style={{backgroundColor:"white",borderRadius:'3px'}} >
      <div className="row" >
        <div className="col-md-14" >
          <div   >
            <div className="card-body" >
              
              <div className="chart-container" style={{ width: '500px', height: '300px' }}>
                <ResponsiveContainer>
                  <BarChart
                    data={data}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5
                    }}
                  >
                    <CartesianGrid strokeDasharray="4 1 2" />
                    <XAxis dataKey="categoria" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="totalVendido" fill="blue"  />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarChartComponent;
