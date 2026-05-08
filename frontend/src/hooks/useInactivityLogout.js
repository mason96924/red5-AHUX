/**
 * Inactivity Logout Hook
 * 
 * Automatically logs out user after specified period of inactivity
 * Tracks: mouse movements, clicks, keyboard events, touch events
 */

import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const useInactivityLogout = (timeoutMinutes = 30) => {
    const navigate = useNavigate();
    const timeoutRef = useRef(null);
    const TIMEOUT_MS = timeoutMinutes * 60 * 1000; // Convert to milliseconds

    const resetTimer = () => {
        // Clear existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set new timeout
        timeoutRef.current = setTimeout(() => {
            // Log out: navigate to main landing page
            console.log('Inactivity timeout - logging out');
            navigate('/');
        }, TIMEOUT_MS);
    };

    useEffect(() => {
        // Activity events to track
        const events = [
            'mousedown',
            'mousemove',
            'keypress',
            'scroll',
            'touchstart',
            'click'
        ];

        // Reset timer on any activity
        events.forEach(event => {
            window.addEventListener(event, resetTimer);
        });

        // Start initial timer
        resetTimer();

        // Cleanup
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            events.forEach(event => {
                window.removeEventListener(event, resetTimer);
            });
        };
    }, [timeoutMinutes]);

    return null;
};

export default useInactivityLogout;
