// Red5-Studio V1.2 — File Browser Modal Component
// Standalone React component for browsing, uploading, moving, deleting files on the controller

const FileBrowserModal = ({
    isOpen, onClose, data, loading, currentPath, activeRoot,
    onNavigate, onSwitchRoot, onRefresh, onUpload, onCreateDir, onInitScaffold,
    onDownload, onMove, onDelete, onDeleteDir,
    selectedFiles, onToggleSelect, onToggleSelectAll, onBatchMove, onBatchDelete, onClearSelection,
    onDownloadDir, onBatchDownload, onUploadDir
}) => {
    if (!isOpen) return null;
    const isAtRootView = !activeRoot;
    const rootLabel = activeRoot === 'scripts' ? '/root/scripts' : activeRoot === 'data' ? '/root/data' : '/root';
    
    return (
        <div 
            onClick={onClose}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
            <div 
                onClick={e => e.stopPropagation()}
                className="bg-slate-900 border-2 border-sky-500/50 rounded-2xl shadow-[0_0_80px_rgba(56,189,248,0.3)] p-6 max-w-2xl w-full mx-4 relative max-h-[85vh] flex flex-col"
            >
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center text-white font-black text-lg transition-all"
                >
                    x
                </button>
                
                {/* Header buttons */}
                <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-xl font-black text-sky-400 uppercase tracking-tight">Controller Assets</h2>
                    {!isAtRootView && <button onClick={onRefresh} className="px-2 py-1 bg-slate-800 border border-slate-600 text-slate-400 rounded text-[8px] font-black uppercase tracking-wider hover:border-sky-500 hover:text-sky-400 transition-all">Refresh</button>}
                    {!isAtRootView && <button onClick={onUpload} className="px-2 py-1 bg-slate-800 border border-emerald-600 text-emerald-400 rounded text-[8px] font-black uppercase tracking-wider hover:bg-emerald-900/30 transition-all">Upload File</button>}
                    {!isAtRootView && onUploadDir && <button onClick={onUploadDir} title="Upload an entire directory tree (preserves subfolder structure). Pre-flight checks free disk." className="px-2 py-1 bg-slate-800 border border-emerald-600 text-emerald-400 rounded text-[8px] font-black uppercase tracking-wider hover:bg-emerald-900/30 transition-all">Upload Dir</button>}
                    {!isAtRootView && <button onClick={onCreateDir} className="px-2 py-1 bg-slate-800 border border-amber-600 text-amber-400 rounded text-[8px] font-black uppercase tracking-wider hover:bg-amber-900/30 transition-all">New Folder</button>}
                    {activeRoot === 'data' && <button onClick={onInitScaffold} className="px-2 py-1 bg-slate-800 border border-purple-600 text-purple-400 rounded text-[8px] font-black uppercase tracking-wider hover:bg-purple-900/30 transition-all">Init Scaffold</button>}
                </div>
                
                {/* Breadcrumb navigation */}
                <div className="flex items-center gap-1 mb-3 text-[10px] font-mono">
                    <button onClick={() => onSwitchRoot(null)} className={`px-1.5 py-0.5 rounded hover:bg-slate-700 transition-colors ${isAtRootView ? 'text-sky-400 font-black' : 'text-slate-400 hover:text-white'}`}>/root</button>
                    {activeRoot && (
                        <>
                            <span className="text-slate-600">/</span>
                            <button onClick={() => { onSwitchRoot(activeRoot); }} className={`px-1.5 py-0.5 rounded hover:bg-slate-700 transition-colors ${!currentPath ? (activeRoot === 'scripts' ? 'text-amber-400 font-black' : 'text-sky-400 font-black') : 'text-slate-400 hover:text-white'}`}>{activeRoot}</button>
                        </>
                    )}
                    {currentPath && currentPath.split('/').map((seg, si, arr) => {
                        const subPath = arr.slice(0, si + 1).join('/');
                        const isLast = si === arr.length - 1;
                        return (
                            <React.Fragment key={si}>
                                <span className="text-slate-600">/</span>
                                <button onClick={() => onNavigate(subPath)} className={`px-1.5 py-0.5 rounded hover:bg-slate-700 transition-colors ${isLast ? 'text-sky-400 font-black' : 'text-slate-400 hover:text-white'}`}>{seg}</button>
                            </React.Fragment>
                        );
                    })}
                </div>
                
                {isAtRootView ? (
                    /* ROOT VIEW: show data/ and scripts/ as folders */
                    <div className="flex-1 overflow-y-auto">
                        <div 
                            onClick={() => onSwitchRoot('data')}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800/60 border border-slate-700 hover:border-sky-500 hover:bg-sky-900/20 cursor-pointer transition-all mb-2"
                        >
                            <span className="text-sky-400 text-lg">&#128193;</span>
                            <div>
                                <div className="text-[13px] font-black text-sky-400 uppercase tracking-wider">data</div>
                                <div className="text-[9px] text-slate-500">/root/data — HTML, CSS, JS, configs, graphics</div>
                            </div>
                        </div>
                        <div 
                            onClick={() => onSwitchRoot('scripts')}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800/60 border border-slate-700 hover:border-amber-500 hover:bg-amber-900/20 cursor-pointer transition-all"
                        >
                            <span className="text-amber-400 text-lg">&#128193;</span>
                            <div>
                                <div className="text-[13px] font-black text-amber-400 uppercase tracking-wider">scripts</div>
                                <div className="text-[9px] text-slate-500">/root/scripts — app.py, collector.py, backend scripts</div>
                            </div>
                        </div>
                    </div>
                ) : loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-sky-400 font-mono text-sm animate-pulse">Scanning /root/data/ ...</div>
                    </div>
                ) : data?.error ? (
                    <div className="bg-red-950/50 border border-red-500/30 rounded-lg p-4">
                        <p className="text-red-400 font-mono text-sm">{data.error}</p>
                    </div>
                ) : data ? (
                    <React.Fragment>
                        <div className="flex items-center gap-4 mb-3 text-[10px] font-mono text-slate-500">
                            <span>{data.path}</span>
                            <span>{data.count} file{data.count !== 1 ? 's' : ''}</span>
                            <span className="ml-auto">{formatFileSize(data.files.reduce((sum, f) => sum + f.size, 0))} total</span>
                        </div>
                        <div className="overflow-y-auto flex-1 border border-slate-700/50 rounded-lg">
                            {selectedFiles.size > 0 && (
                                <div className="sticky top-0 z-20 flex items-center gap-2 px-3 py-2 bg-sky-950/90 border-b border-sky-500/30 backdrop-blur-sm">
                                    <span className="text-[10px] font-black text-sky-400">{selectedFiles.size} selected</span>
                                    <button onClick={onBatchMove} className="px-2 py-1 bg-amber-900/40 border border-amber-600/50 text-amber-400 rounded text-[8px] font-black uppercase tracking-wider hover:bg-amber-900/60 transition-all">MOV Selected</button>
                                    <button onClick={onBatchDelete} className="px-2 py-1 bg-red-900/40 border border-red-600/50 text-red-400 rounded text-[8px] font-black uppercase tracking-wider hover:bg-red-900/60 transition-all">DEL Selected</button>
                                    {onBatchDownload && <button onClick={onBatchDownload} className="px-2 py-1 bg-sky-900/40 border border-sky-600/50 text-sky-400 rounded text-[8px] font-black uppercase tracking-wider hover:bg-sky-900/60 transition-all" title="Download selected files as a single ZIP">GET Selected</button>}
                                    <button onClick={onClearSelection} className="px-2 py-1 bg-slate-800 border border-slate-600 text-slate-400 rounded text-[8px] font-black uppercase tracking-wider hover:bg-slate-700 transition-all ml-auto">Clear</button>
                                </div>
                            )}
                            <table className="w-full text-left">
                                <thead className={`sticky ${selectedFiles.size > 0 ? 'top-[36px]' : 'top-0'} bg-slate-800 z-10`}>
                                    <tr className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                                        <th className="px-2 py-2 w-8 text-center">
                                            <input type="checkbox"
                                                checked={data?.files?.filter(f => f.type !== 'directory').length > 0 && data.files.filter(f => f.type !== 'directory').every(f => selectedFiles.has(f.name))}
                                                onChange={() => onToggleSelectAll(data?.files || [])}
                                                className="w-3 h-3 accent-sky-500 cursor-pointer"
                                            />
                                        </th>
                                        <th className="px-2 py-2">Type</th>
                                        <th className="px-3 py-2">Filename</th>
                                        <th className="px-3 py-2 text-right">Size</th>
                                        <th className="px-3 py-2 text-right">Modified</th>
                                        <th className="px-3 py-2 text-center w-28"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.files.map((file, i) => (
                                        <tr key={i} className={`border-t border-slate-800 hover:bg-slate-800/50 transition-colors ${selectedFiles.has(file.name) ? 'bg-sky-950/40' : i % 2 === 0 ? 'bg-slate-900/50' : ''}`}>
                                            <td className="px-2 py-1.5 text-center">
                                                {file.type !== 'directory' ? (
                                                    <input type="checkbox"
                                                        checked={selectedFiles.has(file.name)}
                                                        onChange={() => onToggleSelect(file.name)}
                                                        className="w-3 h-3 accent-sky-500 cursor-pointer"
                                                    />
                                                ) : null}
                                            </td>
                                            <td className={`px-2 py-1.5 text-center text-base ${file.type === 'directory' ? 'text-amber-400' : fileTypeColor(file.type)}`}>{file.type === 'directory' ? '\u{1F4C1}' : fileTypeIcon(file.type)}</td>
                                            <td className="px-3 py-1.5">
                                                {file.type === 'directory' ? (
                                                    <button onClick={() => onNavigate(currentPath ? `${currentPath}/${file.name}` : file.name)} className="text-[11px] font-mono text-amber-400 hover:text-amber-300 font-bold hover:underline">{file.name}/</button>
                                                ) : (
                                                    <span className="text-[11px] font-mono text-white">{file.name}</span>
                                                )}
                                            </td>
                                            <td className="px-3 py-1.5 text-right text-[10px] font-mono text-slate-400">{file.type === 'directory' ? 'DIR' : formatFileSize(file.size)}</td>
                                            <td className="px-3 py-1.5 text-right text-[10px] font-mono text-slate-500">{formatDate(file.modified)}</td>
                                            <td className="px-3 py-1.5 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    {file.type === 'directory' ? (
                                                        <React.Fragment>
                                                            {onDownloadDir && <button onClick={() => onDownloadDir(file.name)} className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 text-slate-500 rounded text-[8px] font-black uppercase tracking-wider hover:bg-sky-900/40 hover:border-sky-500 hover:text-sky-400 transition-all" title={`Download ${file.name}/ as ZIP (preserves subfolder structure)`}>GET DIR</button>}
                                                            <button onClick={() => onDeleteDir(file.name)} className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 text-slate-500 rounded text-[8px] font-black uppercase tracking-wider hover:bg-red-900/40 hover:border-red-500 hover:text-red-400 transition-all" title={`Delete folder ${file.name}`}>RMDIR</button>
                                                        </React.Fragment>
                                                    ) : (
                                                        <React.Fragment>
                                                            <button onClick={() => onDownload(file.name)} className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 text-slate-500 rounded text-[8px] font-black uppercase tracking-wider hover:bg-sky-900/40 hover:border-sky-500 hover:text-sky-400 transition-all" title={`Download ${file.name}`}>GET</button>
                                                            <button onClick={() => onMove(file.name)} className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 text-slate-500 rounded text-[8px] font-black uppercase tracking-wider hover:bg-amber-900/40 hover:border-amber-500 hover:text-amber-400 transition-all" title={`Move ${file.name}`}>MOV</button>
                                                            <button onClick={() => onDelete(file.name)} className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 text-slate-500 rounded text-[8px] font-black uppercase tracking-wider hover:bg-red-900/40 hover:border-red-500 hover:text-red-400 transition-all" title={`Delete ${file.name}`}>DEL</button>
                                                        </React.Fragment>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-3 grid grid-cols-6 gap-2 text-[9px] font-bold">
                            {['directory', 'image', 'config', 'page', 'style', 'script'].map(t => {
                                const count = data.files.filter(f => f.type === t).length;
                                const colors = { directory: 'text-amber-400', image: 'text-sky-400', config: 'text-amber-400', page: 'text-emerald-400', style: 'text-pink-400', script: 'text-purple-400' };
                                const icons = { directory: '\u{1F4C1}', image: '\u{1F5BC}', config: '\u{1F4CB}', page: '\u{1F310}', style: '\u{1F3A8}', script: '\u{2699}' };
                                return (
                                    <div key={t} className={`flex items-center gap-1.5 ${colors[t] || 'text-slate-400'}`}>
                                        <span>{icons[t] || '\u{1F4C4}'}</span>
                                        <span className="uppercase">{t}</span>
                                        <span className="text-slate-500 ml-auto">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </React.Fragment>
                ) : null}
            </div>
        </div>
    );
};
