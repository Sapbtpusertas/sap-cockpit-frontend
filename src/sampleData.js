// File: sap-cockpit-frontend/src/sampleData.js
// This new file contains curated sample data for three companies.

// Helper function to generate scores based on a target health level
const generateScores = (health) => {
    let min, max;
    if (health === 'green') { min = 85; max = 100; }
    else if (health === 'yellow') { min = 65; max = 89; }
    else { min = 40; max = 75; } // red

    const scores = {};
    Object.values(assessmentFramework).forEach(pillar => {
        Object.values(pillar.categories).forEach(category => {
            category.checks.forEach(check => {
                scores[check.id] = Math.floor(Math.random() * (max - min + 1)) + min;
            });
        });
    });
    return scores;
};

export const customerData = {
  'cust_101': {
    name: 'Apex Global Logistics (Healthy)',
    scores: generateScores('green'), 
    historicalTrend: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      data: [82, 84, 85, 87, 86, 88, 89, 90, 92, 91, 93, 94]
    },
    topRisks: [
      { id: 1, title: "Non-Standard Kernel Patch Level", category: "Patch Management", system: "ECC-QAS", priorityScore: 75, description: "The kernel patch level on the QAS system deviates from the production system, posing a risk to accurate testing." },
      { id: 2, title: "Review Spool Reorganization Job", category: "TechOps", system: "BW-PRD", priorityScore: 72, description: "The standard spool reorganization job (RSPO1041) has a high number of skipped entries, suggesting a need to review variant settings." },
    ]
  },
  'cust_102': {
    name: 'Zenith Manufacturing (Average)',
    scores: generateScores('yellow'),
    historicalTrend: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      data: [65, 68, 72, 70, 75, 78, 80, 82, 81, 79, 85, 88]
    },
    topRisks: [
      { id: 1, title: "Untested DR Plan", category: "Business Resiliency", system: "ECC-PRD", priorityScore: 85, description: "The disaster recovery plan has not been tested in over 12 months, creating uncertainty about its effectiveness." },
      { id: 2, title: "Missing Critical Security Notes", category: "Security Compliance", system: "S4H-PRD", priorityScore: 91, description: "The system is missing one or more high-priority SAP Security Notes, leaving it vulnerable to known exploits." },
    ]
  },
  'cust_103': {
    name: 'Fusion Retail Group (Needs Attention)',
    scores: generateScores('red'),
    historicalTrend: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      data: [75, 72, 70, 68, 65, 66, 63, 60, 61, 58, 55, 52]
    },
    topRisks: [
      { id: 1, title: "Default SAP* User Active", category: "Security Compliance", system: "S4H-PRD", priorityScore: 98, description: "The default high-privilege SAP* user is active in a production client." },
      { id: 2, title: "Unencrypted RFC Connections", category: "Security Compliance", system: "ECC-PRD", priorityScore: 95, description: "Connections were found that do not use SNC encryption, exposing data in transit." },
    ]
  }
};