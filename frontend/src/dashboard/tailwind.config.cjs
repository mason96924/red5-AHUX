/* eslint-disable */
const path = require('path');
const pub = path.join(__dirname, '../../public');

module.exports = {
    content: [
        path.join(pub, 'dashboard.html'),
        path.join(pub, 'setup.html'),
        path.join(pub, 'landing.html'),
        path.join(pub, 'equipment_mapper.html'),
        path.join(pub, 'sun_preview.html'),
        path.join(pub, 'update.html'),
        path.join(pub, 'js/**/*.js'),
        path.join(pub, 'dashboard.compiled.js'),
        path.join(pub, 'setup_walk.compiled.js'),
    ],
    theme: {
        extend: {
            // The only theme extension the legacy bundle needs is the
            // band-status badge palette -- but the band tints use core
            // Tailwind colour stops (sky-400, emerald-400, ...), so no
            // custom palette is required.  Keep this empty so the build
            // stays predictable and the output is tiny.
        },
    },
    // Safelist for class names that are built up at runtime via template
    // literals or .switch() expressions.  Tailwind's scanner CAN miss
    // these on heavily-minified bundles, so list them explicitly.
    safelist: [
        // Band-status badges (see dashboard-helpers.js#bandTint) -- all
        // permutations of border/text/bg at the chosen shade stops.
        ...['sky', 'emerald', 'amber', 'rose', 'red'].flatMap(c => ([
            `border-${c}-500/50`,
            `border-${c}-500/60`,
            `text-${c}-300`,
            `text-${c}-400`,
            `bg-${c}-500/10`,
            `bg-${c}-500/15`,
        ])),
        // Sparkline / chip animations the JSX swaps in/out dynamically.
        'animate-pulse',
        'animate-spin',
    ],
    plugins: [],
};
