import React, { useState, useEffect } from 'react';
import { CContainer, CRow, CCol, CCard, CCardBody, CCardHeader, CWidgetStatsF } from '@coreui/react';
import { CChartLine } from '@coreui/react-chartjs';
import '@coreui/coreui/dist/css/coreui.min.css';

// IMPORTANT: Replace this with your live backend URL from Part 2
const API_URL = 'http://localhost:8000/api/assessment'; 
// Example Live URL: 'https://sap-cockpit-backend.onrender.com/api/assessment'

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the backend API
    fetch(API_URL)
     .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok. Is the backend running?');
        }
        return response.json();
      })
     .then(data => setData(data))
     .catch(error => {
        console.error("Error fetching data:", error);
        setError(`Failed to load data from ${API_URL}. Please check the backend server.`);
      });
  }, []); // Empty dependency array means this effect runs once on mount

  // Function to determine the color of the score widget
  const getScoreColor = (score) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    return 'danger';
  };

  // Render a loading state
  if (error) {
    return <div className="p-4 text-center text-danger bg-light" style={{minHeight: '100vh'}}>
        <h4 className="mt-5">Connection Error</h4>
        <p>{error}</p>
    </div>;
  }

  // Render an error state
  if (!data) {
    return <div className="p-4 text-center text-muted bg-light" style={{minHeight: '100vh'}}>
        <h4 className="mt-5">Loading SAP Landscape Data...</h4>
    </div>;
  }

  // Render the main dashboard
  return (
    <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <CContainer fluid className="p-4">
        <h2 className="mb-4 text-dark">SAP Landscape Intelligence Cockpit</h2>
        
        {/* Score Gauges for each pillar */}
        <CRow className="mb-4">
          {Object.entries(data.summary).map(([key, value]) => (
            <CCol xs={12} sm={6} lg key={key} className="mb-3">
              <CWidgetStatsF
                className="h-100 shadow-sm border-0"
                color={getScoreColor(value.score)}
                padding={false}
                title={<div className="text-white p-3">{value.title}</div>}
                value={<div className="text-white p-3 fs-2">{`${value.score}%`}</div>}
              />
            </CCol>
          ))}
        </CRow>

        <CRow>
          {/* Historical Trend Chart */}
          <CCol md={7} className="mb-4">
            <CCard className="h-100 shadow-sm border-0">
              <CCardHeader>Overall Health Trend (12 Months)</CCardHeader>
              <CCardBody>
                <CChartLine
                  data={{
                    labels: data.historicalTrend.labels,
                    datasets: [
                      {
                        label: 'Overall Health Score',
                        backgroundColor: 'rgba(50, 150, 250, 0.1)',
                        borderColor: 'rgba(50, 150, 250, 1)',
                        pointBackgroundColor: 'rgba(50, 150, 250, 1)',
                        pointBorderColor: '#fff',
                        data: data.historicalTrend.data,
                        fill: true,
                        tension: 0.4
                      },
                    ],
                  }}
                />
              </CCardBody>
            </CCard>
          </CCol>

          {/* Top 5 Critical Risks Table */}
          <CCol md={5} className="mb-4">
            <CCard className="h-100 shadow-sm border-0">
              <CCardHeader>Top 5 Critical Risks</CCardHeader>
              <CCardBody>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Risk</th>
                        <th>System</th>
                        <th className="text-end">Priority</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.topRisks.map(risk => (
                        <tr key={risk.id}>
                          <td>
                            <div>{risk.title}</div>
                            <small className="text-muted">{risk.category}</small>
                          </td>
                          <td><span className="badge bg-secondary-light text-dark">{risk.system}</span></td>
                          <td className="text-end fw-bold text-danger">{risk.priorityScore}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Dashboard;