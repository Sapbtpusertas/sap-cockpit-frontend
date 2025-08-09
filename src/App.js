// File: src/App.js
// This file is updated to import the new assessment data and calculate scores dynamically.

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CContainer, CRow, CCol, CCard, CCardBody, CCardHeader } from '@coreui/react';
import { CChartLine, CChartBar } from '@coreui/react-chartjs';
import { 
    Database, FileUp, PlayCircle, LayoutDashboard, ChevronLeft, Building, 
    CheckCircle, AlertTriangle, XCircle, MessageSquare, Send, X, Bot, User,
    Maximize2, Minimize2, Cpu, KeyRound
} from 'lucide-react';
import '@coreui/coreui/dist/css/coreui.min.css';
import { assessmentFramework } from './assessmentData';
import { getRawDataForCustomer } from './database';
import { calculateAllScores } from './analysisEngine';
import { customerData as initialCustomerData } from './sampleData';

// --- Child Components ---

const Chatbot = ({ isOpen, setIsOpen, context, setContext, customerName }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const messagesEndRef = useRef(null);
    const apiKey = "AIzaSyDAWS3zICYBz1qKg3Gpm7Zpm_-b-EAa7_A";

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        if (context) {
            const initialMessage = {
                sender: 'bot',
                text: `You've asked about the finding: **"${context.title}"**. How can I help you understand this risk for customer **${customerName}** on system **${context.system}**? You can ask about its impact, how to fix it, or for a simpler explanation.`
            };
            setMessages([initialMessage]);
            setIsOpen(true);
        } else if (isOpen && messages.length === 0) {
            const welcomeMessage = {
                sender: 'bot',
                text: 'Hello! I am the Analyst Assistant. To learn more about a specific risk, click the bot icon next to it in the dashboard. You can also ask me general questions about SAP.'
            };
            setMessages([welcomeMessage]);
        }
    }, [context, isOpen, setIsOpen, messages.length, customerName]);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;
        const userMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        let promptText;
        if (context) {
            promptText = `You are an expert SAP Security Architect advising on a finding for customer "${customerName}". Finding: "${context.title}" on system "${context.system}". Description: "${context.description}" User's question: "${currentInput}" Please provide a helpful and clear response, tailored to this context. Keep your answer concise and to the point.`;
        } else {
            promptText = `You are an expert SAP Security Architect. A user is asking a general question. User's question: "${currentInput}" Please provide a helpful and clear response. Keep your answer concise and to the point.`;
        }

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        const payload = { contents: [{ parts: [{ text: promptText }] }] };

        try {
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(`API error: ${response.status} ${response.statusText}. ${errorData?.error?.message || ''}`);
            }
            const result = await response.json();
            const botResponseText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (botResponseText) {
                setMessages(prev => [...prev, { sender: 'bot', text: botResponseText }]);
            } else {
                throw new Error("Could not parse a valid response from the AI assistant.");
            }
        } catch (error) {
            console.error("Failed to fetch from Gemini API:", error);
            setMessages(prev => [...prev, { sender: 'bot', text: `Sorry, I'm having trouble connecting to the AI assistant. Error: ${error.message}` }]);
        } finally {
            setIsLoading(false);
            if (context) setContext(null);
        }
    };

    return (
        <>
            <div className={`chatbot-fab ${isOpen ? 'hidden' : ''}`} onClick={() => setIsOpen(true)}>
                <MessageSquare size={30} color="white" />
            </div>
            <div className={`chatbot-window ${isOpen ? 'open' : ''} ${isMaximized ? 'maximized' : ''}`}>
                <div className="chatbot-header">
                    <h5>Analyst Assistant</h5>
                    <div>
                        <button onClick={() => setIsMaximized(!isMaximized)} className="me-2">{isMaximized ? <Minimize2 size={18} /> : <Maximize2 size={18} />}</button>
                        <button onClick={() => setIsOpen(false)}><X size={20} /></button>
                    </div>
                </div>
                <div className="chatbot-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender}`}>
                            <div className="message-icon">{msg.sender === 'bot' ? <Bot size={24} /> : <User size={24} />}</div>
                            <div className="message-text" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></div>
                        </div>
                    ))}
                    {isLoading && <div className="message bot"><div className="message-icon"><Bot size={24} /></div><div className="message-text typing-indicator"><span></span><span></span><span></span></div></div>}
                    <div ref={messagesEndRef} />
                </div>
                <div className="chatbot-input">
                    <input type="text" placeholder="Ask a question..." value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} disabled={isLoading} />
                    <button onClick={handleSend} disabled={isLoading}><Send size={20} /></button>
                </div>
            </div>
            <style>{`.chatbot-fab{position:fixed;bottom:30px;right:30px;width:60px;height:60px;background:linear-gradient(45deg,#0d6efd,#0d6efd);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.2);transition:all .3s ease;z-index:1000}.chatbot-fab:hover{transform:scale(1.1);box-shadow:0 6px 16px rgba(0,0,0,.3)}.chatbot-fab.hidden{transform:scale(0)}.chatbot-window{position:fixed;bottom:30px;right:30px;width:370px;height:500px;background-color:#fff;border-radius:15px;box-shadow:0 5px 20px rgba(0,0,0,.2);display:flex;flex-direction:column;transform:scale(0);transform-origin:bottom right;transition:all .3s ease;z-index:1000;overflow:hidden}.chatbot-window.open{transform:scale(1)}.chatbot-window.maximized{width:80vw;height:80vh;bottom:30px;right:30px}.chatbot-header{background:#f8f9fa;padding:15px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #e9ecef}.chatbot-header h5{margin:0;font-weight:600}.chatbot-header button{background:0 0;border:none;cursor:pointer;color:#6c757d}.chatbot-messages{flex-grow:1;padding:15px;overflow-y:auto;display:flex;flex-direction:column;gap:12px}.message{display:flex;align-items:flex-start;gap:10px;max-width:90%}.message.user{align-self:flex-end;flex-direction:row-reverse}.message-icon{flex-shrink:0;width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center}.message.bot .message-icon{background:#e9ecef;color:#495057}.message.user .message-icon{background:#0d6efd;color:#fff}.message-text{padding:12px;border-radius:12px;background:#f1f3f5;font-size:.9rem;line-height:1.5}.message.user .message-text{background:#0d6efd;color:#fff}.chatbot-input{display:flex;padding:15px;border-top:1px solid #e9ecef}.chatbot-input input{flex-grow:1;border:1px solid #ced4da;border-radius:20px;padding:10px 15px;font-size:.9rem;margin-right:10px}.chatbot-input input:disabled{background-color:#f8f9fa}.chatbot-input button{flex-shrink:0;width:40px;height:40px;border-radius:50%;border:none;background:#0d6efd;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center}.chatbot-input button:disabled{background:#6c757d}.typing-indicator span{height:8px;width:8px;float:left;margin:0 1px;background-color:#9e9e9e;display:block;border-radius:50%;opacity:.4;animation:C-Animation 1s infinite}.typing-indicator span:nth-child(2){animation-delay:.2s}.typing-indicator span:nth-child(3){animation-delay:.4s}@keyframes C-Animation{50%{opacity:1}}`}</style>
        </>
    );
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

const MainHub = ({ setPage, customerData }) => {
    const summary = useMemo(() => {
        const pillarScores = {};
        let totalWeightedScore = 0;
        let totalWeight = 0;

        Object.values(assessmentFramework).forEach(pillar => {
            let pillarWeightedScore = 0;
            let pillarTotalWeight = 0;
            let checkCount = 0;

            Object.values(pillar.categories).forEach(category => {
                category.checks.forEach(check => {
                    pillarTotalWeight += check.weight;
                    pillarWeightedScore += (customerData.scores[check.id] || 0) * check.weight;
                    checkCount++;
                });
            });

            totalWeightedScore += pillarWeightedScore;
            totalWeight += pillarTotalWeight;

            const finalScore = pillarTotalWeight > 0 ? Math.round(pillarWeightedScore / pillarTotalWeight) : 0;
            pillarScores[pillar.id] = { title: pillar.name, score: finalScore, checkCount: checkCount };
        });

        const overallScore = totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 0;
        return { pillarScores, overallScore };
    }, [customerData.scores]);

    const getScoreColor = (score) => {
      if (score >= 90) return 'success';
      if (score >= 70) return 'warning';
      return 'danger';
    };

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
          <p className="lead text-muted">Overall Health Snapshot for {customerData.name}</p>
        </div>

        <CRow className="justify-content-center mb-5">
            <CCol md={4}>
                <div className={`text-center p-4 rounded-circle border border-5 border-${getScoreColor(summary.overallScore)}`}>
                    <h2 className="mb-0">Overall Score</h2>
                    <div className="display-2 fw-bold">{summary.overallScore}%</div>
                </div>
            </CCol>
        </CRow>

        <CRow className="g-4">
          {Object.entries(summary.pillarScores).map(([id, value]) => (
            <CCol xs={12} sm={6} lg key={value.title} className="mb-3">
                <CCard className={`h-100 shadow-sm border-0 text-white bg-${getScoreColor(value.score)} scorecard`} onClick={() => setPage({ view: 'pillar', pillarId: id })}>
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
        <style>{`.scorecard { cursor: pointer; transition: transform 0.2s; } .scorecard:hover { transform: translateY(-3px); box-shadow: 0 4px 10px rgba(0,0,0,0.1); }`}</style>
      </CContainer>
    );
};

const DataCollection = ({ setPage, customerId, collectedData, setCollectedData, customerName, preselectedPillarId }) => {
      const [selectedPillarId, setSelectedPillarId] = useState(preselectedPillarId || Object.keys(assessmentFramework)[0]);
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
              <button onClick={() => setPage({ view: 'hub' })} className="btn btn-link mb-3 p-0"><ChevronLeft size={16} className="me-1" /> Back to Hub</button>
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
              <button onClick={() => setPage({ view: 'hub' })} className="btn btn-link mb-3 p-0"><ChevronLeft size={16} className="me-1" /> Back to Hub</button>
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
                                          <td className="text-end"><button className="btn btn-sm btn-outline-primary" onClick={() => setPage({ view: 'dashboard' })} disabled={run.status === 'Failed'}>View Dashboard</button></td>
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
              <CCol><button onClick={() => setPage({ view: 'hub' })} className="btn btn-link p-0 mb-2"><ChevronLeft size={16} className="me-1" /> Back to Hub</button><h2 className="mb-0 text-dark">Intelligence Dashboard</h2></CCol>
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

const PillarDashboard = ({ setPage, pillarId, customerData }) => {
    const pillar = assessmentFramework[pillarId];
    const categoryScores = useMemo(() => {
        const scores = {};
        Object.values(pillar.categories).forEach(category => {
            let totalWeight = 0, weightedScore = 0;
            category.checks.forEach(check => {
                totalWeight += check.weight;
                weightedScore += (customerData.scores[check.id] || 0) * check.weight;
            });
            scores[category.id] = { name: category.name, score: totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 0, checkCount: category.checks.length };
        });
        return scores;
    }, [pillar, customerData.scores]);

    const chartData = {
        labels: Object.values(categoryScores).map(c => c.name),
        datasets: [{
            label: 'Category Score',
            backgroundColor: 'rgba(50, 150, 250, 0.5)',
            borderColor: 'rgba(50, 150, 250, 1)',
            borderWidth: 1,
            data: Object.values(categoryScores).map(c => c.score),
        }],
    };

    return (
        <CContainer className="py-4">
            <button onClick={() => setPage({ view: 'hub' })} className="btn btn-link mb-3 p-0"><ChevronLeft size={16} className="me-1" /> Back to Hub</button>
            <h2>{pillar.name}</h2>
            <CRow>
                <CCol md={6} className="mb-4">
                    <CCard className="h-100">
                        <CCardHeader>Category Health Overview</CCardHeader>
                        <CCardBody><CChartBar data={chartData} options={{ indexAxis: 'y' }} /></CCardBody>
                    </CCard>
                </CCol>
                <CCol md={6}>
                    {Object.entries(categoryScores).map(([id, category]) => (
                        <CCard key={id} className="mb-3 scorecard" onClick={() => setPage({ view: 'category', pillarId, categoryId: id })}>
                            <CCardBody className="d-flex justify-content-between align-items-center">
                                <div><h5>{category.name}</h5><small className="text-muted">{category.checkCount} Checks</small></div>
                                <div className="fs-3 fw-bold">{category.score}%</div>
                            </CCardBody>
                        </CCard>
                    ))}
                </CCol>
            </CRow>
            <style>{`.scorecard { cursor: pointer; transition: transform 0.2s; } .scorecard:hover { transform: translateY(-3px); box-shadow: 0 4px 10px rgba(0,0,0,0.1); }`}</style>
        </CContainer>
    );
};

const CategoryDetailView = ({ setPage, pillarId, categoryId, customerData }) => {
    const category = assessmentFramework[pillarId].categories[categoryId];
    return (
        <CContainer className="py-4">
            <button onClick={() => setPage({ view: 'pillar', pillarId })} className="btn btn-link mb-3 p-0"><ChevronLeft size={16} className="me-1" /> Back to {assessmentFramework[pillarId].name}</button>
            <h3>{category.name}</h3>
            {category.checks.map(check => {
                const checkData = customerData.rawData[check.id];
                const score = customerData.scores[check.id];
                return (
                    <CCard key={check.id} className="mb-3">
                        <CCardHeader className="d-flex justify-content-between">
                            <strong>{check.name}</strong>
                            <span className="fw-bold">Score: {score}%</span>
                        </CCardHeader>
                        <CCardBody>
                            <p><strong>Data Source:</strong> {check.dataSource}</p>
                            <pre className="bg-light p-2 rounded small">{JSON.stringify(checkData, null, 2) || 'No data collected.'}</pre>
                            <button className="btn btn-sm btn-primary" onClick={() => setPage({ view: 'dataCollection', pillarId })}>
                                <Database size={16} className="me-2" /> Collect / Update Data
                            </button>
                        </CCardBody>
                    </CCard>
                );
            })}
        </CContainer>
    );
};

// --- Main App Component ---
function App() {
  const [page, setPage] = useState({ view: 'hub' });
  const [customerId, setCustomerId] = useState(Object.keys(initialCustomerData)[0]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatContext, setChatContext] = useState(null);
  const [collectedData, setCollectedData] = useState({});

  const customerData = useMemo(() => {
    const rawData = getRawDataForCustomer(customerId);
    const scores = calculateAllScores(customerId, rawData);
    const customerInfo = initialCustomerData[customerId];
    return {
        name: customerInfo.name,
        scores,
        rawData,
        historicalTrend: customerInfo.historicalTrend,
        topRisks: customerInfo.topRisks,
    };
  }, [customerId]);

  const handleStartChat = (risk) => setChatContext(risk);

  const renderPage = () => {
    switch (page.view) {
      case 'pillar':
        return <PillarDashboard setPage={setPage} pillarId={page.pillarId} customerData={customerData} />;
      case 'category':
        return <CategoryDetailView setPage={setPage} pillarId={page.pillarId} categoryId={page.categoryId} customerData={customerData} />;
      case 'dataCollection':
        return <DataCollection setPage={setPage} customerId={customerId} collectedData={collectedData} setCollectedData={setCollectedData} customerName={customerData.name} preselectedPillarId={page.pillarId} />;
      case 'dashboard':
        return <Dashboard setPage={setPage} customerData={customerData} onStartChat={handleStartChat} />;
      case 'analysis':
        return <Analysis setPage={setPage} />;
      default:
        return <MainHub setPage={setPage} customerData={customerData} />;
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
        customerName={customerData.name}
      />
    </div>
  );
}

export default App;