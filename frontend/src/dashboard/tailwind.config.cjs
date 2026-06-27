/* eslint-disable */
// ---------------------------------------------------------------------------
// Dedicated Tailwind config for the V1.9 / V2.0 legacy dashboard bundle.
//
// Why this exists (instead of using /app/frontend/tailwind.config.js):
//   The CRA-side config is theme-extended with shadcn/ui CSS-variable
//   colours (hsl(var(--background)) etc.) that none of the legacy HTML
//   files load.  Pulling that config in here would emit shadcn variants
//   we never use AND would not scan the dashboard's compiled bundle.
//
// What this scans:
//   - The compiled dashboard bundle (so JSX class strings are covered).
//   - Every HTML / JS file under /app/frontend/public/ that drives the
//     legacy dashboard, the Setup Walk, the Repair Mode UI, etc.
//
// Output:
//   /app/frontend/public/dashboard.tailwind.css   (~30-40 KB gzipped)
//   replaces the ~200 KB cdn.tailwindcss.com runtime JIT.
// ---------------------------------------------------------------------------
module.exports = {
    content: [
        // Legacy multi-page HTML shells.
        '/app/frontend/public/dashboard.html',
        '/app/frontend/public/setup.html',
        '/app/frontend/public/landing.html',
        '/app/frontend/public/equipment_mapper.html',
        '/app/frontend/public/sun_preview.html',
        '/app/frontend/public/update.html',
        // React JSX sources (pre-Babel) and the compiled bundle.  The
        // compiled bundle is the SAFETY NET: even if a class is built
        // up at runtime via string concat, the minified output will
        // still surface the substring for Tailwind's scanner.
        '/app/frontend/public/js/**/*.js',
        '/app/frontend/public/dashboard.compiled.js',
        '/app/frontend/public/setup_walk.compiled.js',
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
