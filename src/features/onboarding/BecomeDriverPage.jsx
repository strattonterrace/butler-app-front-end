import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Button, Input, Card } from '@/components/ui'
import { ArrowLeft, Car, User, Clock, CheckCircle } from '@phosphor-icons/react'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const HOURS = ['Morning (8am–12pm)', 'Afternoon (12pm–5pm)', 'Evening (5pm–8pm)', 'Flexible']

export default function BecomeDriverPage() {
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        fullName: '', email: '', phone: '', city: 'Orange County, CA',
        make: '', model: '', year: '', plate: '',
        days: [], hours: 'Flexible', agreed: false,
    })

    const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })
    const toggleDay = (day) => setForm({ ...form, days: form.days.includes(day) ? form.days.filter(d => d !== day) : [...form.days, day] })

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        setTimeout(() => { setSubmitted(true); setLoading(false); toast.success('Application submitted!', { description: 'We\'ll review your application and get back to you.' }) }, 1000)
    }

    if (submitted) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0A0A0B', padding: 16 }}>
                <div style={{ maxWidth: 480, textAlign: 'center' }}>
                    <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                        <CheckCircle size={32} weight="fill" style={{ color: '#22C55E' }} />
                    </div>
                    <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 'clamp(18px, 4vw, 28px)', color: '#F5F5F4', marginBottom: 8 }}>Application Submitted!</h1>
                    <p style={{ fontSize: 14, color: '#71717A', marginBottom: 24 }}>Thank you for applying. You&apos;ll receive an email once your application has been reviewed and approved by our team.</p>
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
                    <p style={{ fontSize: 14, color: '#71717A' }}>Earn money on your own schedule by fulfilling errand requests in Orange County.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Personal Info */}
                    <Card style={{ marginBottom: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                            <User size={18} style={{ color: '#C9A84C' }} />
                            <h3 className="heading-2">Personal Information</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <Input label="Full Name" placeholder="John Doe" value={form.fullName} onChange={update('fullName')} />
                            <Input label="Email" type="email" placeholder="john@example.com" value={form.email} onChange={update('email')} />
                            <Input label="Phone Number" placeholder="+1 (949) 555-0000" value={form.phone} onChange={update('phone')} />
                            <Input label="City" value={form.city} onChange={update('city')} style={{ color: '#71717A' }} />
                        </div>
                    </Card>

                    {/* Vehicle Info */}
                    <Card style={{ marginBottom: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                            <Car size={18} style={{ color: '#C9A84C' }} />
                            <h3 className="heading-2">Vehicle Information</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <Input label="Vehicle Make" placeholder="Toyota" value={form.make} onChange={update('make')} />
                            <Input label="Vehicle Model" placeholder="Camry" value={form.model} onChange={update('model')} />
                            <Input label="Vehicle Year" placeholder="2022" value={form.year} onChange={update('year')} />
                            <Input label="License Plate" placeholder="7ABC123" value={form.plate} onChange={update('plate')} />
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
                            {DAYS.map(day => (
                                <button key={day} type="button" onClick={() => toggleDay(day)}
                                    style={{
                                        padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                                        border: form.days.includes(day) ? '1px solid #C9A84C' : '1px solid #27272A',
                                        backgroundColor: form.days.includes(day) ? 'rgba(201,168,76,0.08)' : '#1A1A1F',
                                        color: form.days.includes(day) ? '#C9A84C' : '#A1A1AA', transition: 'all 150ms',
                                    }}
                                >{day}</button>
                            ))}
                        </div>

                        <p style={{ fontSize: 14, color: '#A1A1AA', marginBottom: 8 }}>Available Hours</p>
                        <select value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })}
                            style={{
                                width: '100%', height: 44, borderRadius: 10, border: '1px solid #27272A',
                                backgroundColor: '#1E1E24', padding: '0 14px', fontSize: 14, color: '#F5F5F4',
                                fontFamily: 'inherit', cursor: 'pointer', outline: 'none',
                            }}>
                            {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                        </select>
                    </Card>

                    {/* Agreement */}
                    <Card style={{ marginBottom: 24 }}>
                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
                            <input type="checkbox" checked={form.agreed} onChange={(e) => setForm({ ...form, agreed: e.target.checked })}
                                style={{ width: 18, height: 18, marginTop: 2, accentColor: '#C9A84C', cursor: 'pointer' }} />
                            <span style={{ fontSize: 14, color: '#A1A1AA', lineHeight: 1.5 }}>
                                I agree to Butler&apos;s <span style={{ color: '#C9A84C', textDecoration: 'underline' }}>driver terms and conditions</span> and confirm that all information provided is accurate.
                            </span>
                        </label>
                    </Card>

                    <Button type="submit" size="lg" loading={loading} disabled={!form.agreed} style={{ width: '100%', height: 52, fontSize: 16 }}>
                        Submit Application
                    </Button>
                </form>
            </div>
        </div>
    )
}

