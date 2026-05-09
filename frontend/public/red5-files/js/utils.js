// Red5-Studio V1.2 — Shared Utilities
// Format helpers, file type icons/colors, category-to-directory mapping

const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024; const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const d = new Date(timestamp * 1000);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
};

const fileTypeIcon = (type) => {
    if (type === 'directory') return '\u{1F4C1}';
    if (type === 'image') return '\u{1F5BC}';
    if (type === 'config') return '\u{1F4CB}';
    if (type === 'page') return '\u{1F310}';
    if (type === 'style') return '\u{1F3A8}';
    if (type === 'script') return '\u{2699}';
    return '\u{1F4C4}';
};

const fileTypeColor = (type) => {
    if (type === 'directory') return 'text-amber-400';
    if (type === 'image') return 'text-sky-400';
    if (type === 'config') return 'text-amber-400';
    if (type === 'page') return 'text-emerald-400';
    if (type === 'style') return 'text-pink-400';
    if (type === 'script') return 'text-purple-400';
    return 'text-slate-400';
};

const categoryToGraphicsDir = (cat) => {
    const map = {
        'ahu_types': 'graphics/equipments/AHUs',
        'vav_types': 'graphics/equipments/VAVs',
        'vfd_types': 'graphics/equipments/VFDs',
        'diff_pr_types': 'graphics/equipments/DIFF_PRs',
        'chiller_types': 'graphics/equipments/CHILLERs',
        'ct_types': 'graphics/equipments/CTs',
    };
    return map[cat] || 'graphics/equipments';
};
