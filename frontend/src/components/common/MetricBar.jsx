/**
 * Metric Bar Component
 * 
 * Vertical bar chart for displaying energy metrics
 * Used for exchange/absorption energy display
 */

import React from 'react';

const MetricBar = ({ 
    val, 
    max = 30, 
    color = '#6366f1', 
    height = 'h-8', 
    width = 'w-1.5', 
    showValue = false, 
    theme = 'dark' 
}) => {
    const safeVal = (typeof val === 'number' && Number.isFinite(val)) ? val : 0;
    const pct = Math.max(showValue ? 28 : 5, Math.min(100, (Math.abs(safeVal) / max) * 100));
    
    return (
        <div 
            className={`${
                width
            } ${
                height
            } ${
                theme === 'dark' ? 'bg-slate-800/30' : 'bg-slate-200/60'
            } relative overflow-hidden flex flex-col justify-end shadow-inner rounded-full`}
        >
            <div 
                className={`w-full transition-all duration-700 ease-out flex justify-center pt-1 ${
                    theme === 'dark' ? 'shadow-lg shadow-black' : ''
                }`}
                style={{ 
                    height: `${pct}%`, 
                    backgroundColor: color 
                }}
            >
                {showValue && (
                    <span className="text-[9px] font-black text-white/90 drop-shadow-md tracking-tighter">
                        {Math.abs(safeVal).toFixed(1)}
                    </span>
                )}
            </div>
        </div>
    );
};

export default MetricBar;
