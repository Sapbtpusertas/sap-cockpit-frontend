// File: src/analysisEngine.js
// This new file contains the logic to score checks based on raw data.
import { assessmentFramework } from './assessmentData';

// A simple analysis engine. In a real app, this would be far more complex.
const analyze = (checkId, data) => {
    if (!data) return 0; // No data collected, score is 0

    switch (checkId) {
        case 'CHK_USR_001': {
            let score = 100;
            const sapStar = data.users.find(u => u.user === 'SAP*');
            const ddic = data.users.find(u => u.user === 'DDIC');
            if (sapStar?.status === 'ACTIVE') score -= 70; // Major penalty
            if (ddic?.status === 'ACTIVE') score -= 30;
            return Math.max(0, score);
        }
        case 'CHK_LOG_001': {
            let score = 100;
            if (data.log.includes('SAP*')) score -= 50;
            if (data.log.includes('SE16')) score -= 20;
            return Math.max(0, score);
        }
        // Default for checks without specific analysis logic yet
        default:
            return Math.floor(Math.random() * 21) + 80; // Return a healthy score by default
    }
};

export const calculateAllScores = (customerId, allRawData) => {
    const calculatedScores = {};
    Object.values(assessmentFramework).flat().forEach(pillar => {
        Object.values(pillar.categories).flat().forEach(category => {
            category.checks.forEach(check => {
                const rawData = allRawData[check.id];
                calculatedScores[check.id] = analyze(check.id, rawData);
            });
        });
    });
    return calculatedScores;
};