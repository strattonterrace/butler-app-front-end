import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Button, Input } from '@/components/ui'
import { ArrowLeft, EnvelopeSimple, CheckCircle } from '@phosphor-icons/react'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [sent, setSent] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!email) return
        setLoading(true)
        setTimeout(() => { setSent(true); setLoading(false); toast.success('Reset email sent!', { description: 'Check your inbox for a reset link.' }) }, 1000)
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0A0A0B', padding: 16 }}>
            <div style={{ width: '100%', maxWidth: 420 }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <img src="/images/butlerlogo.png" alt="Butler" style={{ height: 120, objectFit: 'contain', margin: '0 auto' }} />
                </div>

                <div style={{ backgroundColor: '#111113', border: '1px solid #27272A', borderRadius: 16, padding: 32 }}>
                    {!sent ? (
                        <>
                            <h2 style={{ fontSize: 20, fontWeight: 600, color: '#F5F5F4', marginBottom: 4 }}>Reset your password</h2>
                            <p style={{ fontSize: 14, color: '#71717A', marginBottom: 24 }}>Enter your email and we&apos;ll send you a reset link.</p>

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <Input type="email" label="Email address" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <Button type="submit" size="lg" loading={loading} style={{ width: '100%' }}>Send Reset Link</Button>
                            </form>
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '16px 0' }}>
                            <div style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                <EnvelopeSimple size={28} weight="fill" style={{ color: '#22C55E' }} />
                            </div>
                            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#F5F5F4', marginBottom: 8 }}>Check your email</h2>
                            <p style={{ fontSize: 14, color: '#71717A', marginBottom: 4 }}>We sent a password reset link to</p>
                            <p style={{ fontSize: 14, fontWeight: 500, color: '#F5F5F4', marginBottom: 20 }}>{email}</p>
                            <p style={{ fontSize: 13, color: '#71717A' }}>Didn&apos;t receive the email?{' '}
                                <button onClick={() => setSent(false)} style={{ color: '#C9A84C', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: 13 }}>Try again</button>
                            </p>
                        </div>
                    )}
                </div>

                <p style={{ textAlign: 'center', marginTop: 24 }}>
                    <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#71717A', textDecoration: 'none' }}>
                        <ArrowLeft size={14} /> Back to sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}
