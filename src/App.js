import React, { useState } from 'react';
import { CContainer, CRow, CCol, CCard, CCardBody, CCardHeader, CWidgetStatsF } from '@coreui/react';
import { CChartLine } from '@coreui/react-chartjs';
import { Database, FileUp, PlayCircle, LayoutDashboard, ChevronLeft, Building, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import '@coreui/coreui/dist/css/coreui.min.css';

// --- Mock Database ---
// In a real application, this data would come from a PostgreSQL database.
// For this prototype, we simulate it here to demonstrate multi-customer functionality.
const customerData = {
  'cust_101': {
    name: 'Global Trade Corp.',
    summary: {
      landscapeArchitecture: { title: "Landscape Architecture", score: 78 },
      techops: { title: "TechOps", score: 85 },
      observability: { title: "Observability", score: 65 },
      businessResiliency: { title: "Business Resiliency", score: 92 },
      securityCompliance: { title: "Security Compliance", score: 71 }
    },
    historicalTrend: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      data: [65, 68, 72, 70, 75, 78, 80, 82, 81, 79, 85, 88]
    },
    topRisks: [
      { id: 1, title: "Unencrypted RFC Connections", category: "Security Compliance", system: "ECC-PRD", priorityScore: 95 },
      { id: 2, title: "Missing Critical Security Notes", category: "Security Compliance", system: "S4H-PRD", priorityScore: 91 },
      { id: 3, title: "Low DB Memory Allocation", category: "Observability", system: "BW-HANA", priorityScore: 88 },
      { id: 4, title: "Untested DR Plan", category: "Business Resiliency", system: "ECC-PRD", priorityScore: 85 },
      { id: 5, title: "Hardcoded Credentials in Z-Code", category: "Security Compliance", system: "ECC-DEV", priorityScore: 82 }
    ]
  },
  'cust_102': {
    name: 'Innovate Pharma Inc.',
    summary: {
      landscapeArchitecture: { title: "Landscape Architecture", score: 91 },
      techops: { title: "TechOps", score: 76 },
      observability: { title: "Observability", score: 88 },
      businessResiliency: { title: "Business Resiliency", score: 81 },
      securityCompliance: { title: "Security Compliance", score: 94 }
    },
    historicalTrend: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      data: [80, 82, 85, 83, 88, 86, 89, 90, 92, 91, 93, 94]
    },
    topRisks: [
      { id: 1, title: "Default SAP* User Active", category: "Security Compliance", system: "S4H-PRD", priorityScore: 98 },
      { id: 2, title: "Outdated Kernel Version", category: "TechOps", system: "PO-PRD", priorityScore: 89 },
      { id: 3, title: "Database Log Mode Not ARCHIVELOG", category: "Business Resiliency", system: "ECC-PRD", priorityScore: 87 },
      { id: 4, "title": "Inefficient SQL in Custom Report", "category": "Observability", "system": "S4H-PRD", "priorityScore": 84 },
      { id: 5, "title": "Network ACLs Too Permissive", "category": "Landscape Architecture", "system": "AWS-VPC", "priorityScore": 80 }
    ]
  }
};

// --- Components ---

const CustomerSelector = ({ customerId, setCustomerId }) => {
  return (
    <div className="position-absolute top-0 end-0 p-3" style={{ zIndex: 1050 }}>
      <div className="input-group">
        <span className="input-group-text bg-light border-0"><Building size={18} /></span>
        <select
          className="form-select"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          aria-label="Select Customer"
        >
          {Object.keys(customerData).map(id => (
            <option key={id} value={id}>{customerData[id].name}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

const MainHub = ({ setPage }) => {
  const Tile = ({ icon, title, description, onClick }) => (
    <CCol md={4}>
      <CCard 
        className="h-100 text-center shadow-sm hub-tile" 
        onClick={onClick}
        style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
      >
        <CCardBody className="d-flex flex-column justify-content-center align-items-center p-4">
          <div className="mb-3 text-primary">{icon}</div>
          <h5 className="card-title">{title}</h5>
          <p className="card-text text-muted">{description}</p>
        </CCardBody>
      </CCard>
    </CCol>
  );

  return (
    <CContainer style={{ paddingTop: '80px' }}>
      <div className="text-center mb-5">
        <h1 className="display-5">SAP Intelligence Cockpit</h1>
        <p className="lead text-muted">Your central hub for landscape assessment and optimization.</p>
      </div>
      <CRow className="g-4">
        <Tile
          icon={<Database size={48} />}
          title="Data Collection"
          description="Manage and input your SAP landscape data through guided manual uploads or automated discovery."
          onClick={() => setPage('dataCollection')}
        />
        <Tile
          icon={<PlayCircle size={48} />}
          title="Analysis & Reports"
          description="Trigger analysis on collected data, review findings, and access historical assessment reports."
          onClick={() => setPage('analysis')}
        />
        <Tile
          icon={<LayoutDashboard size={48} />}
          title="Intelligence Dashboard"
          description="Visualize the health of your landscape, track trends, and drill down into critical risks."
          onClick={() => setPage('dashboard')}
        />
      </CRow>
      <style>{`
        .hub-tile:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
        }
      `}</style>
    </CContainer>
  );
};

const DataCollection = ({ setPage }) => {
    const [activeTab, setActiveTab] = useState('manual');

    return (
        <CContainer className="py-4">
            <button onClick={() => setPage('hub')} className="btn btn-link mb-3 p-0">
                <ChevronLeft size={16} className="me-1" /> Back to Hub
            </button>
            <h2>Data Collection</h2>
            <p className="text-muted">Provide the necessary data for analysis. Choose your preferred method.</p>
            
            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'manual' ? 'active' : ''}`} onClick={() => setActiveTab('manual')}>
                        Guided Manual Upload
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'automated' ? 'active' : ''}`} onClick={() => setActiveTab('automated')}>
                        Automated Discovery
                    </button>
                </li>
            </ul>

            {activeTab === 'manual' && (
                <CCard>
                    <CCardBody>
                        <h5>Step 1: Select Assessment Area</h5>
                        <select className="form-select mb-4">
                            <option>1. LANDSCAPE ARCHITECTURE</option>
                            <option>2. TECHOPS</option>
                            <option>3. OBSERVABILITY</option>
                            <option>4. BUSINESS RESILIENCY</option>
                            <option>5. SECURITY COMPLIANCE</option>
                        </select>

                        <h5>Step 2: Provide Required Data</h5>
                        <div className="p-3 border rounded">
                            <h6>RFC Connection Analysis</h6>
                            <p className="text-muted small">Upload a CSV export of all RFC destinations from your system.</p>
                            <div className="mb-3">
                                <label className="form-label fw-bold">How-to Guide:</label>
                                <div className="p-3 bg-light rounded small">
                                    <ol className="mb-0 ps-3">
                                        <li>Log in to your SAP system.</li>
                                        <li>Go to transaction <strong>SE16</strong>.</li>
                                        <li>Enter table name <strong>RFCDES</strong> and execute.</li>
                                        <li>Export the resulting list as a CSV file.</li>
                                    </ol>
                                </div>
                            </div>
                            <div className="d-flex align-items-center p-4 border-2 border-dashed rounded text-center">
                                <FileUp size={40} className="text-muted me-3" />
                                <div>
                                    <span className="fw-bold text-primary">Click to upload</span> or drag and drop
                                    <p className="small text-muted mb-0">CSV, XLS, or XLSX files</p>
                                </div>
                            </div>
                        </div>
                    </CCardBody>
                </CCard>
            )}

            {activeTab === 'automated' && (
                <CCard>
                    <CCardBody>
                        <h5>Configure Discovery Agent</h5>
                        <p className="text-muted">Provide secure, read-only credentials for the agent to connect to your landscape.</p>
                        <div className="row g-3">
                            <div className="col-md-6"><input className="form-control" placeholder="System ID (SID)" /></div>
                            <div className="col-md-6"><input className="form-control" placeholder="Hostname or IP Address" /></div>
                            <div className="col-md-6"><input className="form-control" placeholder="Instance Number" /></div>
                            <div className="col-md-6"><input className="form-control" placeholder="Client" /></div>
                            <div className="col-md-6"><input className="form-control" placeholder="Read-only SAP User" /></div>
                            <div className="col-md-6"><input className="form-control" type="password" placeholder="Password" /></div>
                        </div>
                        <button className="btn btn-primary mt-3">
                            <PlayCircle size={16} className="me-2" /> Start Discovery
                        </button>
                    </CCardBody>
                </CCard>
            )}
        </CContainer>
    );
};

const Analysis = ({ setPage }) => {
    const analysisRuns = [
        { id: 'run_001', date: '2025-08-08', status: 'Completed', findings: 12, score: 88, icon: <CheckCircle className="text-success" /> },
        { id: 'run_002', date: '2025-07-15', status: 'Completed', findings: 15, score: 85, icon: <CheckCircle className="text-success" /> },
        { id: 'run_003', date: '2025-06-20', status: 'Completed with Warnings', findings: 21, score: 79, icon: <AlertTriangle className="text-warning" /> },
        { id: 'run_004', date: '2025-05-10', status: 'Failed', findings: 0, score: 0, icon: <XCircle className="text-danger" /> },
    ];

    return (
        <CContainer className="py-4">
            <button onClick={() => setPage('hub')} className="btn btn-link mb-3 p-0">
                <ChevronLeft size={16} className="me-1" /> Back to Hub
            </button>
            <h2>Analysis & Reports</h2>
            <p className="text-muted">Review past analysis runs or trigger a new one.</p>
            <button className="btn btn-primary mb-4">
                <PlayCircle size={16} className="me-2" /> Trigger New Full Analysis
            </button>
            <CCard>
                <CCardHeader>Historical Analysis Runs</CCardHeader>
                <CCardBody>
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Run ID</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th className="text-end">Findings</th>
                                    <th className="text-end">Overall Score</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analysisRuns.map(run => (
                                    <tr key={run.id}>
                                        <td>{run.id}</td>
                                        <td>{run.date}</td>
                                        <td><span className="me-2">{run.icon}</span>{run.status}</td>
                                        <td className="text-end">{run.findings}</td>
                                        <td className="text-end fw-bold">{run.score > 0 ? `${run.score}%` : 'N/A'}</td>
                                        <td className="text-end">
                                            <button 
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => setPage('dashboard')}
                                                disabled={run.status === 'Failed'}
                                            >
                                                View Dashboard
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CCardBody>
            </CCard>
        </CContainer>
    );
};

const Dashboard = ({ setPage, customerData }) => {
  const getScoreColor = (score) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    return 'danger';
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa' }}>
      <CContainer fluid className="p-4">
        <CRow className="align-items-center mb-4">
            <CCol>
                <button onClick={() => setPage('hub')} className="btn btn-link p-0 mb-2">
                    <ChevronLeft size={16} className="me-1" /> Back to Hub
                </button>
                <h2 className="mb-0 text-dark">Intelligence Dashboard</h2>
            </CCol>
        </CRow>
        
        <CRow className="mb-4">
          {Object.entries(customerData.summary).map(([key, value]) => (
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
          <CCol md={7} className="mb-4">
            <CCard className="h-100 shadow-sm border-0">
              <CCardHeader>Overall Health Trend (12 Months)</CCardHeader>
              <CCardBody>
                <CChartLine
                  data={{
                    labels: customerData.historicalTrend.labels,
                    datasets: [
                      {
                        label: 'Overall Health Score',
                        backgroundColor: 'rgba(50, 150, 250, 0.1)',
                        borderColor: 'rgba(50, 150, 250, 1)',
                        pointBackgroundColor: 'rgba(50, 150, 250, 1)',
                        pointBorderColor: '#fff',
                        data: customerData.historicalTrend.data,
                        fill: true,
                        tension: 0.4
                      },
                    ],
                  }}
                />
              </CCardBody>
            </CCard>
          </CCol>

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
                      {customerData.topRisks.map(risk => (
                        <tr key={risk.id}>
                          <td>
                            <div>{risk.title}</div>
                            <small className="text-muted">{risk.category}</small>
                          </td>
                          <td><span className="badge bg-light text-dark">{risk.system}</span></td>
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

// --- Main App Component ---
function App() {
  const [page, setPage] = useState('hub'); // 'hub', 'dataCollection', 'analysis', 'dashboard'
  const [customerId, setCustomerId] = useState(Object.keys(customerData)[0]);

  const renderPage = () => {
    switch (page) {
      case 'dataCollection':
        return <DataCollection setPage={setPage} />;
      case 'analysis':
        return <Analysis setPage={setPage} />;
      case 'dashboard':
        return <Dashboard setPage={setPage} customerData={customerData[customerId]} />;
      case 'hub':
      default:
        return <MainHub setPage={setPage} />;
    }
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <CustomerSelector customerId={customerId} setCustomerId={setCustomerId} />
      {renderPage()}
    </div>
  );
}

export default App;