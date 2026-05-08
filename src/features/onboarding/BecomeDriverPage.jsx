import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Button, Input, Card } from '@/components/ui'
import { ArrowLeft, Car, User, Clock, CheckCircle, Lock } from '@phosphor-icons/react'
import { authApi } from '@/api/auth'
import { extractErrorMessage } from '@/api/client'

const DAYS = [
    { label: 'Mon', value: 'monday' },
    { label: 'Tue', value: 'tuesday' },
    { label: 'Wed', value: 'wednesday' },
    { label: 'Thu', value: 'thursday' },
    { label: 'Fri', value: 'friday' },
    { label: 'Sat', value: 'saturday' },
    { label: 'Sun', value: 'sunday' },
]
const HOURS = [
    { label: 'Morning (8am–12pm)', value: 'morning' },
    { label: 'Afternoon (12pm–5pm)', value: 'afternoon' },
    { label: 'Evening (5pm–8pm)', value: 'evening' },
    { label: 'Flexible', value: 'flexible' },
]

export default function BecomeDriverPage() {
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        fullName: '', email: '', phone: '', password: '', confirmPassword: '',
        make: '', model: '', year: '', plate: '',
        days: [], hours: 'flexible', agreed: false,
    })

    const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })
    const toggleDay = (val) => setForm({
        ...form,
        days: form.days.includes(val)
            ? form.days.filter(d => d !== val)
            : [...form.days, val],
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.agreed) return

        if (form.password !== form.confirmPassword) {
            toast.error('Passwords do not match')
            return
        }
        if (form.password.length < 8) {
            toast.error('Password must be at least 8 characters')
            return
        }
        if (form.days.length === 0) {
            toast.error('Select at least one available day')
            return
        }
        if (!form.make || !form.model || !form.year || !form.plate) {
            toast.error('Vehicle information is required')
            return
        }

        setLoading(true)
        try {
            await authApi.registerDriver({
                fullName: form.fullName,
                email: form.email,
                phone: form.phone,
                password: form.password,
                confirmPassword: form.confirmPassword,
                vehicleMake: form.make,
                vehicleModel: form.model,
                vehicleYear: parseInt(form.year),
                licensePlate: form.plate,
                availableDays: form.days,
                availableHours: form.hours,
            })
            setSubmitted(true)
            toast.success('Application submitted!', {
                description: 'We\'ll review your application and get back to you.',
            })
        } catch (error) {
            toast.error('Submission failed', { description: extractErrorMessage(error) })
        } finally {
            setLoading(false)
        }
    }

    if (submitted) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0A0A0B', padding: 16 }}>
                <div style={{ maxWidth: 480, textAlign: 'center' }}>
                    <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                        <CheckCircle size={32} weight="fill" style={{ color: '#22C55E' }} />
                    </div>
                    <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 'clamp(18px, 4vw, 28px)', color: '#F5F5F4', marginBottom: 8 }}>Application Submitted!</h1>
                    <p style={{ fontSize: 14, color: '#71717A', marginBottom: 8 }}>
                        Thank you for applying to be a Butler driver.
                    </p>
                    <p style={{ fontSize: 14, color: '#71717A', marginBottom: 24 }}>
                        Our team will review your application. Once approved, you can sign in and start accepting requests.
                    </p>
                    <Link to="/login"><Button variant="secondary">Back to Sign In</Button></Link>
                </div>
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0B', padding: '40px 16px' }}>
            <div style={{ maxWidth: 600, margin: '0 auto' }}>
                <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#71717A', textDecoration: 'none', marginBottom: 24 }}>
                    <ArrowLeft size={14} /> Back to sign in
                </Link>

                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <img src="/images/butlerlogo.png" alt="Butler" style={{ height: 80, objectFit: 'contain', margin: '0 auto 12px' }} />
                    <h1 style={{ fontSize: 24, fontWeight: 600, color: '#F5F5F4', marginBottom: 8 }}>Become a Butler Driver</h1>
                    <p style={{ fontSize: 14, color: '#71717A' }}>Earn money on your schedule by fulfilling requests in Orange County.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Personal Info */}
                    <Card style={{ marginBottom: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                            <User size={18} style={{ color: '#C9A84C' }} />
                            <h3 className="heading-2">Personal Information</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <Input label="Full Name" placeholder="John Doe" value={form.fullName} onChange={update('fullName')} required />
                            <Input label="Email" type="email" placeholder="john@example.com" value={form.email} onChange={update('email')} required />
                            <Input label="Phone Number" placeholder="+1 (949) 555-0000" value={form.phone} onChange={update('phone')} />
                        </div>
                    </Card>

                    {/* Account Security */}
                    <Card style={{ marginBottom: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                            <Lock size={18} style={{ color: '#C9A84C' }} />
                            <h3 className="heading-2">Create Password</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <Input label="Password" type="password" placeholder="Min 8 characters" value={form.password} onChange={update('password')} required />
                            <Input label="Confirm Password" type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={update('confirmPassword')} required />
                        </div>
                    </Card>

                    {/* Vehicle Info */}
                    <Card style={{ marginBottom: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                            <Car size={18} style={{ color: '#C9A84C' }} />
                            <h3 className="heading-2">Vehicle Information</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <Input label="Vehicle Make" placeholder="Toyota" value={form.make} onChange={update('make')} required />
                            <Input label="Vehicle Model" placeholder="Camry" value={form.model} onChange={update('model')} required />
                            <Input label="Vehicle Year" placeholder="2022" value={form.year} onChange={update('year')} required />
                            <Input label="License Plate" placeholder="7ABC123" value={form.plate} onChange={update('plate')} required />
                        </div>
                    </Card>

                    {/* Availability */}
                    <Card style={{ marginBottom: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                            <Clock size={18} style={{ color: '#C9A84C' }} />
                            <h3 className="heading-2">Availability</h3>
                        </div>

                        <p style={{ fontSize: 14, color: '#A1A1AA', marginBottom: 12 }}>Available Days</p>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                            {DAYS.map(({ label, value }) => (
                                <button key={value} type="button" onClick={() => toggleDay(value)}
                                    style={{
                                        padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                                        border: form.days.includes(value) ? '1px solid #C9A84C' : '1px solid #27272A',
                                        backgroundColor: form.days.includes(value) ? 'rgba(201,168,76,0.08)' : '#1A1A1F',
                                        color: form.days.includes(value) ? '#C9A84C' : '#A1A1AA', transition: 'all 150ms',
                                    }}
                                >{label}</button>
                            ))}
                        </div>

                        <p style={{ fontSize: 14, color: '#A1A1AA', marginBottom: 8 }}>Available Hours</p>
                        <select value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })}
                            style={{ width: '100%', height: 44, borderRadius: 10, border: '1px solid #27272A', backgroundColor: '#1E1E24', padding: '0 14px', fontSize: 14, color: '#F5F5F4', fontFamily: 'inherit', cursor: 'pointer', outline: 'none' }}>
                            {HOURS.map(h => <option key={h.value} value={h.value}>{h.label}</option>)}
                        </select>
                    </Card>

                    {/* Agreement */}
                    <Card style={{ marginBottom: 24 }}>
                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
                            <input type="checkbox" checked={form.agreed} onChange={(e) => setForm({ ...form, agreed: e.target.checked })}
                                style={{ width: 18, height: 18, marginTop: 2, accentColor: '#C9A84C', cursor: 'pointer' }} />
                            <span style={{ fontSize: 14, color: '#A1A1AA', lineHeight: 1.5 }}>
                                I agree to Butler&apos;s <span style={{ color: '#C9A84C', textDecoration: 'underline' }}>driver terms and conditions</span> and confirm all information provided is accurate.
                            </span>
                        </label>
                    </Card>

                    <Button type="submit" size="lg" loading={loading} disabled={!form.agreed} style={{ width: '100%', height: 52, fontSize: 16 }}>
                        Submit Application
                    </Button>

                    {/* Client CTA */}
                    <div style={{ marginTop: 20, padding: '16px 20px', backgroundColor: '#111113', border: '1px solid #27272A', borderRadius: 12, textAlign: 'center' }}>
                        <p style={{ fontSize: 13, color: '#71717A', marginBottom: 8 }}>Looking to book services instead?</p>
                        <Link to="/register" style={{ fontSize: 14, fontWeight: 600, color: '#C9A84C', textDecoration: 'none' }}>
                            Sign up as a client →
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
