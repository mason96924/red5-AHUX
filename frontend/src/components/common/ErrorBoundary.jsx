/**
 * Error Boundary Component
 * 
 * Catches React rendering crashes and displays error UI
 */

import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            hasError: false, 
            error: null, 
            errorInfo: null 
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('React Error Boundary caught:', error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex h-screen items-center justify-center bg-slate-900 text-red-500 p-10 font-mono text-sm">
                    <div>
                        <h1 className="text-2xl font-bold mb-4">React Rendering Crash Prevented</h1>
                        <p className="mb-4">System caught the following error instead of a black screen:</p>
                        <p className="font-bold text-white">
                            {this.state.error ? this.state.error.toString() : 'Unknown error'}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
