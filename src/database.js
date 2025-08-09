// File: src/database.js
// This new file simulates the data backend.
import { assessmentFramework } from './assessmentData';

const rawData = {
    'cust_101': { // Healthy Customer
        'CHK_USR_001': {
            users: [
                { user: 'SAP*', status: 'LOCKED', type: 'SYSTEM' },
                { user: 'DDIC', status: 'LOCKED', type: 'SYSTEM' },
                { user: 'BASIS_ADMIN', status: 'ACTIVE', type: 'DIALOG' },
            ]
        },
        'CHK_LOG_001': {
            log: `System Log: Local Analysis of filesapdev_DEV_00
            |Time |Typ|Nr |Clt|User |Tcod|MNo|Text
            |10:00:01|R49|100|BASIS_ADMIN |SM21|A01|Session 001 opened on this application server`
        }
    },
    'cust_102': { // Average Customer
        'CHK_USR_001': {
            users: [
                { user: 'SAP*', status: 'LOCKED', type: 'SYSTEM' },
                { user: 'DDIC', status: 'ACTIVE', type: 'SYSTEM' }, // Finding: DDIC should be locked
                { user: 'BASIS_ADMIN', status: 'ACTIVE', type: 'DIALOG' },
            ]
        },
        'CHK_LOG_001': {
            log: `System Log: Local Analysis of filesapqas_QAS_00
            |Time |Typ|Nr |Clt|User |Tcod|MNo|Text
            |11:30:15|R49|100|BASIS_ADMIN |ST22|A01|Session 002 opened on this application server
            |11:32:00|R68|100|BASIS_ADMIN |SE16|D01|Transaction SE16 started` // Finding: SE16 usage
        }
    },
    'cust_103': { // Unhealthy Customer
        'CHK_USR_001': {
            users: [
                { user: 'SAP*', status: 'ACTIVE', type: 'SYSTEM' }, // Major Finding: SAP* is active
                { user: 'DDIC', status: 'ACTIVE', type: 'SYSTEM' }, // Finding: DDIC should be locked
                { user: 'BASIS_ADMIN', status: 'ACTIVE', type: 'DIALOG' },
            ]
        },
        'CHK_LOG_001': {
             log: `System Log: Local Analysis of filesapprd_PRD_00
            |Time |Typ|Nr |Clt|User |Tcod|MNo|Text
            |12:00:05|R49|100|SAP* |SU01|A01|Session 001 opened on this application server
            |12:01:00|R68|100|SAP* |SE16|D01|Transaction SE16 started` // Major Finding: SAP* using SE16
        }
    }
};

export const getRawDataForCheck = (customerId, checkId) => {
    return rawData[customerId]?.[checkId] || null;
};

export const getRawDataForCustomer = (customerId) => {
    return rawData[customerId] || {};