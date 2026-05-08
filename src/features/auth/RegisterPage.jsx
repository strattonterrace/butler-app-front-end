import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/authStore'
import { registerSchema } from '@/lib/validations'
import { Button, Input } from '@/components/ui'
import { Eye, EyeSlash } from '@phosphor-icons/react'
import { extractErrorMessage } from '@/api/client'

export default function RegisterPage() {
    const { register: registerUser } = useAuthStore()
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: { fullName: '', email: '', phone: '', password: '', confirmPassword: '' },
    })

    const onSubmit = async (data) => {
        setLoading(true)
        try {
            await registerUser(data)
            toast.success('Account created!', { description: 'Choose your subscription plan next.' })
            navigate('/subscribe')
        } catch (error) {
            toast.error('Registration failed', { description: extractErrorMessage(error) })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0A0A0B', padding: 16 }}>
            <div style={{ width: '100%', maxWidth: 420 }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <img src="/images/butlerlogo.png" alt="Butler" style={{ height: 120, objectFit: 'contain', margin: '0 auto' }} />
                    <p style={{ fontSize: 14, color: '#71717A', marginTop: 12 }}>Create your account</p>
                </div>

                <div style={{ backgroundColor: '#111113', border: '1px solid #27272A', borderRadius: 16, padding: 32 }}>
                    <h2 style={{ fontSize: 20, fontWeight: 600, color: '#F5F5F4', marginBottom: 4, fontFamily: "'Satoshi', sans-serif" }}>Get started</h2>
                    <p style={{ fontSize: 14, color: '#71717A', marginBottom: 24 }}>Join Butler and start delegating</p>

                    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                            <Input label="Full Name" placeholder="Jane Smith" {...register('fullName')} />
                            {errors.fullName && <p style={{ fontSize: 12, color: '#EF4444', marginTop: 4 }}>{errors.fullName.message}</p>}
                        </div>
                        <div>
                            <Input type="email" label="Email" placeholder="you@example.com" {...register('email')} />
                            {errors.email && <p style={{ fontSize: 12, color: '#EF4444', marginTop: 4 }}>{errors.email.message}</p>}
                        </div>
                        <div>
                            <Input type="tel" label="Phone Number" placeholder="+1 (949) 555-0000" {...register('phone')} />
                            {errors.phone && <p style={{ fontSize: 12, color: '#EF4444', marginTop: 4 }}>{errors.phone.message}</p>}
                        </div>
                        <div>
                            <div style={{ position: 'relative' }}>
                                <Input type={showPassword ? 'text' : 'password'} label="Password" placeholder="Min 8 characters" {...register('password')} />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: 12, top: 36, background: 'none', border: 'none', cursor: 'pointer', color: '#71717A', padding: 4 }}>
                                    {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && <p style={{ fontSize: 12, color: '#EF4444', marginTop: 4 }}>{errors.password.message}</p>}
                        </div>
                        <div>
                            <Input type="password" label="Confirm Password" placeholder="Repeat password" {...register('confirmPassword')} />
                            {errors.confirmPassword && <p style={{ fontSize: 12, color: '#EF4444', marginTop: 4 }}>{errors.confirmPassword.message}</p>}
                        </div>
                        <Button type="submit" size="lg" loading={loading} style={{ width: '100%' }}>Create Account</Button>
                    </form>
                </div>

                <p style={{ textAlign: 'center', fontSize: 14, color: '#71717A', marginTop: 24 }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#C9A84C', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
                </p>

                {/* Driver CTA */}
                <div style={{ marginTop: 16, padding: '16px 20px', backgroundColor: '#111113', border: '1px solid #27272A', borderRadius: 12, textAlign: 'center' }}>
                    <p style={{ fontSize: 13, color: '#71717A', marginBottom: 8 }}>Want to earn money on your schedule?</p>
                    <Link to="/become-driver" style={{ fontSize: 14, fontWeight: 600, color: '#C9A84C', textDecoration: 'none' }}>
                        Apply to drive for Butler →
                    </Link>
                </div>
            </div>
        </div>
    )
}
