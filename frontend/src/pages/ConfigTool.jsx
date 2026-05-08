/**
 * Config Tool Page
 * 
 * Displays the standalone Equipment Schema Mapper HTML file
 * Bypasses password if accessed from authenticated Engineer Portal
 */

import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ConfigTool = () => {
    const location = useLocation();

    useEffect(() => {
        // Check if user is already authenticated from Engineer Portal
        const isAuthenticated = location.state?.authenticated === true;
        
        if (isAuthenticated) {
            // Set a session flag for the Config Tool to skip password
            sessionStorage.setItem('engineerAuthenticated', 'true');
        }
    }, [location]);

    return (
        <div className="w-screen h-screen bg-slate-950 flex flex-col">
            {/* Header Bar */}
            <div className="bg-slate-900 border-b border-slate-700 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <a 
                        href="/" 
                        className="text-indigo-400 hover:text-indigo-300 text-sm font-bold transition-colors"
                        data-testid="back-to-home-link"
                    >
                        &larr; Back to Home
                    </a>
                    <div className="h-4 w-px bg-slate-700"></div>
                    <h1 className="text-white font-black text-lg uppercase italic tracking-tight" data-testid="config-tool-title">
                        Equipment Configuration Tool
                    </h1>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                    v12.10 | {location.state?.authenticated ? 'Engineer Access' : 'Password Protected'}
                </div>
            </div>

            {/* Config Tool Content - loaded directly via src for proper URL resolution */}
            <div className="flex-1 overflow-hidden">
                <iframe
                    src="/equipment_mapper.html"
                    className="w-full h-full border-0"
                    title="Equipment Schema Mapper"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
                    data-testid="config-tool-iframe"
                />
            </div>
        </div>
    );
};

export default ConfigTool;
