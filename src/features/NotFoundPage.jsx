import { Link } from 'react-router-dom'
import { Button } from '@/components/ui'

export default function NotFoundPage() {
    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: '#0A0A0B', padding: 20,
        }}>
            <div style={{ textAlign: 'center', maxWidth: 420 }}>
                <img src="/images/butlerlogo.png" alt="Butler" style={{ height: 48, objectFit: 'contain', margin: '0 auto 32px' }} />
                <h1 style={{ fontSize: 80, fontWeight: 700, color: '#27272A', lineHeight: 1, marginBottom: 8 }}>404</h1>
                <h2 style={{ fontSize: 22, fontWeight: 600, color: '#F5F5F4', marginBottom: 8, fontFamily: "'Instrument Serif', Georgia, serif" }}>
                    Page not found
                </h2>
                <p style={{ fontSize: 14, color: '#71717A', lineHeight: 1.6, marginBottom: 24 }}>
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link to="/dashboard">
                    <Button>Go to Dashboard</Button>
                </Link>
            </div>
        </div>
    )
}
