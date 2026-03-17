import { Component } from 'react'

export class ErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: '#0A0A0B', padding: 20,
                }}>
                    <div style={{ textAlign: 'center', maxWidth: 420 }}>
                        <div style={{
                            width: 64, height: 64, borderRadius: '50%', backgroundColor: 'rgba(239,68,68,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 20px', fontSize: 28,
                        }}>⚠️</div>
                        <h1 style={{ fontSize: 24, fontWeight: 600, color: '#F5F5F4', marginBottom: 8, fontFamily: "'Instrument Serif', Georgia, serif" }}>
                            Something went wrong
                        </h1>
                        <p style={{ fontSize: 14, color: '#71717A', lineHeight: 1.6, marginBottom: 24 }}>
                            An unexpected error occurred. Please try refreshing the page.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                padding: '10px 24px', borderRadius: 10, fontSize: 14, fontWeight: 500,
                                backgroundColor: '#C9A84C', color: '#0A0A0B', border: 'none',
                                cursor: 'pointer', fontFamily: 'Satoshi, sans-serif',
                            }}
                        >
                            Refresh Page
                        </button>
                        {this.state.error && (
                            <details style={{ marginTop: 24, textAlign: 'left' }}>
                                <summary style={{ fontSize: 12, color: '#71717A', cursor: 'pointer' }}>Error details</summary>
                                <pre style={{ fontSize: 11, color: '#EF4444', marginTop: 8, padding: 12, backgroundColor: '#111113', borderRadius: 8, overflow: 'auto', maxHeight: 120 }}>
                                    {this.state.error.toString()}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            )
        }
        return this.props.children
    }
}
