// Red5-Studio V1.2 — Image Picker Modal Component
// Standalone React component for browsing and selecting images from the controller

const ImagePickerModal = ({ isOpen, onClose, files, loading, currentPath, onNavigate, onSelect }) => {
    if (!isOpen) return null;
    
    return (
        <div 
            onClick={onClose}
            className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
            <div 
                onClick={e => e.stopPropagation()}
                className="bg-slate-900 border-2 border-emerald-500/50 rounded-2xl shadow-[0_0_80px_rgba(16,185,129,0.3)] p-6 max-w-xl w-full mx-4 relative max-h-[75vh] flex flex-col"
            >
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center text-white font-black text-lg transition-all"
                >
                    x
                </button>
                
                <h2 className="text-lg font-black text-emerald-400 uppercase tracking-tight mb-1">
                    Select Image from Controller
                </h2>
                <div className="flex items-center gap-1 mb-3 text-[10px] font-mono">
                    <button onClick={() => onNavigate('')} className={`px-1.5 py-0.5 rounded hover:bg-slate-700 transition-colors ${!currentPath ? 'text-emerald-400 font-black' : 'text-slate-400 hover:text-white'}`}>/root/data</button>
                    {currentPath && currentPath.split('/').map((seg, si, arr) => {
                        const subPath = arr.slice(0, si + 1).join('/');
                        const isLast = si === arr.length - 1;
                        return (
                            <React.Fragment key={si}>
                                <span className="text-slate-600">/</span>
                                <button onClick={() => onNavigate(subPath)} className={`px-1.5 py-0.5 rounded hover:bg-slate-700 transition-colors ${isLast ? 'text-emerald-400 font-black' : 'text-slate-400 hover:text-white'}`}>{seg}</button>
                            </React.Fragment>
                        );
                    })}
                </div>
                
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-emerald-400 font-mono text-sm animate-pulse">Loading images...</div>
                    </div>
                ) : files.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-slate-500 font-mono text-sm">No images or folders found here</p>
                        <p className="text-slate-600 text-[10px] mt-2">Navigate to a folder containing images.</p>
                    </div>
                ) : (
                    <div className="overflow-y-auto flex-1 grid grid-cols-3 gap-3">
                        {files.map((file, i) => {
                            if (file.type === 'directory') {
                                return (
                                    <button 
                                        key={i}
                                        onClick={() => onNavigate(currentPath ? `${currentPath}/${file.name}` : file.name)}
                                        className="group flex flex-col items-center bg-slate-800 border-2 border-amber-700/50 rounded-lg p-2 hover:border-amber-500 hover:bg-slate-800/80 transition-all cursor-pointer"
                                    >
                                        <div className="w-full aspect-square bg-slate-950 rounded overflow-hidden mb-2 flex items-center justify-center text-4xl text-amber-400/60 group-hover:text-amber-400 transition-colors">
                                            {'\u{1F4C1}'}
                                        </div>
                                        <span className="text-[9px] font-mono text-amber-400 group-hover:text-amber-300 truncate w-full text-center transition-colors font-bold">{file.name}/</span>
                                    </button>
                                );
                            }
                            const apiUrl = window.API_BASE_URL || '';
                            const fullRelPath = currentPath ? `${currentPath}/${file.name}` : file.name;
                            // Pick the right serve path per file type:
                            //   - SVG  -> /assets/  (vector; browsers
                            //             render natively, no rasterise)
                            //   - raster -> /api/thumb (Pillow normalises
                            //             CMYK / odd JPEGs that Windows
                            //             Chrome/Edge refuse via Skia,
                            //             and downsamples for the picker)
                            // /api/thumb falls back to /assets/ via 302
                            // if Pillow is missing, so this is safe on
                            // any deployment.
                            const isSvg    = /\.svg$/i.test(file.name);
                            const encoded  = encodeURIComponent(fullRelPath);
                            const thumbURL = isSvg
                                ? `${apiUrl}/assets/${fullRelPath}`
                                : `${apiUrl}/api/thumb?path=${encoded}&max=256`;
                            return (
                                <button 
                                    key={i}
                                    onClick={() => onSelect(file.name)}
                                    className="group flex flex-col items-center bg-slate-800 border-2 border-slate-700 rounded-lg p-2 hover:border-emerald-500 hover:bg-slate-800/80 transition-all cursor-pointer"
                                >
                                    <div className="w-full aspect-square bg-slate-950 rounded overflow-hidden mb-2 flex items-center justify-center">
                                        <img 
                                            src={thumbURL} 
                                            className="max-w-full max-h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity" 
                                            alt={file.name}
                                            onError={(e) => {
                                                /* Informative fallback.  The old generic "No preview"
                                                   left operators guessing whether the file was bad,
                                                   the path was wrong, or the browser was at fault.
                                                   The thumb endpoint already converts CMYK / odd
                                                   JPEGs, so reaching this branch means Pillow
                                                   couldn't decode it OR the path is wrong.  Show
                                                   the extension so a CMYK-vs-corrupt distinction
                                                   can be made by re-uploading. */
                                                e.target.style.display='none';
                                                var ext = (file.name.split('.').pop() || '').toLowerCase();
                                                e.target.parentNode.innerHTML =
                                                    '<div style="text-align:center;line-height:1.3;">'
                                                  + '<div style="color:#64748b;font-size:24px;">' + (ext === 'svg' ? '\u25C6' : '\u25A1') + '</div>'
                                                  + '<div style="color:#475569;font-size:10px;margin-top:4px;">No preview</div>'
                                                  + '<div style="color:#334155;font-size:8px;margin-top:2px;">.' + ext + '</div>'
                                                  + '</div>';
                                            }}
                                        />
                                    </div>
                                    <span className="text-[9px] font-mono text-slate-400 group-hover:text-emerald-400 truncate w-full text-center transition-colors">{file.name}</span>
                                    <span className="text-[8px] font-mono text-slate-600">{formatFileSize(file.size)}</span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
