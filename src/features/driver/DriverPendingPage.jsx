import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'
import { Clock } from '@phosphor-icons/react'
import { Button } from '@/components/ui'
import { usePageTitle } from '@/hooks/useEdgeCases'

export default function DriverPendingPage() {
    const { currentUser, logout } = useAuthStore()
    const navigate = useNavigate()
    usePageTitle('Application Pending')

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    // Approved drivers who land here get sent to the real dashboard
    if (currentUser?.approvalStatus === 'approved') {
        navigate('/driver', { replace: true })
        return null
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0B', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <div style={{ maxWidth: 480, textAlign: 'center' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', backgroundColor: 'rgba(201,168,76,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '1px solid rgba(201,168,76,0.2)' }}>
                    <Clock size={36} weight="regular" style={{ color: '#C9A84C' }} />
                </div>

                <h1 style={{ fontSize: 24, fontWeight: 600, color: '#F5F5F4', marginBottom: 12, fontFamily: "'Satoshi', sans-serif" }}>
                    Application Under Review
                </h1>
                <p style={{ fontSize: 15, color: '#71717A', lineHeight: 1.6, marginBottom: 8 }}>
                    Hi {currentUser?.fullName?.split(' ')[0]}, your driver application has been received.
                </p>
                <p style={{ fontSize: 14, color: '#71717A', lineHeight: 1.6, marginBottom: 32 }}>
                    Our team reviews all applications within 1–2 business days. You&apos;ll receive an email at <strong style={{ color: '#A1A1AA' }}>{currentUser?.email}</strong> once you&apos;re approved.
                </p>

                <div style={{ backgroundColor: '#111113', border: '1px solid #27272A', borderRadius: 12, padding: 20, marginBottom: 32, textAlign: 'left' }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#A1A1AA', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>What happens next</p>
                    {[
                        { step: '1', text: 'Background check initiated' },
                        { step: '2', text: 'Vehicle and license verification' },
                        { step: '3', text: 'Admin approves your account' },
                        { step: '4', text: 'You\'re ready to start accepting requests' },
                    ].map(({ step, text }) => (
                        <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                            <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: '#1A1A1F', border: '1px solid #27272A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#C9A84C', flexShrink: 0 }}>{step}</div>
                            <span style={{ fontSize: 14, color: '#A1A1AA' }}>{text}</span>
                        </div>
                    ))}
                </div>

                <Button variant="ghost" onClick={handleLogout} style={{ color: '#71717A', fontSize: 14 }}>
                    Sign out
                </Button>
            </div>
        </div>
    )
}
