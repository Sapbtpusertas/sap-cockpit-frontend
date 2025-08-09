export const assessmentFramework = {
    "1": {
        id: "1",
        name: "LANDSCAPE ARCHITECTURE",
        categories: {
            "1.1": {
                id: "1.1",
                name: "System Architecture",
                checks: [
                    { id: "CHK_LND_001", name: "System Landscape Mapping", weight: 12, risk: "High" },
                    { id: "CHK_NET_001", name: "Network Architecture Assessment", weight: 10, risk: "High" },
                    { id: "CHK_LBC_001", name: "Load Balancer Configuration", weight: 8, risk: "Medium" },
                ]
            },
            "1.2": {
                id: "1.2",
                name: "Infrastructure Health Review",
                checks: [
                    { id: "CHK_INF_001", name: "CPU and Memory Utilization", weight: 10, risk: "High" },
                    { id: "CHK_INF_002", name: "Storage Performance", weight: 8, risk: "Medium" },
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
                    { id: "CHK_MON_001", name: "Monitoring Tool Coverage", weight: 10, risk: "High" },
                    { id: "CHK_ALR_001", name: "Alerting Effectiveness", weight: 9, risk: "Medium" },
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
                name: "Log Management",
                checks: [
                    { id: "CHK_LOG_001", name: "Centralized Logging", weight: 10, risk: "Medium" },
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
                    { id: "CHK_BCK_001", name: "Backup Success Rate", weight: 15, risk: "High" },
                    { id: "CHK_REC_001", name: "Recovery Test (DR Drill)", weight: 15, risk: "High" },
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
                    { id: "CHK_SEC_001", name: "Missing Critical Security Notes", weight: 15, risk: "High" },
                    { id: "CHK_RFC_001", name: "Insecure RFC Connections", weight: 12, risk: "High" },
                ]
            },
             "5.2": {
                id: "5.2",
                name: "Patch Management",
                checks: [
                    { id: "CHK_PATCH_001", name: "Kernel Patch Level", weight: 10, risk: "High" },
                ]
            }
        }
    }
};

// Generates sample scores for the checks to simulate collected data
export const generateSampleScores = () => {
    const scores = {};
    Object.values(assessmentFramework).forEach(pillar => {
        Object.values(pillar.categories).forEach(category => {
            category.checks.forEach(check => {
                // Score between 60 and 100
                scores[check.id] = Math.floor(Math.random() * 41) + 60; 
            });
        });
    });
    return scores;
};