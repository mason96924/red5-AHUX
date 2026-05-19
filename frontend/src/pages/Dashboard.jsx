/**
 * /dashboard is a legacy React route from an earlier scaffold.  In V2.0
 * the live dashboard is the V1.9 SPA served at /dashboard.html.  This
 * stub redirects any old links / bookmarks / OAuth landings to the
 * correct page so operators never see the half-built React shell.
 */
import { useEffect } from 'react';

const Dashboard = () => {
    useEffect(() => {
        window.location.replace('/dashboard.html');
    }, []);
    return (
        <div className="min-h-screen w-screen bg-slate-950 text-slate-100 grid place-items-center font-mono text-sm"
             data-testid="dashboard-redirect-stub">
            Loading dashboard...
        </div>
    );
};

export default Dashboard;
