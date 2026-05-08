import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/authStore'
import { loginSchema } from '@/lib/validations'
import { Button, Input } from '@/components/ui'
import { Eye, EyeSlash } from '@phosphor-icons/react'
import { extractErrorMessage } from '@/api/client'

const ROLE_DASHBOARDS = {
    client: '/dashboard',
    operator: '/operator',
    driver: '/driver',
    admin: '/admin',
}

export default function LoginPage() {
    const { login } = useAuthStore()
    const navigate = useNavigate()
    const location = useLocation()
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    })

    const onSubmit = async (data) => {
        setLoading(true)
        try {
            const user = await login(data.email, data.password)

            // Pending drivers cannot access the driver dashboard yet
            if (user.role === 'driver' && user.approvalStatus !== 'approved') {
                toast.info('Application pending', { description: 'Your driver application is under review. We\'ll notify you once approved.' })
                navigate('/driver/pending', { replace: true })
                return
            }

            toast.success('Welcome back!', { description: `Signed in as ${user.fullName}.` })
            const from = location.state?.from?.pathname || ROLE_DASHBOARDS[user.role] || '/dashboard'
            navigate(from, { replace: true })
        } catch (error) {
            toast.error('Sign in failed', { description: extractErrorMessage(error) })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0A0A0B', padding: '16px' }}>
            <div style={{ width: '100%', maxWidth: 420 }}>
                {/* Brand */}
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <img src="/images/butlerlogo.png" alt="Butler" style={{ height: 120, objectFit: 'contain', margin: '0 auto' }} />
                    <p style={{ fontSize: 14, color: '#71717A', marginTop: 12 }}>Premium. Personal. Effortless.</p>
                </div>

                {/* Card */}
                <div style={{ backgroundColor: '#111113', border: '1px solid #27272A', borderRadius: 16, padding: 32 }}>
                    <h2 style={{ fontSize: 20, fontWeight: 600, color: '#F5F5F4', marginBottom: 4, fontFamily: "'Satoshi', sans-serif" }}>Welcome back</h2>
                    <p style={{ fontSize: 14, color: '#71717A', marginBottom: 24 }}>Sign in to your account</p>

                    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                            <Input type="email" label="Email" placeholder="you@example.com" {...register('email')} />
                            {errors.email && <p style={{ fontSize: 12, color: '#EF4444', marginTop: 4 }}>{errors.email.message}</p>}
                        </div>
                        <div>
                            <div style={{ position: 'relative' }}>
                                <Input type={showPassword ? 'text' : 'password'} label="Password" placeholder="Enter your password" {...register('password')} />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: 12, top: 36, background: 'none', border: 'none', cursor: 'pointer', color: '#71717A', padding: 4 }}>
                                    {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && <p style={{ fontSize: 12, color: '#EF4444', marginTop: 4 }}>{errors.password.message}</p>}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Link to="/forgot-password" style={{ fontSize: 14, color: '#C9A84C', textDecoration: 'none' }}>Forgot password?</Link>
                        </div>
                        <Button type="submit" size="lg" loading={loading} style={{ width: '100%' }}>Sign In</Button>
                    </form>
                </div>

                <p style={{ textAlign: 'center', fontSize: 14, color: '#71717A', marginTop: 24 }}>
                    Don&apos;t have an account?{' '}
                    <Link to="/register" style={{ color: '#C9A84C', textDecoration: 'none', fontWeight: 500 }}>Sign up</Link>
                </p>
            </div>
        </div>
    )
}
