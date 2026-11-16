import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Button, Input } from '@/components/ui'
import { ArrowLeft, CheckCircle } from '@phosphor-icons/react'
import { authApi } from '@/api/auth'
import { extractErrorMessage } from '@/api/client'

export default function ResetPasswordPage() {
    const [params] = useSearchParams()
    const navigate = useNavigate()
    const uid = params.get('uid') || ''
    const token = params.get('token') || ''
    const invalidLink = !uid || !token

    const [form, setForm] = useState({ password: '', confirmPassword: '' })
    const [loading, setLoading] = useState(false)
    const [done, setDone] = useState(false)
    const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (form.password.length < 8) {
            toast.error('Password too short', { description: 'Use at least 8 characters.' })
            return
        }
        if (form.password !== form.confirmPassword) {
            toast.error('Passwords do not match')
            return
        }
        setLoading(true)
        try {
            await authApi.confirmPasswordReset({
                uid, token, password: form.password, confirmPassword: form.confirmPassword,
            })
            setDone(true)
            toast.success('Password updated!', { description: 'You can now sign in with your new password.' })
            setTimeout(() => navigate('/login'), 1800)
        } catch (error) {
            toast.error('Could not reset password', { description: extractErrorMessage(error) })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0A0A0B', padding: 16 }}>
            <div style={{ width: '100%', maxWidth: 420 }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <img src="/images/butlerlogo.png" alt="Butler" style={{ height: 120, objectFit: 'contain', margin: '0 auto' }} />
                </div>

                <div style={{ backgroundColor: '#111113', border: '1px solid #27272A', borderRadius: 16, padding: 32 }}>
                    {invalidLink ? (
                        <div style={{ textAlign: 'center', padding: '16px 0' }}>
                            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#F5F5F4', marginBottom: 8 }}>Invalid reset link</h2>
                            <p style={{ fontSize: 14, color: '#71717A', marginBottom: 20 }}>
                                This password reset link is incomplete or has expired. Request a fresh one to continue.
                            </p>
                            <Link to="/forgot-password">
                                <Button size="lg" style={{ width: '100%' }}>Request a new link</Button>
                            </Link>
                        </div>
                    ) : done ? (
                        <div style={{ textAlign: 'center', padding: '16px 0' }}>
                            <div style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                <CheckCircle size={28} weight="fill" style={{ color: '#22C55E' }} />
                            </div>
                            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#F5F5F4', marginBottom: 8 }}>Password updated</h2>
                            <p style={{ fontSize: 14, color: '#71717A' }}>Taking you to sign in…</p>
                        </div>
                    ) : (
                        <>
                            <h2 style={{ fontSize: 20, fontWeight: 600, color: '#F5F5F4', marginBottom: 4 }}>Set a new password</h2>
                            <p style={{ fontSize: 14, color: '#71717A', marginBottom: 24 }}>Choose a new password for your Butler account.</p>

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <Input
                                    type="password"
                                    label="New password"
                                    placeholder="At least 8 characters"
                                    value={form.password}
                                    onChange={update('password')}
                                />
                                <Input
                                    type="password"
                                    label="Confirm new password"
                                    placeholder="Repeat your new password"
                                    value={form.confirmPassword}
                                    onChange={update('confirmPassword')}
                                />
                                <Button type="submit" size="lg" loading={loading} style={{ width: '100%' }}>
                                    Update Password
                                </Button>
                            </form>
                        </>
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
