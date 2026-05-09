// Red5-Studio V1.2 — Preview Components (Extracted)
// All aligner SVG/JSX preview components for the Equipment Configuration Tool
// Loaded via <script type="text/babel" src="/assets/js/preview-components.js">

const PreviewVFDDisplay = ({ targetHz = 60.0, actualHz = 60.0, amps = 8.5, hasFault = false, isRunning = false }) => (
    <div className="bg-slate-900 p-1 rounded border border-slate-700 w-full h-full flex flex-col shadow-[inset_0px_4px_8px_rgba(0,0,0,0.9)] pointer-events-none">
        <div className={`w-full h-full rounded-sm ${hasFault ? 'bg-red-700 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] anim-alarm' : (isRunning ? 'bg-gradient-to-br from-blue-500 to-blue-700 shadow-[inset_0_0_20px_rgba(255,255,255,0.2),0_0_15px_rgba(59,130,246,0.6)]' : 'bg-gradient-to-br from-blue-700 to-blue-900 shadow-[inset_0_0_15px_rgba(0,0,0,0.6)] opacity-90')} p-1.5 flex flex-col justify-between overflow-hidden text-white transition-all duration-300`}>
            <div className="flex justify-between font-black border-b border-white/20 pb-0.5 leading-none" style={{ fontSize: '7px' }}>
                <span>{hasFault ? 'FLT' : (isRunning ? 'RUN' : 'RDY')}</span>
                <span>AUTO</span>
            </div>
            <div className="flex justify-between items-center font-mono leading-none mt-1" style={{ fontSize: '9px' }}>
                <span className="text-white/80 font-bold">F</span><span className="font-bold">{Number(targetHz).toFixed(1)}</span>
            </div>
            <div className="flex justify-between items-center text-cyan-100 font-mono font-black leading-none" style={{ fontSize: '12px' }}>
                <span className="text-white/80 font-bold" style={{ fontSize: '8px' }}>H</span><span>{Number(actualHz).toFixed(1)}</span>
            </div>
            <div className="flex justify-between items-center font-mono leading-none" style={{ fontSize: '9px' }}>
                <span className="text-white/80 font-bold">A</span><span className="font-bold">{Number(amps).toFixed(1)}</span>
            </div>
        </div>
    </div>
);

const PreviewVFDPill = ({ isActivated, isRunning, hasFault, onToggleActivate }) => {
    const statusColor = hasFault ? 'bg-red-500' : (isRunning ? 'bg-emerald-500' : 'bg-slate-600');
    const iconColor = hasFault ? 'text-red-500' : (!isActivated ? 'text-red-500' : 'text-slate-600');
    const playColor = !hasFault && isRunning ? 'text-emerald-500' : 'text-slate-600';
    
    const visuallyChecked = hasFault ? false : isActivated;

    return (
        <div className="w-full h-full flex flex-row items-center justify-between bg-slate-900/95 rounded-full backdrop-blur-md border border-slate-700/80 shadow-2xl px-1.5 pointer-events-none">
            <svg className={`w-[20%] h-[50%] ${iconColor} transition-colors duration-300`} viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
            
            <label className="relative inline-flex items-center cursor-pointer pointer-events-auto mx-1 flex-shrink-0" onMouseDown={e => e.stopPropagation()}>
                <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={visuallyChecked} 
                    onChange={(e) => { if(!hasFault) onToggleActivate(e.target.checked); }} 
                    disabled={hasFault} 
                />
                <div className="w-10 h-5 bg-red-500 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 shadow-inner"></div>
            </label>

            <svg className={`w-[20%] h-[50%] ${playColor} transition-colors duration-300`} viewBox="0 0 24 24" fill="currentColor"><polygon points="6,4 20,12 6,20" strokeLinejoin="round"/></svg>
        </div>
    );
};

const PreviewVFDChassis = ({ imageData, isRunning, isAlarm }) => {
    let traceClass = "";
    if (isAlarm) traceClass = "trace-alarm";
    else if (isRunning) traceClass = "trace-run";

    return (
        <div className="w-full h-full pointer-events-none flex items-center justify-center overflow-visible drop-shadow-xl">
            {imageData ? (
                <img src={imageData} className={`w-full h-full object-contain relative z-10 ${traceClass}`} draggable="false" />
            ) : (
                <div className={`w-full h-full bg-[#1e293b] border-[3px] border-slate-600 rounded-xl relative z-10 ${traceClass}`} style={{boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5), 0 10px 30px rgba(0,0,0,0.8)'}}>
                    <div className="w-[80%] h-[2px] bg-slate-700 absolute top-4 left-[10%]"></div>
                    <div className="w-[80%] h-[2px] bg-slate-700 absolute bottom-4 left-[10%]"></div>
                    <span className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-slate-500 uppercase tracking-widest italic leading-none text-center px-2">VFD Chassis<br/>(Awaiting Image)</span>
                </div>
            )}
        </div>
    );
};

const PreviewCentrifugalFan = ({ outlinePath, isAuto, isManualRunning, fanSpeed, hasFault, isActive }) => {
    const isRunning = (isAuto ? fanSpeed > 0 : isManualRunning) && !hasFault;
    const currentStatus = hasFault ? 'fault' : (isRunning ? 'running' : 'stopped');
    const animDuration = isRunning ? `${(60 / fanSpeed) * 0.85}s` : '0s';
    const safePath = outlinePath || "M 10 60 L 10 10 L 60 10 A 50 50 0 1 1 10 60 Z";

    return (
        <div className="w-full h-full preserve-3d relative pointer-events-none">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ transform: 'translateZ(-10px)' }}>
                <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible"><circle cx="60" cy="60" r="38" fill="#e2e8f0" /></svg>
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ transform: 'translateZ(0px)' }}>
                <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible">
                    <g className="anim-spin" style={{ animationDuration: animDuration, animationPlayState: isRunning ? 'running' : 'paused' }}>
                        <circle cx="60" cy="60" r="31" fill="none" stroke="#78350f" strokeWidth="2" />
                        {Array.from({ length: 18 }).map((_, i) => (
                            <g key={i} transform={`rotate(${(i * 360) / 18} 60 60)`}><line x1="60" y1="29" x2="60" y2="39" stroke="#92400e" strokeWidth="3.5" strokeLinecap="square" /></g>
                        ))}
                    </g>
                </svg>
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ transform: 'translateZ(0px)' }}>
                <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible drop-shadow-xl pointer-events-none">
                    <path d={safePath} fill={currentStatus === 'fault' ? 'rgba(225,29,72,0.3)' : (isRunning ? 'rgba(16,185,129,0.3)' : 'rgba(0,0,0,0)')} 
                        stroke={currentStatus === 'fault' ? '#ef4444' : (currentStatus === 'running' ? '#10b981' : (isAuto ? '#eab308' : '#94a3b8'))} 
                        strokeWidth={isActive ? "4" : "3.25"} 
                        className="transition-all duration-700 pointer-events-auto"
                        style={{ filter: isActive ? 'drop-shadow(0 0 15px rgba(99,102,241,0.8))' : 'none' }}
                    />
                </svg>
            </div>
        </div>
    );
};

const PreviewRectangularFan = ({ isAuto, isManualRunning, fanSpeed, hasFault }) => {
    const isRunning = (isAuto ? fanSpeed > 0 : isManualRunning) && !hasFault;
    const currentStatus = hasFault ? 'fault' : (isRunning ? 'running' : 'stopped');
    const animDuration = isRunning ? `${(60 / fanSpeed) * 0.4}s` : '0s';
    
    return (
        <div className="w-full h-full preserve-3d relative pointer-events-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]">
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible pointer-events-none">
                <defs>
                    <linearGradient id="bladeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ffffff" /><stop offset="100%" stopColor="#94a3b8" />
                    </linearGradient>
                </defs>
                <rect x="0" y="0" width="100" height="100" rx="4" fill="rgba(15,23,42,0.8)" 
                    stroke={currentStatus === 'fault' ? '#ef4444' : (currentStatus === 'running' ? '#10b981' : (isAuto ? '#eab308' : '#475569'))} 
                    strokeWidth="2" className="transition-all duration-700" 
                />
                <circle cx="8" cy="8" r="1.5" fill="#94a3b8" /><circle cx="92" cy="8" r="1.5" fill="#94a3b8" />
                <circle cx="8" cy="92" r="1.5" fill="#94a3b8" /><circle cx="92" cy="92" r="1.5" fill="#94a3b8" />
                <circle cx="50" cy="50" r="46" fill="transparent" stroke="#334155" strokeWidth="1.5" />
                <circle cx="50" cy="50" r="46" fill={currentStatus === 'fault' ? 'rgba(225,29,72,0.3)' : currentStatus === 'running' ? 'rgba(100,116,139,0.3)' : 'rgba(0,0,0,0)'} className="transition-all duration-700" />
                <g className="anim-spin-center" style={{ animationDuration: animDuration, animationPlayState: isRunning ? 'running' : 'paused' }}>
                    {[0, 72, 144, 216, 288].map((angle, i) => (
                        <g key={i} transform={`rotate(${angle} 50 50)`}>
                            <path d="M 50 50 C 65 20, 90 15, 95 35 C 90 50, 65 55, 50 50 Z" fill="url(#bladeGrad)" stroke="#ffffff" strokeWidth="0.5" />
                            <path d="M 50 50 C 65 20, 90 15, 95 35" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />
                        </g>
                    ))}
                    <circle cx="50" cy="50" r="12" fill="#334155" stroke="#cbd5e1" strokeWidth="1" />
                    <circle cx="50" cy="50" r="5" fill="#0f172a" />
                </g>
            </svg>
        </div>
    );
};

const VolumetricCloud = ({ zOffset, rotX, rotY, rotZ, intensity, puffs }) => {
    const scale = 0.1 + (intensity * 0.95);
    if (intensity === 0) return null;

    return (
        <div 
            className="absolute inset-0 pointer-events-none preserve-3d transition-transform duration-700"
            style={{ transform: `translateZ(${zOffset}px) scale(${scale})` }}
        >
            {puffs.map((puff, i) => (
                <div 
                    key={i}
                    className="absolute top-1/2 left-1/2 preserve-3d"
                    style={{ transform: `translate3d(${puff.x}px, ${puff.y}px, ${puff.z}px)` }}
                >
                    <div className="preserve-3d anim-drift" style={{ animationDelay: `${puff.delay}s` }}>
                        <div 
                            className="rounded-full absolute"
                            style={{
                                width: `${puff.r * 2}px`,
                                height: `${puff.r * 2}px`,
                                marginLeft: `${-puff.r}px`,
                                marginTop: `${-puff.r}px`,
                                background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,${intensity * 0.95}) 0%, rgba(230,240,255,${intensity * 0.7}) 30%, rgba(200,210,225,${intensity * 0.3}) 55%, rgba(255,255,255,0) 75%)`,
                                transform: `rotateZ(${-rotZ}deg) rotateY(${-rotY}deg) rotateX(${-rotX}deg)`
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

// EXACT PASTE FROM STANDALONE FILE
const PreviewHydrationValve = ({ hydrateLevel, isHeating, width, height, rotX, rotY, rotZ }) => {
    const intensity = hydrateLevel / 100;
    const activeColor = isHeating ? '#ef4444' : '#10b981';

    const puffs = useMemo(() => {
        const arr = [];
       //Constrain cloud size to fit withing duct dimension
        const maxRadius = Math.min(width, height) * 0.30; //Max 30% of smallest dimension
        const ringRadius = Math.min(width, height) * 0.2; // Ring distance from center
        const zRange = Math.min(width, height) * 0.30; //z-axis range

        //Center puff - largest but constrained
        arr.push({ x:0, y:0, z:0, r: maxRadius, delay: 0});

        //Ring puffs around center - smaller and constrained
        for(let i=0; i<12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const dist = ringRadius *(0.7+ Math.random() * 0.3);
            const x = Math.cos(angle) * dist;
            const y = Math.sin(angle) * dist;
            const z = (Math.random()-0.5) * zRange;
            arr.push({ x, y, z, r: maxRadius*0.6*(0.8+ Math.random()*0.4), delay: Math.random() * -5 });
        }
        // Front and back accent puffs - medium sized
        arr.push({ x: 3, y: 0, z: zRange*0.2, r: maxRadius, delay: -1 });
        arr.push({ x: -3, y: 0, z: -zRange*0.2, r: maxRadius, delay: -2 });
        return arr;
    },[width,height]);

    return (
        <div className="w-full h-full preserve-3d relative pointer-events-none" style={{ width: `${width}px`, height: `${height}px` }}>
            <VolumetricCloud zOffset={-35} rotX={rotX} rotY={rotY} rotZ={rotZ} intensity={intensity} puffs={puffs} />
            
            <div className="absolute inset-0 border-[8px] border-slate-500 shadow-[inset_0_0_20px_rgba(0,0,0,0.9)] rounded flex items-center justify-center z-10 bg-slate-900/60 overflow-hidden backdrop-blur-sm transform-gpu" style={{ transform: 'translateZ(0px)' }}>
                <div className="absolute bottom-0 w-full transition-all duration-700 opacity-20" style={{ height: `${hydrateLevel}%`, backgroundColor: activeColor }}></div>
                <div className="w-full h-[4px] bg-slate-400/80 shadow-lg"></div>
                <div className="h-full w-[4px] bg-slate-400/80 absolute shadow-lg"></div>
            </div>

            <VolumetricCloud zOffset={35} rotX={rotX} rotY={rotY} rotZ={rotZ} intensity={intensity} puffs={puffs} />
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-slate-400 rounded-full shadow-2xl border-[3px] border-slate-50 z-20" style={{ transform: 'translateZ(12px)' }}></div>
        </div>
    );
};

const PreviewDamper = ({ damperPos, width, height }) => {
    const vaneRotation = (damperPos / 100) * 85;
    return (
        <div className="w-full h-full preserve-3d relative pointer-events-none drop-shadow-xl bg-white border-[4px] border-slate-500 rounded-sm" style={{ width: `${width}px`, height: `${height}px` }}>
            {[0.125, 0.375, 0.625, 0.875].map((vPos, i) => (
                <div key={i} className="absolute left-0 w-full transition-all duration-500 ease-in-out border border-slate-500"
                    style={{ top: `calc(${vPos * 100}% - 12.5%)`, height: `25%`, backgroundColor: '#000000', transformOrigin: 'center', transform: `rotateX(${vaneRotation}deg)` }}>
                </div>
            ))}
        </div>
    );
};

// PreviewCircularDamper — VAV-style disc damper that rotates around a horizontal mid-axis (shaft).
// Spec: 90° = fully CLOSED (disc face-on to flow, blocks pipe), 180° = fully OPEN (disc edge-on, parallel to flow).
// damperPos 0-100% maps linearly to 90°-180° rotation about rotateX.
// NOTE: Like PreviewDamper, we do NOT apply outer rotX/Y/Z here — the parent wrapper already does.
// isActive=true (Config Tool) shows the status label; runtime callers omit it.
const PreviewCircularDamper = ({ damperPos, width, height, isActive }) => {
    const pos = Math.max(0, Math.min(100, parseFloat(damperPos) || 0));
    const bladeAngle = 90 + (pos / 100) * 90;
    const size = Math.min(width || 120, height || 120);
    return (
        <div className="w-full h-full relative pointer-events-none preserve-3d"
             style={{ width: `${width}px`, height: `${height}px`, transformStyle: 'preserve-3d', perspective: '800px' }}>
            {/* Circular housing */}
            <div className="absolute rounded-full border-[6px] border-slate-500 shadow-2xl"
                 style={{
                     width: `${size}px`, height: `${size}px`,
                     left: `${(width - size) / 2}px`, top: `${(height - size) / 2}px`,
                     background: 'radial-gradient(circle at 30% 30%, #f1f5f9, #94a3b8 60%, #475569 100%)',
                     boxShadow: 'inset 0 4px 14px rgba(0,0,0,0.28), 0 4px 10px rgba(0,0,0,0.35)',
                 }}>
                {/* Shaft line (mid-axis indicator, amber) */}
                <div className="absolute left-[-6%] right-[-6%] top-1/2 h-[3px] -translate-y-1/2 bg-gradient-to-r from-amber-700 via-amber-400 to-amber-700 z-20 rounded-full"
                     style={{ boxShadow: '0 0 6px rgba(251,191,36,0.65)' }} />
                {/* Blade (disc) — rotates around horizontal mid-axis */}
                <div className="absolute inset-[6%] flex items-center justify-center transition-transform duration-500 ease-in-out z-10"
                     style={{
                         transformStyle: 'preserve-3d',
                         transform: `rotateX(${bladeAngle}deg)`,
                         transformOrigin: 'center center',
                     }}>
                    <div className="w-full h-full rounded-full border-2 border-slate-700 shadow-lg"
                         style={{
                             background: 'linear-gradient(135deg, #64748b 0%, #334155 50%, #0f172a 100%)',
                             boxShadow: '0 3px 10px rgba(0,0,0,0.55), inset 0 1px 2px rgba(255,255,255,0.25)',
                         }} />
                </div>
            </div>
            {/* Status label removed per design — blade angle is visually apparent from disc rotation */}
        </div>
    );
};

const PreviewNeonPipeCoil = ({ value, isHeating, length, thickness, separation }) => {
    const intensity = value / 100;
    const isVisible = value > 0;
    const blurRadius = 5 + (intensity * 25);
    const neonOpacity = 0.3 + (intensity * 0.7);
    
    const colorCyan = { core: '#22d3ee', glow: 'rgba(6, 182, 212, 0.8)' }; 
    const colorOrange = { core: '#fb923c', glow: 'rgba(249, 115, 22, 0.8)' };   
    const activeColor = isHeating ? colorOrange : colorCyan;

    return (
        <div className="w-full h-full preserve-3d flex justify-center items-center pointer-events-none" style={{ opacity: isVisible ? 1 : 0.15 }}>
            <div className="flex justify-center items-center" style={{ gap: `${separation}px`, height: `${length}px` }}>
                {[1, 2].map((id) => (
                    <div key={id} className="relative rounded-full border border-white/20 bg-slate-900/20 overflow-visible transition-all duration-500"
                        style={{ width: `${thickness}px`, height: `${length}px`, boxShadow: `0 0 ${blurRadius}px ${activeColor.glow}` }}>
                        <div className="absolute inset-0 rounded-full transition-colors duration-500" style={{ backgroundColor: activeColor.core, opacity: neonOpacity, boxShadow: `inset 0 0 ${blurRadius/2}px ${activeColor.glow}` }}></div>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-black/60 via-transparent to-black/60 mix-blend-multiply pointer-events-none"></div>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/30 via-transparent to-transparent w-1/3 pointer-events-none mix-blend-screen"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const PreviewPressureSwitchFilter = ({ filterLoad, separation = 70, thickness = 6 }) => {
    const upColor = filterLoad > 50 ? (filterLoad >= 85 ? '#ef4444' : '#eab308') : '#3b82f6';
    const filterOpacity = 0.1 + ((filterLoad / 100) * 0.8); 
    const downOpacity = 1 - (filterLoad / 100); 

    const center = 50;
    const safeSep = Math.min(90, Math.max(10, separation));
    const leftX = center - (safeSep / 2);
    const rightX = center + (safeSep / 2);
    const safeThick = Math.min(thickness, safeSep / 2.5);

    return (
        <div className="w-full h-full preserve-3d relative pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible drop-shadow-xl pointer-events-none">
                <rect x="0" y="0" width="100" height="100" fill="transparent" className="pointer-events-auto" />
                <g className="transition-all duration-700">
                    <path d={`M ${leftX} 10 L ${leftX} 80`} fill="none" stroke={upColor} strokeWidth={safeThick} strokeLinecap="round" className="drop-shadow-[0_0_12px_currentColor]" />
                    <circle cx={leftX} cy="85" r={safeThick} fill={upColor} opacity="0.9" className="drop-shadow-[0_0_10px_currentColor]" />
                </g>
                <g className="transition-all duration-700" style={{ opacity: Math.max(0.1, downOpacity) }}>
                    <path d={`M ${rightX} 10 L ${rightX} 80`} fill="none" stroke="#3b82f6" strokeWidth={Math.max(1, safeThick * 0.6)} strokeLinecap="round" className="drop-shadow-[0_0_8px_currentColor]" />
                    <circle cx={rightX} cy="85" r={Math.max(2, safeThick * 0.8)} fill="#3b82f6" opacity="0.8" filter="blur(2px)" />
                </g>
                <rect x={leftX + safeThick} y="10" width={Math.max(0.1, safeSep - (safeThick * 2))} height="80" fill="#1e293b" opacity={filterOpacity} className="transition-opacity duration-1000"/>
                <path d={`M ${leftX + safeThick} 10 L ${rightX - safeThick} 90 M ${rightX - safeThick} 10 L ${leftX + safeThick} 90 M ${center} 10 L ${center} 90 M ${leftX + safeThick} 50 L ${rightX - safeThick} 50`} stroke="#020617" strokeWidth={Math.max(1, safeThick * 0.4)} opacity={filterOpacity * 1.2} className="transition-opacity duration-1000"/>
            </svg>
        </div>
    );
};

const PreviewPressureSwitchDisplay = ({ filterLoad }) => {
    const isAlarm = filterLoad >= 85;
    const upColor = filterLoad > 50 ? (isAlarm ? '#ef4444' : '#eab308') : '#3b82f6';
    const paReading = Math.round((filterLoad / 100) * 500);

    return (
        <div className="w-full h-full preserve-3d relative pointer-events-none">
            <svg viewBox="0 0 150 100" className="w-full h-full overflow-visible drop-shadow-lg pointer-events-none">
                <rect x="0" y="0" width="150" height="100" fill="transparent" className="pointer-events-auto" />
                <g className={isAlarm ? 'anim-alarm' : 'transition-all duration-700'}>
                    <circle cx="75" cy="45" r="35" fill="#000000" stroke={upColor} strokeWidth="4" />
                    <text x="75" y="52" fill={upColor} fontSize="26" fontWeight="900" fontFamily="monospace" textAnchor="middle">{paReading}</text>
                    <text x="75" y="68" fill="#94a3b8" fontSize="12" fontWeight="bold" textAnchor="middle">Pa</text>
                    <path d="M 60 80 L 60 100 M 90 80 L 90 100" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
                </g>
            </svg>
        </div>
    );
};

// DP SENSOR ALIGNER — Compact 3-channel device (Temp / RH / Pa)
const PreviewDPSensor = ({ ch1 = 23.7, ch2 = 47.3, ch3 = 0.0, activeChannel = 0 }) => {
    const channels = [
        { label: 'Ch1', value: ch1, unit: '\u00B0C', color: '#22c55e' },
        { label: 'Ch2', value: ch2, unit: '%Rh', color: '#eab308' },
        { label: 'Ch3', value: ch3, unit: 'Pa', color: '#3b82f6' },
    ];
    return (
        <div className="w-full h-full pointer-events-none select-none" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            <svg viewBox="0 0 120 180" className="w-full h-full overflow-visible drop-shadow-xl">
                <defs>
                    <linearGradient id="dpSensorBody" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#94a3b8"/>
                        <stop offset="40%" stopColor="#cbd5e1"/>
                        <stop offset="60%" stopColor="#94a3b8"/>
                        <stop offset="100%" stopColor="#64748b"/>
                    </linearGradient>
                </defs>
                <rect x="5" y="5" width="110" height="170" rx="8" fill="url(#dpSensorBody)" stroke="#475569" strokeWidth="2"/>
                <circle cx="14" cy="14" r="3" fill="#64748b" stroke="#475569" strokeWidth="0.5"/>
                <circle cx="106" cy="14" r="3" fill="#64748b" stroke="#475569" strokeWidth="0.5"/>
                <circle cx="14" cy="166" r="3" fill="#64748b" stroke="#475569" strokeWidth="0.5"/>
                <circle cx="106" cy="166" r="3" fill="#64748b" stroke="#475569" strokeWidth="0.5"/>
                <text x="60" y="28" fill="#334155" fontSize="7" fontWeight="900" textAnchor="middle" fontFamily="Inter, sans-serif">BMS Smart Go</text>
                <rect x="15" y="34" width="90" height="72" rx="3" fill="#0f172a" stroke="#334155" strokeWidth="1.5"/>
                {channels.map((ch, ci) => {
                    const yBase = 48 + ci * 20;
                    const isActive = ci === activeChannel;
                    return (
                        <React.Fragment key={ci}>
                            {isActive && <rect x="16" y={yBase - 10} width="88" height="18" rx="2" fill={ch.color} opacity="0.12"/>}
                            <text x="22" y={yBase} fill="#94a3b8" fontSize="8" fontWeight="700">{ch.label}</text>
                            <text x="72" y={yBase} fill={ch.color} fontSize="12" fontWeight="900" textAnchor="end">{Number(ch.value).toFixed(1)}</text>
                            <text x="97" y={yBase} fill="#94a3b8" fontSize="7" fontWeight="600" textAnchor="end">{ch.unit}</text>
                        </React.Fragment>
                    );
                })}
                <text x="38" y="102" fill="#64748b" fontSize="12" fontWeight="900" textAnchor="middle">&lt;</text>
                <circle cx="60" cy="99" r="4" fill="none" stroke="#64748b" strokeWidth="1.5"/>
                <text x="82" y="102" fill="#64748b" fontSize="12" fontWeight="900" textAnchor="middle">&gt;</text>
                <circle cx="60" cy="132" r="14" fill="#78716c" stroke="#57534e" strokeWidth="2"/>
                <circle cx="60" cy="132" r="10" fill="#a8a29e" stroke="#78716c" strokeWidth="1"/>
                <circle cx="60" cy="158" r="6" fill="#78716c" stroke="#57534e" strokeWidth="1.5"/>
            </svg>
        </div>
    );
};

// DP DISPLAY ALIGNER — Panel display with 5 stacked readings
const PreviewDPDisplay = ({ temp = 9.2, rh = 20.7, dp = 0, vavFlow = 450, cavFlow = 1200, activeRow = 0 }) => {
    const rows = [
        { icon: 'thermo', label: 'Indoor Temp', value: temp, unit: '\u00B0C', color: '#ef4444' },
        { icon: 'drop', label: 'Indoor RH', value: rh, unit: '%', color: '#3b82f6' },
        { icon: 'gauge', label: 'Diff Pressure', value: dp, unit: 'Pa', color: '#a855f7' },
        { icon: 'fan1', label: 'VAV Flow', value: vavFlow, unit: 'm\u00B3/h', color: '#22c55e' },
        { icon: 'fan2', label: 'CAV Flow', value: cavFlow, unit: 'm\u00B3/h', color: '#f97316' },
    ];
    const iconPaths = {
        thermo: 'M8 2v10.07A3.5 3.5 0 1 0 12 15.5V2Z',
        drop: 'M12 2C8 7 5 10 5 13.5A7 7 0 0 0 19 13.5C19 10 16 7 12 2Z',
        gauge: 'M12 2A10 10 0 0 0 2 12H4A8 8 0 0 1 20 12H22A10 10 0 0 0 12 2ZM12 8L14 12',
        fan1: 'M12 2C9 2 7 5 7 7C7 9 9 10 12 10C15 10 17 9 17 7C17 5 15 2 12 2ZM4 14C4 12 6 11 8 12C10 13 10 16 8 17C6 18 4 16 4 14ZM20 14C20 16 18 18 16 17C14 16 14 13 16 12C18 11 20 12 20 14Z',
        fan2: 'M12 2C9 2 7 5 7 7C7 9 9 10 12 10C15 10 17 9 17 7C17 5 15 2 12 2ZM4 14C4 12 6 11 8 12C10 13 10 16 8 17C6 18 4 16 4 14ZM20 14C20 16 18 18 16 17C14 16 14 13 16 12C18 11 20 12 20 14Z',
    };
    return (
        <div className="w-full h-full pointer-events-none select-none" style={{ fontFamily: "'Inter', sans-serif" }}>
            <svg viewBox="0 0 160 200" className="w-full h-full overflow-visible drop-shadow-xl">
                <rect x="2" y="2" width="156" height="196" rx="12" fill="#1e293b" stroke="#334155" strokeWidth="2"/>
                <rect x="8" y="8" width="144" height="184" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1"/>
                {rows.map((r, ri) => {
                    const yBase = 22 + ri * 34;
                    const isActive = ri === activeRow;
                    return (
                        <React.Fragment key={ri}>
                            {isActive && <rect x="10" y={yBase - 8} width="140" height="30" rx="4" fill={r.color} opacity="0.08"/>}
                            <rect x="14" y={yBase - 2} width="18" height="18" rx="4" fill={r.color} opacity="0.15"/>
                            <g transform={`translate(15, ${yBase - 1}) scale(0.7)`}>
                                <path d={iconPaths[r.icon]} fill={r.color} opacity="0.9"/>
                            </g>
                            <text x="38" y={yBase + 4} fill="#64748b" fontSize="7" fontWeight="600">{r.label}</text>
                            <text x="125" y={yBase + 12} fill="#0f172a" fontSize="13" fontWeight="900" textAnchor="end" fontFamily="'JetBrains Mono', monospace">{Number(r.value).toFixed(r.unit === 'Pa' || r.unit === 'm\u00B3/h' ? 0 : 1)}</text>
                            <text x="148" y={yBase + 12} fill="#94a3b8" fontSize="7" fontWeight="700" textAnchor="end">{r.unit}</text>
                            {isActive && <rect x="10" y={yBase - 8} width="140" height="30" rx="4" fill="none" stroke={r.color} strokeWidth="1" opacity="0.4"/>}
                        </React.Fragment>
                    );
                })}
                <text x="80" y="194" fill="#94a3b8" fontSize="5" fontWeight="700" textAnchor="middle" fontFamily="Inter, sans-serif">Smart-Eco</text>
            </svg>
        </div>
    );
};

const PreviewAntiFreezeCoil = ({ 
    activation = 0,
    width,
    height,
    scale = 1,
    stretchX = 1,
    stretchY = 1,
    rotX = 0,
    rotY = 0, 
    rotZ = 0,
    skewX = 0,
    skewY = 0,
    numCoils = 4,
    isActive = false
}) => {
    const intensity = activation / 100;
    const activeState = activation > 0;
    
    // In edit mode (when activation is exactly 0 but we need to show for positioning),
    // still show the component but in a dimmed/inactive state
    const isEditMode = activation === 0;
    
    let glowColor;
    if (activation === 0) {
glowColor = '#64748b'; // Gray for inactive/edit mode
    } else if (activation < 30) {
glowColor = '#3b82f6';
    } else if (activation < 60) {
glowColor = '#f59e0b';
    } else {
glowColor = '#ef4444';
    }
    
    const time = Date.now() / 500;
    
    return (
<div className="w-full h-full preserve-3d relative pointer-events-none drop-shadow-xl" style={{ width: `${width}px`, height: `${height}px` }}>
    <svg viewBox="0 0 100 100" className="w-full h-full absolute overflow-visible" style={{ background: 'transparent' }}>
        {Array.from({ length: numCoils }).map((_, i) => {
            const y = 15 + (i * (70 / (numCoils - 1)));
            const compression = activeState ? Math.sin(time + i) * 2 * intensity : 0;
            
            return (
                <g key={i}>
                    <path d={`M 20 ${y + compression + 2} Q 30 ${y - 2 + compression}, 40 ${y + compression + 2} Q 50 ${y + 6 + compression}, 60 ${y + compression + 2} Q 70 ${y - 2 + compression}, 80 ${y + compression + 2}`} fill="none" stroke="#0f172a" strokeWidth="4" opacity="0.6" strokeLinecap="round" />
                    <path d={`M 20 ${y + compression} Q 30 ${y - 4 + compression}, 40 ${y + compression} Q 50 ${y + 4 + compression}, 60 ${y + compression} Q 70 ${y - 4 + compression}, 80 ${y + compression}`} fill="none" stroke={glowColor} strokeWidth="6" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 ${4 + intensity * 12}px ${glowColor})` }} />
                    <path d={`M 20 ${y + compression} Q 30 ${y - 4 + compression}, 40 ${y + compression} Q 50 ${y + 4 + compression}, 60 ${y + compression} Q 70 ${y - 4 + compression}, 80 ${y + compression}`} fill="none" stroke="white" strokeWidth="2" opacity={0.3 + intensity * 0.4} strokeLinecap="round" />
                </g>
            );
        })}
        
        <circle cx="15" cy="50" r="5" fill={glowColor} opacity="0.8" />
        <circle cx="85" cy="50" r="5" fill={glowColor} opacity="0.8" />
        <line x1="0" y1="50" x2="15" y2="50" stroke={glowColor} strokeWidth="3" opacity="0.6" />
        <line x1="85" y1="50" x2="100" y2="50" stroke={glowColor} strokeWidth="3" opacity="0.6" />
    </svg>
    
    {activeState && <div className="absolute top-2 right-2 w-3 h-3 rounded-full anim-alarm" style={{ background: glowColor, boxShadow: `0 0 10px ${glowColor}` }} />}
</div>
    );
};

const PreviewAirFlowSimulator = ({ segments, fanSpeed, isActive, antiFreeze, heating, oat, sat, onSegmentMouseDown, allSensors, containerW, naturalW }) => {
    // ---- Coordinate-system note (2026-02 schema migration) -------------------
    // CANONICAL  : seg.offsetXFrac / seg.offsetYFrac  -- fraction of the AHU image
    //              natural width. Render px = offsetXFrac * containerW, where
    //              containerW is the CSS-rendered width of the AHU image.
    // LEGACY     : seg.offsetX / seg.offsetY          -- raw pixels, interpreted
    //              as "px at the image's natural size" and auto-scaled by
    //              (containerW / naturalW) so they stay locked to image features
    //              when the image is shrunk/grown. Migrated to Frac on next save.
    // FALLBACK   : if neither containerW nor naturalW are supplied (e.g. a host
    //              that hasn't been updated yet), legacy values render unscaled,
    //              which is the pre-migration behavior.
    // ------------------------------------------------------------------------
    const _legacyScale = (containerW && naturalW) ? (containerW / naturalW) : 1;
    const _resolveSegPx = (seg) => {
        const fx = (seg.offsetXFrac != null && containerW != null) ? (seg.offsetXFrac * containerW) : ((seg.offsetX || 0) * _legacyScale);
        const fy = (seg.offsetYFrac != null && containerW != null) ? (seg.offsetYFrac * containerW) : ((seg.offsetY || 0) * _legacyScale);
        return { x: fx, y: fy };
    };
    const animDuration = fanSpeed === 0 ? '0s' : `${(100 / fanSpeed) * 0.7}s`;
    
    // Enhanced temperature resolution with sensor lookup
    const resolveTemperature = (tempMode, tempValue, sensorData) => {
        if (tempMode === 'value') {
            // Direct numeric value
            return parseFloat(tempValue) || 20;
        }
        
        if (tempMode === 'sensor_offset') {
            // Parse "SENSOR+X" or "SENSOR-X"
            const match = (tempValue || '').match(/^([A-Z]+)([+-]\d+\.?\d*)$/);
            if (match) {
                const sensorName = match[1];
                const offset = parseFloat(match[2]);
                const baseTemp = getSensorValue(sensorName, sensorData);
                return baseTemp + offset;
            }
            // If format is wrong, treat as direct sensor
            return getSensorValue(tempValue, sensorData);
        }
        
        // Default: sensor mode
        return getSensorValue(tempValue, sensorData);
    };
    
    // Get sensor value from sensor data or use defaults
    const getSensorValue = (sensorLabel, sensorData) => {
        if (!sensorLabel) return 20;
        
        // Look up in actual sensor data
        if (sensorData && Array.isArray(sensorData)) {
            const sensor = sensorData.find(s => s.label === sensorLabel);
            if (sensor && sensor.value !== undefined) {
                return parseFloat(sensor.value);
            }
        }
        
        // Fallback to defaults based on sensor name
        const s = sensorLabel.toUpperCase();
        if (s.includes('OAT') || s.includes('OA')) return 30; 
        if (s.includes('MAT') || s.includes('MIX')) return 22; 
        if (s.includes('SAT') || s.includes('SA')) return 14;
        if (s.includes('RAT') || s.includes('RA')) return 24;
        if (s.includes('EAT') || s.includes('EA')) return 24;
        return 20;
    };

    // Enhanced color mapping: < 0°C (icy blue) to > 40°C (burning red)
    const tempToColor = (temp) => {
        const t = parseFloat(temp);
        
        if (t < 0) return '#0ea5e9';      // Icy blue
        if (t <= 5) return '#22d3ee';     // Bright cyan
        if (t <= 10) return '#06b6d4';    // Cyan
        if (t <= 15) return '#14b8a6';    // Teal
        if (t <= 20) return '#10b981';    // Green
        if (t <= 25) return '#84cc16';    // Lime
        if (t <= 30) return '#eab308';    // Yellow
        if (t <= 35) return '#f97316';    // Orange
        if (t <= 40) return '#f97316';    // Deep orange
        return '#ef4444';                 // Burning red
    };

    if (!segments || !Array.isArray(segments)) return null;

    return (
        <div className="relative w-full h-full" style={{ pointerEvents: 'none', minWidth: '2000px', minHeight: '1200px' }}>
            {segments.map((seg, sIdx) => {
                const safePath = seg.path || "M 10 50 C 30 20, 70 80, 90 50"; 
                const segId = seg.id || sIdx;
                
                // NEW: Resolve temperatures using new system
                const startTemp = resolveTemperature(
                    seg.start_temp_mode || 'sensor',
                    seg.start_temp_value || 'OAT',
                    allSensors
                );
                const endTemp = resolveTemperature(
                    seg.end_temp_mode || 'sensor',
                    seg.end_temp_value || 'SAT',
                    allSensors
                );
                
                const startColor = tempToColor(startTemp);
                const endColor = tempToColor(endTemp);
                
                return (
                    <div 
                        key={segId} 
                        style={{ 
                            position: 'absolute',
                            left: `${_resolveSegPx(seg).x}px`, 
                            top: `${_resolveSegPx(seg).y}px`,
                            width: '100px', height: '100px', 
                            marginLeft: '-50px', marginTop: '-50px', 
                            display: 'block', // Always visible
                            opacity: 1, // Always fully visible
                            transformStyle: 'preserve-3d',
                            transformOrigin: 'center',
                            transform: `scale(${seg.scale || 1}) scaleX(${seg.stretchX || 1}) scaleY(${seg.stretchY || 1}) skewX(${seg.skewX || 0}deg) skewY(${seg.skewY || 0}deg) rotateX(${seg.rotX || 0}deg) rotateY(${seg.rotY || 0}deg) rotateZ(${seg.rotZ || 0}deg)`
                        }}
                        className={isActive ? "pointer-events-auto cursor-pointer z-50" : "pointer-events-none z-40"}
                    >
                        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible pointer-events-none">
                            <defs>
                                <linearGradient id={`grad-${segId}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor={startColor} />
                                    <stop offset="100%" stopColor={endColor} />
                                </linearGradient>
                                {[-18, 0, 18].map((offset, i) => (
                                    <marker key={`m-${i}`} id={`arrow-${segId}-${i}`} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="1.5" markerHeight="1.5" orient="auto">
                                        <path d="M 0 2 L 8 5 L 0 8 z" fill={endColor} strokeLinejoin="round" />
                                    </marker>
                                ))}
                            </defs>

                            <path 
                                d={safePath} 
                                fill="none" stroke="transparent" strokeWidth="40" strokeLinecap="round"
                                className="pointer-events-auto"
                                onMouseDown={(e) => isActive && onSegmentMouseDown && onSegmentMouseDown(e, 'move-segment', segId)} 
                            />
                            
                            {isActive && <path d={safePath} fill="none" stroke="#6366f1" strokeWidth="1" strokeDasharray="2 4" opacity="0.4" className="pointer-events-none" />}

                            <g style={{ filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.3))' }}>
                                {[-18, 0, 18].map((offset, i) => (
                                    <g key={i} transform={`translate(0, ${offset})`} className="pointer-events-none">
                                        <path 
                                            d={safePath} 
                                            fill="none" stroke={`url(#grad-${segId})`} strokeWidth="4" strokeLinecap="round" 
                                            className={fanSpeed > 0 ? "animate-airflow" : ""}
                                            markerEnd={fanSpeed > 0 ? `url(#arrow-${segId}-${i})` : "none"}
                                            style={{ animationDuration: animDuration, opacity: fanSpeed > 0 ? 0.95 : 0.6 }}
                                        />
                                    </g>
                                ))}
                            </g>
                        </svg>
                        
                        {isActive && (
                            <React.Fragment>
                                <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 w-[1px] h-[20px] bg-amber-400/50 pointer-events-none"></div>
                                <div onMouseDown={(e) => onSegmentMouseDown && onSegmentMouseDown(e, 'rotate', segId)} className="absolute top-[-24px] left-1/2 -translate-x-1/2 w-4 h-4 bg-amber-400 rounded-full border-2 border-white cursor-grab active:cursor-grabbing shadow-md z-50 pointer-events-auto"></div>
                                <div onMouseDown={(e) => onSegmentMouseDown && onSegmentMouseDown(e, 'scale', segId)} className={`absolute bottom-[-6px] right-[-6px] w-4 h-4 rounded-sm border-2 border-white bg-fuchsia-500 cursor-nwse-resize shadow-md z-50 pointer-events-auto`}></div>
                            </React.Fragment>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

