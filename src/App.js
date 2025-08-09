import React, { useState, useEffect, useRef } from 'react';
import { CContainer, CRow, CCol, CCard, CCardBody, CCardHeader, CWidgetStatsF } from '@coreui/react';
import { CChartLine } from '@coreui/react-chartjs';
import { 
    Database, FileUp, PlayCircle, LayoutDashboard, ChevronLeft, Building, 
    CheckCircle, AlertTriangle, XCircle, MessageSquare, Send, X, Bot, User 
} from 'lucide-react';
import '@coreui/coreui/dist/css/coreui.min.css';

// --- Mock Database ---
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
      { id: 1, title: "Unencrypted RFC Connections", category: "Security Compliance", system: "ECC-PRD", priorityScore: 95, description: "Connections were found that do not use SNC encryption, exposing data in transit." },
      { id: 2, title: "Missing Critical Security Notes", category: "Security Compliance", system: "S4H-PRD", priorityScore: 91, description: "The system is missing one or more high-priority SAP Security Notes, leaving it vulnerable to known exploits." },
      { id: 3, title: "Low DB Memory Allocation", category: "Observability", system: "BW-HANA", priorityScore: 88, description: "The database's global allocation limit is set too low for the workload, risking performance degradation." },
      { id: 4, title: "Untested DR Plan", category: "Business Resiliency", system: "ECC-PRD", priorityScore: 85, description: "The disaster recovery plan has not been tested in over 12 months, creating uncertainty about its effectiveness." },
      { id: 5, title: "Hardcoded Credentials in Z-Code", category: "Security Compliance", system: "ECC-DEV", priorityScore: 82, description: "Custom ABAP code contains hardcoded usernames and passwords, violating security best practices." }
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
      { id: 1, title: "Default SAP* User Active", category: "Security Compliance", system: "S4H-PRD", priorityScore: 98, description: "The default high-privilege SAP* user is active in a production client." },
      { id: 2, title: "Outdated Kernel Version", category: "TechOps", system: "PO-PRD", priorityScore: 89, description: "The SAP Kernel is several patch levels behind the latest release, missing performance and security fixes." },
      { id: 3, title: "Database Log Mode Not ARCHIVELOG", category: "Business Resiliency", system: "ECC-PRD", priorityScore: 87, description: "The database is not in ARCHIVELOG mode, preventing point-in-time recovery." },
      { id: 4, "title": "Inefficient SQL in Custom Report", "category": "Observability", "system": "S4H-PRD", "priorityScore": 84, description: "A custom report (Z_SALES_OVERVIEW) was identified with inefficient SQL statements causing high database load." },
      { id: 5, "title": "Network ACLs Too Permissive", "category": "Landscape Architecture", "system": "AWS-VPC", "priorityScore": 80, description: "The network access control lists for the production VPC allow overly broad inbound traffic." }
    ]
  }
};

// --- Components ---

const Chatbot = ({ isOpen, setIsOpen, context, setContext }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        if (context) {
            const initialMessage = {
                sender: 'bot',
                text: `You've asked about the finding: **"${context.title}"**. How can I help you understand this risk? You can ask about its impact, how to fix it, or for a simpler explanation.`
            };
            setMessages([initialMessage]);
            setIsOpen(true);
        }
    }, [context, setIsOpen]);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;

        const userMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // --- Gemini API Simulation ---
        // In a real application, you would make a fetch call to the Gemini API here.
        // The prompt would be constructed securely, without sending sensitive data.
        const prompt = `
            You are an expert SAP Security Architect. A user is asking about the following finding.
            Finding: "${context.title}"
            Description: "${context.description}"
            User's question: "${input}"

            Please provide a helpful and clear response.
        `;
        console.log("Sending to Gemini (Simulated):", prompt);

        // Simulate a delay for the API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mocked response from Gemini
        const botResponseText = `Regarding **"${context.title}"**: ${context.description} This is a critical issue because it can lead to unauthorized access or data breaches. To remediate this, you should immediately implement SNC (Secure Network Communication) for all RFC connections handling sensitive data. This involves configuring cryptographic libraries on both the client and server systems.`;
        
        const botMessage = { sender: 'bot', text: botResponseText };
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
        setContext(null); // Clear context after first interaction to allow general questions
    };

    return (
        <>
            <div 
                className={`chatbot-fab ${isOpen ? 'hidden' : ''}`}
                onClick={() => setIsOpen(true)}
            >
                <MessageSquare size={30} color="white" />
            </div>

            <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
                <div className="chatbot-header">
                    <h5>Analyst Assistant</h5>
                    <button onClick={() => setIsOpen(false)}><X size={20} /></button>
                </div>
                <div className="chatbot-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender}`}>
                            <div className="message-icon">
                                {msg.sender === 'bot' ? <Bot size={24} /> : <User size={24} />}
                            </div>
                            <div className="message-text" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="message bot">
                            <div className="message-icon"><Bot size={24} /></div>
                            <div className="message-text typing-indicator">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div className="chatbot-input">
                    <input 
                        type="text" 
                        placeholder="Ask about this finding..." 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        disabled={!context && messages.length === 0}
                    />
                    <button onClick={handleSend} disabled={isLoading || (!context && messages.length === 0)}>
                        <Send size={20} />
                    </button>
                </div>
            </div>
            <style>{`
                .chatbot-fab {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(45deg, #0d6efd, #0d6efd);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                    transition: all 0.3s ease;
                    z-index: 1000;
                }
                .chatbot-fab:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 16px rgba(0,0,0,0.3);
                }
                .chatbot-fab.hidden {
                    transform: scale(0);
                }
                .chatbot-window {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    width: 370px;
                    height: 500px;
                    background-color: white;
                    border-radius: 15px;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.2);
                    display: flex;
                    flex-direction: column;
                    transform: scale(0);
                    transform-origin: bottom right;
                    transition: all 0.3s ease;
                    z-index: 1000;
                    overflow: hidden;
                }
                .chatbot-window.open {
                    transform: scale(1);
                }
                .chatbot-header {
                    background: #f8f9fa;
                    padding: 15px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #e9ecef;
                }
                .chatbot-header h5 {
                    margin: 0;
                    font-weight: 600;
                }
                .chatbot-header button {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #6c757d;
                }
                .chatbot-messages {
                    flex-grow: 1;
                    padding: 15px;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .message { display: flex; align-items: flex-start; gap: 10px; max-width: 90%; }
                .message.user { align-self: flex-end; flex-direction: row-reverse; }
                .message-icon {
                    flex-shrink: 0;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .message.bot .message-icon { background: #e9ecef; color: #495057; }
                .message.user .message-icon { background: #0d6efd; color: white; }
                .message-text {
                    padding: 12px;
                    border-radius: 12px;
                    background: #f1f3f5;
                    font-size: 0.9rem;
                    line-height: 1.5;
                }
                .message.user .message-text { background: #0d6efd; color: white; }
                .chatbot-input {
                    display: flex;
                    padding: 15px;
                    border-top: 1px solid #e9ecef;
                }
                .chatbot-input input {
                    flex-grow: 1;
                    border: 1px solid #ced4da;
                    border-radius: 20px;
                    padding: 10px 15px;
                    font-size: 0.9rem;
                    margin-right: 10px;
                }
                .chatbot-input input:disabled { background-color: #f8f9fa; }
                .chatbot-input button {
                    flex-shrink: 0;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    border: none;
                    background: #0d6efd;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .chatbot-input button:disabled { background: #6c757d; }
                .typing-indicator span {
                    height: 8px;
                    width: 8px;
                    float: left;
                    margin: 0 1px;
                    background-color: #9E9E9E;
                    display: block;
                    border-radius: 50%;
                    opacity: 0.4;
                    animation: C-Animation 1s infinite;
                }
                .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
                .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
                @keyframes C-Animation {
                  50% { opacity: 1; }
                }
            `}</style>
        </>
    );
};

const CustomerSelector = ({ customerId, setCustomerId }) => { /* ... (no changes) ... */ };
const MainHub = ({ setPage }) => { /* ... (no changes) ... */ };
const DataCollection = ({ setPage }) => { /* ... (no changes) ... */ };
const Analysis = ({ setPage }) => { /* ... (no changes) ... */ };

const Dashboard = ({ setPage, customerData, onStartChat }) => {
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
                        <th className="text-center">AI</th>
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
                          <td className="text-center">
                            <button 
                                className="btn btn-light btn-sm" 
                                onClick={() => onStartChat(risk)}
                                title="Ask AI Assistant"
                            >
                                <Bot size={16} className="text-primary"/>
                            </button>
                          </td>
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
  const [customerId, setCustomerId] = useState(Object.keys(customerData)[0]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatContext, setChatContext] = useState(null);

  const handleStartChat = (risk) => {
    setChatContext(risk);
  };

  const renderPage = () => {
    switch (page) {
      case 'dataCollection':
        return <DataCollection setPage={setPage} />;
      case 'analysis':
        return <Analysis setPage={setPage} />;
      case 'dashboard':
        return <Dashboard setPage={setPage} customerData={customerData[customerId]} onStartChat={handleStartChat} />;
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
      />
    </div>
  );
}

export default App;