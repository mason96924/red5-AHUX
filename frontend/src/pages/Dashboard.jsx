/**
 * Master UI Dashboard
 * 
 * Main operational dashboard orchestrating:
 * - Real-time telemetry polling (3s interval)
 * - Psychrometric chart with AHU/VAV plotting
 * - AHU sidebar with search and selection
 * - AHU info card (draggable)
 * - VAV table (draggable)
 * - Modal management (VAV, AHU, Floor Plan)
 * - Theme switching
 * - Vector visualization controls
 * - State management for all UI interactions
 */

import React, { useState, useEffect } from 'react';
import { useTelemetry } from '../hooks/useTelemetry';
import useInactivityLogout from '../hooks/useInactivityLogout';
import AhuSidebar from '../components/ahu/AhuSidebar';
import PsychrometricChart from '../components/psychrometric/PsychrometricChart';
import AhuCard from '../components/ahu/AhuCard';
import VavTable from '../components/vav/VavTable';
import VavModal from '../components/modals/VavModal';
import AhuModal from '../components/modals/AhuModal';
import FloorPlanModal from '../components/modals/FloorPlanModal';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { getH } from '../utils/psychrometric';

const Dashboard = () => {
    // Inactivity logout (30 minutes)
    useInactivityLogout(30);
    
    // Telemetry polling
    const { ahuData, loading, error, lastUpdate } = useTelemetry();

    // Theme
    const [theme, setTheme] = useState('dark');

    // Chart settings
    const [tempRange, setTempRange] = useState({ min: -5, max: 45 });
    const [showGivoni, setShowGivoni] = useState(true);

    // AHU selection and search
    const [selectedAhuId, setSelectedAhuId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Point visibility (OA/SA/RA)
    const [pointVisibility, setPointVisibility] = useState({
        OA: true,
        SA: true,
        RA: true
    });

    // Process path visualization
    const [showPath, setShowPath] = useState(true);

    // Indicator position (draggable white dot on chart)
    const [indicatorPos, setIndicatorPos] = useState({ t: 23, w: 0.012 });
    const [isDraggingIndicator, setIsDraggingIndicator] = useState(false);

    // Lock states
    const [isLockedToSA, setIsLockedToSA] = useState(false);
    const [lockedVavId, setLockedVavId] = useState(null);

    // Vector visibility (all enabled by default)
    const [vecVis, setVecVis] = useState({
        enthalpy: true,
        sensible: true,
        latent: true,
        diagnostic: true
    });

    // Card dragging
    const [cardOffset, setCardOffset] = useState({ x: 50, y: 80 });
    const [isCardDragging, setIsCardDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // VAV table dragging
    const [vavTableOffset, setVavTableOffset] = useState({ x: 850, y: 150 });
    const [isVavDragging, setIsVavDragging] = useState(false);

    // Modals
    const [selectedVavForModal, setSelectedVavForModal] = useState(null);
    const [vavCfm, setVavCfm] = useState(500);
    const [showAhuModalFor, setShowAhuModalFor] = useState(null);
    const [ahuFanSpeed, setAhuFanSpeed] = useState(75);
    const [showFloorPlanForAhu, setShowFloorPlanForAhu] = useState(null);

    // Handle card dragging
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isCardDragging) {
                setCardOffset({
                    x: e.clientX - dragStart.x,
                    y: e.clientY - dragStart.y
                });
            }
            if (isVavDragging) {
                setVavTableOffset({
                    x: e.clientX - dragStart.x,
                    y: e.clientY - dragStart.y
                });
            }
        };

        const handleMouseUp = () => {
            setIsCardDragging(false);
            setIsVavDragging(false);
        };

        if (isCardDragging || isVavDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isCardDragging, isVavDragging, dragStart]);

    // Lock indicator to SA point
    useEffect(() => {
        if (isLockedToSA && selectedAhuId && ahuData.length > 0 && !isDraggingIndicator) {
            const ahu = ahuData.find(a => a.id === selectedAhuId);
            if (ahu) {
                const sa = ahu.points.find(p => p.label === 'SA');
                if (sa) {
                    setIndicatorPos({ t: sa.t, w: sa.w });
                }
            }
        }
    }, [isLockedToSA, selectedAhuId, ahuData, isDraggingIndicator]);

    // Auto-lock to SA when AHU is first selected (default behavior)
    useEffect(() => {
        if (selectedAhuId && ahuData.length > 0 && !lockedVavId) {
            setIsLockedToSA(true);
        }
    }, [selectedAhuId, ahuData, lockedVavId]);

    // Lock indicator to VAV point
    useEffect(() => {
        if (lockedVavId && selectedAhuId && ahuData.length > 0 && !isDraggingIndicator) {
            const ahu = ahuData.find(a => a.id === selectedAhuId);
            if (ahu && ahu.vavs) {
                const vav = ahu.vavs.find(v => v.id === lockedVavId);
                if (vav) {
                    setIndicatorPos({ t: vav.t, w: vav.w });
                    // Unlock from SA when VAV is selected
                    setIsLockedToSA(false);
                }
            }
        }
    }, [lockedVavId, selectedAhuId, ahuData, isDraggingIndicator]);

    // Wildcard search filter
    const filterByWildcard = (id, pattern) => {
        if (!pattern) return true;
        
        const regex = pattern
            .replace(/\*/g, '.*')
            .replace(/\?/g, '.');
        
        return new RegExp(`^${regex}$`, 'i').test(id);
    };

    const filteredAhuData = ahuData.filter(ahu => filterByWildcard(ahu.id, searchTerm));

    // Get selected AHU data
    const selectedAhu = selectedAhuId ? ahuData.find(a => a.id === selectedAhuId) : null;

    // Calculate AHU metrics for card
    const getAhuMetrics = (ahu) => {
        if (!ahu || !ahu.points || ahu.points.length < 3) {
            return { exchange: 0, absorption: 0 };
        }
        
        const sa = ahu.points[1];
        const oa = ahu.points[0];
        const ra = ahu.points[2];
        
        return {
            exchange: getH(sa.t, sa.w) - getH(oa.t, oa.w),
            absorption: getH(ra.t, ra.w) - getH(sa.t, sa.w)
        };
    };

    const ahuMetrics = selectedAhu ? getAhuMetrics(selectedAhu) : { exchange: 0, absorption: 0 };

    // UI theme classes
    const ui = theme === 'dark'
        ? { bg: 'bg-slate-950', text: 'text-white' }
        : { bg: 'bg-slate-100', text: 'text-slate-900' };

    return (
        <ErrorBoundary>
            <div className={`${ui.bg} ${ui.text} w-screen h-screen flex overflow-hidden font-sans`}>
                {/* Loading/Error States */}
                {loading && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-500 mx-auto mb-4"></div>
                            <div className="text-white text-lg font-bold">Loading Telemetry Data...</div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="fixed top-4 right-4 z-50 bg-red-900/90 border border-red-500 text-white p-4 rounded-lg shadow-xl max-w-md">
                        <div className="font-bold mb-1">Telemetry Error</div>
                        <div className="text-sm">{error}</div>
                    </div>
                )}

                {/* Sidebar */}
                <AhuSidebar
                    theme={theme}
                    setTheme={setTheme}
                    showGivoni={showGivoni}
                    setShowGivoni={setShowGivoni}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filteredAhuData={filteredAhuData}
                    selectedAhuId={selectedAhuId}
                    setSelectedAhuId={setSelectedAhuId}
                    tempRange={tempRange}
                    setTempRange={setTempRange}
                    pointVisibility={pointVisibility}
                    setPointVisibility={setPointVisibility}
                    setShowFloorPlanForAhu={setShowFloorPlanForAhu}
                />

                {/* Main Chart Area */}
                <div className="flex-1 relative">
                    <PsychrometricChart
                        width={1300}
                        height={750}
                        tempRange={tempRange}
                        theme={theme}
                        showGivoni={showGivoni}
                        ahuData={ahuData}
                        selectedAhuId={selectedAhuId}
                        selectedAhu={selectedAhu}
                        pointVisibility={pointVisibility}
                        showPath={showPath}
                        indicatorPos={indicatorPos}
                        setIndicatorPos={setIndicatorPos}
                        isDraggingIndicator={isDraggingIndicator}
                        setIsDraggingIndicator={setIsDraggingIndicator}
                        vecVis={vecVis}
                        lockedVavId={lockedVavId}
                        isLockedToSA={isLockedToSA}
                        onIndicatorDragStart={() => {
                            // Unlock from both SA and VAV when user drags indicator
                            setIsLockedToSA(false);
                            setLockedVavId(null);
                        }}
                        onVavClick={(vav) => {
                            // Lock to clicked VAV
                            console.log('VAV clicked in chart:', vav.id);
                            setLockedVavId(vav.id);
                            setIsLockedToSA(false);
                        }}
                    />

                    {/* AHU Card (draggable) */}
                    {selectedAhu && (
                        <AhuCard
                            ahu={selectedAhu}
                            ahuMetrics={ahuMetrics}
                            theme={theme}
                            cardOffset={cardOffset}
                            pad={{ left: 90, top: 105 }}
                            setIsCardDragging={setIsCardDragging}
                            setDragStart={setDragStart}
                            vecVis={vecVis}
                            setVecVis={setVecVis}
                            showPath={showPath}
                            setShowPath={setShowPath}
                            isLockedToSA={isLockedToSA}
                            setIsLockedToSA={setIsLockedToSA}
                            setSelectedAhuId={setSelectedAhuId}
                            setLockedVavId={setLockedVavId}
                            setShowFloorPlanForAhu={setShowFloorPlanForAhu}
                        />
                    )}

                    {/* VAV Table (draggable) */}
                    {selectedAhu && selectedAhu.vavs && selectedAhu.vavs.length > 0 && (
                        <VavTable
                            selectedAhu={selectedAhu}
                            theme={theme}
                            vavTableOffset={vavTableOffset}
                            setIsVavDragging={setIsVavDragging}
                            setDragStart={setDragStart}
                            lockedVavId={lockedVavId}
                            setLockedVavId={setLockedVavId}
                            setIsLockedToSA={setIsLockedToSA}
                            setSelectedVavForModal={setSelectedVavForModal}
                            setVavCfm={setVavCfm}
                        />
                    )}

                    {/* Last Update Indicator */}
                    {lastUpdate && (
                        <div className="absolute bottom-4 right-4 text-[10px] text-slate-500 font-mono bg-black/40 px-3 py-1 rounded-full">
                            Last update: {lastUpdate.toLocaleTimeString()}
                        </div>
                    )}
                </div>

                {/* Modals */}
                {selectedVavForModal && (
                    <VavModal
                        vavData={selectedVavForModal}
                        onClose={() => setSelectedVavForModal(null)}
                        theme={theme}
                        cfm={vavCfm}
                        setCfm={setVavCfm}
                        saPoint={selectedAhu?.points.find(p => p.label === 'SA')}
                    />
                )}

                {showAhuModalFor && (
                    <AhuModal
                        ahuData={showAhuModalFor}
                        onClose={() => setShowAhuModalFor(null)}
                        theme={theme}
                        fanSpeed={ahuFanSpeed}
                        setFanSpeed={setAhuFanSpeed}
                    />
                )}

                {showFloorPlanForAhu && (
                    <FloorPlanModal
                        ahuData={ahuData.find(a => a.id === showFloorPlanForAhu)}
                        onClose={() => setShowFloorPlanForAhu(null)}
                        theme={theme}
                        onOpenAhuModal={setShowAhuModalFor}
                        onOpenVavModal={(vav) => {
                            setSelectedVavForModal(vav);
                            setShowFloorPlanForAhu(null);
                        }}
                    />
                )}
            </div>
        </ErrorBoundary>
    );
};

export default Dashboard;
