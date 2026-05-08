/**
 * Custom Hook for Telemetry Data
 * 
 * Fetches real-time AHU and VAV telemetry from backend
 * Polls every 3 seconds for updates
 */

import { useState, useEffect } from 'react';

const TELEMETRY_ENDPOINT = process.env.REACT_APP_BACKEND_URL + '/api/telemetry/data';
const POLL_INTERVAL = 3000; // 3 seconds

export const useTelemetry = () => {
    const [ahuData, setAhuData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchTelemetry = async () => {
            try {
                const response = await fetch(TELEMETRY_ENDPOINT);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                
                if (isMounted) {
                    setAhuData(data);
                    setError(null);
                    setLastUpdate(new Date());
                    setLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message);
                    setLoading(false);
                }
            }
        };

        // Initial fetch
        fetchTelemetry();

        // Set up polling
        const interval = setInterval(fetchTelemetry, POLL_INTERVAL);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, []);

    return { ahuData, loading, error, lastUpdate };
};
