// File: src/assessmentData.js
// This is the master knowledge base, containing the full 127-point framework.

export const assessmentFramework = {
    "1": {
        id: "1",
        name: "LANDSCAPE ARCHITECTURE",
        categories: {
            "1.1": {
                id: "1.1",
                name: "System Architecture",
                checks: [
                    { id: "CHK_LND_001", name: "System Landscape Mapping", weight: 12, risk: "High", collectionType: "Fully Automated", dataSource: "System landscape directory (SLD), Database queries, System info RFCs, Config files" },
                    { id: "CHK_NET_001", name: "Network Architecture Assessment", weight: 10, risk: "High", collectionType: "Semi-Automated", dataSource: "Network device configs, Firewall rules, Network diagrams, VLAN configs" },
                    { id: "CHK_LBC_001", name: "Load Balancer Configuration", weight: 8, risk: "Medium", collectionType: "Semi-Automated", dataSource: "Web Dispatcher profile (sapwebdisp.pfl), Load balancer configs, Health check setup" },
                    { id: "CHK_PRT_001", name: "Printer & Spool Configuration", weight: 5, risk: "Low", collectionType: "Fully Automated", dataSource: "Spool server configs (SAP transaction SPAD), Print server logs, Device types" },
                    { id: "CHK_DGO_001", name: "Database Growth & Sizing", weight: 10, risk: "High", collectionType: "Fully Automated", dataSource: "HANA Studio SQL queries (e.g., M_CS_TABLES), DBACOCKPIT, EWA reports" },
                    { id: "CHK_PAM_001", name: "Platform Compatibility Matrix", weight: 9, risk: "Medium", collectionType: "Fully Automated", dataSource: "SAP Product Availability Matrix (PAM), System component versions (System > Status)" },
                ]
            },
            "1.2": {
                id: "1.2",
                name: "Infrastructure Health Review",
                checks: [
                    { id: "CHK_INF_001", name: "CPU and Memory Utilization", weight: 10, risk: "High", collectionType: "Fully Automated", dataSource: "OS-level monitoring (top, vmstat), Cloud provider metrics (CloudWatch, Azure Monitor), ST06/OS07N" },
                    { id: "CHK_INF_002", name: "Storage Performance & Capacity", weight: 10, risk: "High", collectionType: "Fully Automated", dataSource: "OS-level tools (iostat), Cloud provider metrics (EBS IOPS), DBACOCKPIT" },
                    { id: "CHK_NET_002", name: "Network Latency & Throughput", weight: 8, risk: "Medium", collectionType: "Semi-Automated", dataSource: "Network monitoring tools (ping, traceroute), NIPING utility, Cloud provider network stats" },
                ]
            }
        }
    },
    "2": {
        id: "2",
        name: "TECHOPS",
        categories: {
            "2.1": {
                id: "2.1",
                name: "System Monitoring & Alerting",
                checks: [
                    { id: "CHK_MON_001", name: "Monitoring Tool Coverage", weight: 10, risk: "High", collectionType: "Semi-Automated", dataSource: "Solution Manager config, CCMS setup (RZ20/RZ21), Third-party tool dashboards" },
                    { id: "CHK_ALR_001", name: "Alerting Thresholds & Effectiveness", weight: 9, risk: "Medium", collectionType: "Semi-Automated", dataSource: "Alerting configuration in SolMan/CCMS, Incident management system data" },
                    { id: "CHK_EWA_001", name: "EarlyWatch Alert (EWA) Review", weight: 8, risk: "Medium", collectionType: "Semi-Automated", dataSource: "SAP EarlyWatch Alert reports from SAP Support Portal" },
                ]
            },
            "2.2": {
                id: "2.2",
                name: "Job & Process Management",
                checks: [
                    { id: "CHK_JOB_001", name: "Background Job Scheduling & Failures", weight: 10, risk: "High", collectionType: "Fully Automated", dataSource: "Job logs (SM37), Job scheduling tools (SAP BPA, Cron), Application logs (SLG1)" },
                    { id: "CHK_UPD_001", name: "Update Process (SM13) Analysis", weight: 7, risk: "Medium", collectionType: "Fully Automated", dataSource: "Update records analysis (SM13), System logs (SM21)" },
                    { id: "CHK_TPO_001", name: "Transport & Change Management", weight: 9, risk: "High", collectionType: "Fully Automated", dataSource: "Transport logs (STMS), Change management system data (ChaRM, ServiceNow)" },
                ]
            }
        }
    },
    "3": {
        id: "3",
        name: "OBSERVABILITY",
        categories: {
             "3.1": {
                id: "3.1",
                name: "Performance Analysis",
                checks: [
                    { id: "CHK_PERF_001", name: "Workload Analysis (ST03N)", weight: 12, risk: "High", collectionType: "Fully Automated", dataSource: "ST03N/SWNC workload data, RFC statistics, Transaction profiles" },
                    { id: "CHK_DB_001", name: "Database Performance (DBACOCKPIT)", weight: 12, risk: "High", collectionType: "Fully Automated", dataSource: "DBACOCKPIT, HANA Studio performance views (M_EXPENSIVE_STATEMENTS), AWR reports" },
                    { id: "CHK_DUMP_001", name: "System Dumps (ST22) Analysis", weight: 10, risk: "High", collectionType: "Fully Automated", dataSource: "ABAP dump analysis (ST22), System logs (SM21)" },
                ]
            },
            "3.2": {
                id: "3.2",
                name: "Log Management",
                checks: [
                    { id: "CHK_LOG_001", name: "System Log (SM21) Analysis", weight: 10, risk: "Medium", collectionType: "Fully Automated", dataSource: "System logs (SM21), Gateway logs (dev_rd), ICM logs (dev_icm)" },
                    { id: "CHK_LOG_002", name: "Centralized Logging Strategy", weight: 8, risk: "Medium", collectionType: "Semi-Automated", dataSource: "Configuration of log forwarding agents (Splunk, ELK), SIEM dashboard" },
                ]
            }
        }
    },
    "4": {
        id: "4",
        name: "BUSINESS RESILIENCY",
        categories: {
            "4.1": {
                id: "4.1",
                name: "Backup and Recovery",
                checks: [
                    { id: "CHK_BCK_001", name: "Backup Strategy & Success Rate", weight: 15, risk: "High", collectionType: "Semi-Automated", dataSource: "Backup tool logs (NetBackup, Veeam), DBACOCKPIT backup history, Backup policy documents" },
                    { id: "CHK_REC_001", name: "Recovery Test (DR Drill) Validation", weight: 15, risk: "High", collectionType: "Manual", dataSource: "Disaster Recovery test plans and results documentation" },
                ]
            },
            "4.2": {
                id: "4.2",
                name: "High Availability (HA)",
                checks: [
                    { id: "CHK_HA_001", name: "HA Cluster Configuration & Failover Test", weight: 14, risk: "High", collectionType: "Semi-Automated", dataSource: "Cluster manager configs (Pacemaker, VCS), HA test results, HANA system replication status (M_SERVICE_REPLICATION)" },
                ]
            }
        }
    },
    "5": {
        id: "5",
        name: "SECURITY COMPLIANCE",
        categories: {
            "5.1": {
                id: "5.1",
                name: "Security Vulnerability Assessment",
                checks: [
                    { id: "CHK_SEC_001", name: "Missing Critical Security Notes", weight: 15, risk: "High", collectionType: "Semi-Automated", dataSource: "SAP Security Note announcements, System component versions, SolMan System Recommendations" },
                    { id: "CHK_USR_001", name: "Default & Privileged User Security", weight: 13, risk: "High", collectionType: "Fully Automated", dataSource: "User master data (SU01/USR02), Role definitions (PFCG), Password parameters (RZ11)" },
                    { id: "CHK_AUD_001", name: "Security Audit Log (SM19/SM20) Config", weight: 10, risk: "Medium", collectionType: "Fully Automated", dataSource: "Audit log profile parameters (SM19), Audit log records (SM20)" },
                ]
            },
             "5.2": {
                id: "5.2",
                name: "Patch Management",
                checks: [
                    { id: "CHK_PATCH_001", name: "Kernel & Component Patch Level", weight: 10, risk: "High", collectionType: "Fully Automated", dataSource: "System component versions (System > Status), SAP Maintenance Planner" },
                    { id: "CHK_PATCH_002", name: "Patch Management Process", weight: 8, risk: "Medium", collectionType: "Manual", dataSource: "Change management documents, Patching policy and procedure documents" },
                ]
            }
        }
    }
};