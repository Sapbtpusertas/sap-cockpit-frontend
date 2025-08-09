import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CContainer, CRow, CCol, CCard, CCardBody, CCardHeader } from '@coreui/react';
import { CChartLine } from '@coreui/react-chartjs';
import { 
    Database, FileUp, PlayCircle, LayoutDashboard, ChevronLeft, Building, 
    CheckCircle, AlertTriangle, XCircle, MessageSquare, Send, X, Bot, User,
    Maximize2, Minimize2, Cpu, KeyRound
} from 'lucide-react';
import '@coreui/coreui/dist/css/coreui.min.css';
import { assessmentFramework } from './assessmentData';
import { customerData as initialCustomerData } from './sampleData';

// --- Child Components ---

const Chatbot = ({ isOpen, setIsOpen, context, setContext, customerName }) => {
    // ... (no changes in this component)
};

const CustomerSelector = ({ customerId, setCustomerId }) => (
  <div className="position-absolute top-0 end-0 p-3" style={{ zIndex: 1050 }}>
    <div className="input-group">
      <span className="input-group-text bg-light border-0"><Building size={18} /></span>
      <select className="form-select" value={customerId} onChange={(e) => setCustomerId(e.target.value)} aria-label="Select Customer">
        {Object.keys(initialCustomerData).map(id => (<option key={id} value={id}>{initialCustomerData[id].name}</option>))}
      </select>
    </div>
  </div>
);

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
            icon={<Cpu size={48} />}
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

const DataCollection = ({ setPage, customerId, collectedData, setCollectedData, customerName }) => {
      const [selectedPillarId, setSelectedPillarId] = useState(Object.keys(assessmentFramework)[0]);
      const [unstructuredText, setUnstructuredText] = useState('');
      const [isParsing, setIsParsing] = useState(false);

      const handleFileUpload = (checkId) => {
          setCollectedData(prev => ({ ...prev, [customerId]: { ...prev[customerId], [checkId]: { status: 'Collected', timestamp: new Date().toISOString() } } }));
      };

      const handleParseWithAI = async (checkId) => {
          setIsParsing(true);
          await new Promise(resolve => setTimeout(resolve, 1500));
          console.log(`Simulating AI parsing for check ${checkId} with data: ${unstructuredText}`);
          setIsParsing(false);
          handleFileUpload(checkId);
      };

      const pillar = assessmentFramework[selectedPillarId];
      const customerCheckData = collectedData[customerId] || {};

      return (
          <CContainer className="py-4">
              <button onClick={() => setPage('hub')} className="btn btn-link mb-3 p-0"><ChevronLeft size={16} className="me-1" /> Back to Hub</button>
              <h2>Data Collection for {customerName}</h2>
              <p className="text-muted">Provide the necessary data for analysis. The collection status is saved per customer for this session.</p>
              
              <CCard>
                  <CCardBody>
                      <h5>Step 1: Select Assessment Pillar</h5>
                      <select className="form-select mb-4" value={selectedPillarId} onChange={e => setSelectedPillarId(e.target.value)}>
                          {Object.values(assessmentFramework).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>

                      <h5>Step 2: Provide Required Data for "{pillar.name}"</h5>
                      {Object.values(pillar.categories).map(category => (
                          <div key={category.id} className="mb-4">
                              <h6>{category.name}</h6>
                              {category.checks.map(check => (
                                  <div key={check.id} className="p-3 border rounded mb-2">
                                      <div className="d-flex justify-content-between align-items-center">
                                          <strong>{check.name}</strong>
                                          {customerCheckData[check.id] ? (
                                              <div className="text-success d-flex align-items-center"><CheckCircle size={20} className="me-2"/> Collected</div>
                                          ) : (
                                              check.collectionType === 'Fully Automated' ? 
                                              <button className="btn btn-sm btn-outline-info"><KeyRound size={16} className="me-2"/> Configure Agent</button> :
                                              <button className="btn btn-sm btn-outline-primary" onClick={() => handleFileUpload(check.id)}><FileUp size={16} className="me-2"/> Upload File</button>
                                          )}
                                      </div>
                                      <div className="mt-2 p-2 bg-light rounded small">
                                          <strong>How-to Guide:</strong>
                                          <p className="mb-0 text-muted">{check.dataSource}</p>
                                      </div>
                                      {check.collectionType === 'Manual' && !customerCheckData[check.id] && (
                                        <div className="mt-2">
                                            <textarea className="form-control form-control-sm" rows="3" placeholder="Or paste unstructured data here..." onChange={e => setUnstructuredText(e.target.value)}></textarea>
                                            <button className="btn btn-sm btn-secondary mt-2" onClick={() => handleParseWithAI(check.id)} disabled={isParsing || !unstructuredText}>
                                                {isParsing ? 'Parsing...' : 'Parse with AI'}
                                            </button>
                                        </div>
                                      )}
                                  </div>
                              ))}
                          </div>
                      ))}
                  </CCardBody>
              </CCard>
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
              <button onClick={() => setPage('hub')} className="btn btn-link mb-3 p-0"><ChevronLeft size={16} className="me-1" /> Back to Hub</button>
              <h2>Analysis & Reports</h2>
              <p className="text-muted">Review past analysis runs or trigger a new one.</p>
              <button className="btn btn-primary mb-4"><PlayCircle size={16} className="me-2" /> Trigger New Full Analysis</button>
              <CCard>
                  <CCardHeader>Historical Analysis Runs</CCardHeader>
                  <CCardBody>
                      <div className="table-responsive">
                          <table className="table table-hover">
                              <thead><tr><th>Run ID</th><th>Date</th><th>Status</th><th className="text-end">Findings</th><th className="text-end">Overall Score</th><th className="text-end">Actions</th></tr></thead>
                              <tbody>
                                  {analysisRuns.map(run => (
                                      <tr key={run.id}>
                                          <td>{run.id}</td><td>{run.date}</td><td><span className="me-2">{run.icon}</span>{run.status}</td>
                                          <td className="text-end">{run.findings}</td><td className="text-end fw-bold">{run.score > 0 ? `${run.score}%` : 'N/A'}</td>
                                          <td className="text-end"><button className="btn btn-sm btn-outline-primary" onClick={() => setPage('dashboard')} disabled={run.status === 'Failed'}>View Dashboard</button></td>
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

const Dashboard = ({ setPage, customerData, onStartChat }) => {
    const summary = useMemo(() => {
        const pillarScores = {};
        Object.values(assessmentFramework).forEach(pillar => {
            let totalWeight = 0, weightedScore = 0, checkCount = 0;
            Object.values(pillar.categories).forEach(category => {
                category.checks.forEach(check => {
                    totalWeight += check.weight;
                    weightedScore += (customerData.scores[check.id] || 0) * check.weight;
                    checkCount++;
                });
            });
            const finalScore = totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 0;
            pillarScores[pillar.id] = { title: pillar.name, score: finalScore, checkCount: checkCount };
        });
        return pillarScores;
    }, [customerData.scores]);

    const getScoreColor = (score) => {
      if (score >= 90) return 'success';
      if (score >= 70) return 'warning';
      return 'danger';
    };
  
    return (
      <div style={{ backgroundColor: '#f8f9fa' }}>
        <CContainer fluid className="p-4">
          <CRow className="align-items-center mb-4">
              <CCol><button onClick={() => setPage('hub')} className="btn btn-link p-0 mb-2"><ChevronLeft size={16} className="me-1" /> Back to Hub</button><h2 className="mb-0 text-dark">Intelligence Dashboard</h2></CCol>
          </CRow>
          <CRow className="mb-4">
            {Object.values(summary).map((value) => (
              <CCol xs={12} sm={6} lg key={value.title} className="mb-3">
                 <CCard className={`h-100 shadow-sm border-0 text-white bg-${getScoreColor(value.score)}`}>
                    <CCardBody>
                        <div className="d-flex justify-content-between align-items-start">
                            <div><h5 className="card-title mb-0">{value.title}</h5><small>{value.checkCount} Checks</small></div>
                            <div className="fs-2 fw-bold">{`${value.score}%`}</div>
                        </div>
                    </CCardBody>
                 </CCard>
              </CCol>
            ))}
          </CRow>
          <CRow>
            <CCol md={7} className="mb-4">
              <CCard className="h-100 shadow-sm border-0">
                <CCardHeader>Overall Health Trend (12 Months)</CCardHeader>
                <CCardBody><CChartLine data={{ labels: customerData.historicalTrend.labels, datasets: [{ label: 'Overall Health Score', backgroundColor: 'rgba(50, 150, 250, 0.1)', borderColor: 'rgba(50, 150, 250, 1)', pointBackgroundColor: 'rgba(50, 150, 250, 1)', pointBorderColor: '#fff', data: customerData.historicalTrend.data, fill: true, tension: 0.4 }]}} /></CCardBody>
              </CCard>
            </CCol>
            <CCol md={5} className="mb-4">
              <CCard className="h-100 shadow-sm border-0">
                <CCardHeader>Top 5 Critical Risks</CCardHeader>
                <CCardBody>
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead><tr><th>Risk</th><th>System</th><th className="text-end">Priority</th><th className="text-center">AI</th></tr></thead>
                      <tbody>
                        {customerData.topRisks.map(risk => (
                          <tr key={risk.id}>
                            <td><div>{risk.title}</div><small className="text-muted">{risk.category}</small></td>
                            <td><span className="badge bg-light text-dark">{risk.system}</span></td>
                            <td className="text-end fw-bold text-danger">{risk.priorityScore}</td>
                            <td className="text-center"><button className="btn btn-light btn-sm" onClick={() => onStartChat(risk)} title="Ask AI Assistant"><Bot size={16} className="text-primary"/></button></td>
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
  const [page, setPage] = useState('hub');
  const [customerId, setCustomerId] = useState(Object.keys(initialCustomerData)[0]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatContext, setChatContext] = useState(null);
  const [collectedData, setCollectedData] = useState({}); // Simulated data store

  const handleStartChat = (risk) => {
    setChatContext(risk);
  };

  const renderPage = () => {
    switch (page) {
      case 'dataCollection':
        return <DataCollection setPage={setPage} customerId={customerId} collectedData={collectedData} setCollectedData={setCollectedData} customerName={initialCustomerData[customerId].name} />;
      case 'analysis':
        return <Analysis setPage={setPage} />;
      case 'dashboard':
        return <Dashboard setPage={setPage} customerData={initialCustomerData[customerId]} onStartChat={handleStartChat} />;
      case 'hub':
      default:
        return <MainHub setPage={setPage} />;
    }
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <CustomerSelector customerId={customerId} setCustomerId={setCustomerId} />
      {renderPage()}
      <Chatbot 
        isOpen={isChatOpen} 
        setIsOpen={setIsChatOpen} 
        context={chatContext} 
        setContext={setChatContext} 
        customerName={initialCustomerData[customerId].name}
      />
    </div>
  );
}

export default App;