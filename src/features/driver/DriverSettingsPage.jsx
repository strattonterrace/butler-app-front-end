import { useState, useRef } from 'react'
import { useAuthStore } from '@/store/authStore'
import { toast } from 'sonner'
import { Button, Input, Card } from '@/components/ui'
import { useUnsavedChanges } from '@/hooks/useEdgeCases'
import { User, Car, Clock, SignOut } from '@phosphor-icons/react'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const HOURS = ['Morning (8am–12pm)', 'Afternoon (12pm–5pm)', 'Evening (5pm–8pm)', 'Flexible']

export default function DriverSettingsPage() {
    const { currentUser, logout } = useAuthStore()
    const [saved, setSaved] = useState(false)
    const [form, setForm] = useState({
        fullName: currentUser?.fullName || 'Marcus Johnson',
        email: currentUser?.email || 'marcus@example.com',
        phone: '+1 (949) 555-1010',
        make: 'Toyota', model: 'Camry', year: '2022', plate: '7ABC123',
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        hours: 'Flexible',
    })
    const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })
    const toggleDay = (day) => setForm({ ...form, days: form.days.includes(day) ? form.days.filter(d => d !== day) : [...form.days, day] })
    const initialForm = useRef(form)
    const isDirty = JSON.stringify(form) !== JSON.stringify(initialForm.current)
    useUnsavedChanges(isDirty)
    const handleSave = () => { setSaved(true); toast.success('Settings saved'); initialForm.current = { ...form }; setTimeout(() => setSaved(false), 2000) }

    return (
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <div className="page-section">
                <h1 className="heading-1">Driver Settings</h1>
                <p className="muted-text" style={{ marginTop: 4 }}>Manage your profile, vehicle, and availability.</p>
            </div>

            {/* Profile */}
            <Card style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <User size={18} style={{ color: '#C9A84C' }} />
                    <h3 className="heading-2">Personal Information</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <Input label="Full Name" value={form.fullName} onChange={update('fullName')} />
                    <Input label="Email" type="email" value={form.email} onChange={update('email')} />
                    <Input label="Phone" value={form.phone} onChange={update('phone')} />
                </div>
            </Card>

            {/* Vehicle */}
            <Card style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <Car size={18} style={{ color: '#C9A84C' }} />
                    <h3 className="heading-2">Vehicle Information</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <Input label="Make" value={form.make} onChange={update('make')} />
                    <Input label="Model" value={form.model} onChange={update('model')} />
                    <Input label="Year" value={form.year} onChange={update('year')} />
                    <Input label="License Plate" value={form.plate} onChange={update('plate')} />
                </div>
            </Card>

            {/* Availability */}
            <Card style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <Clock size={18} style={{ color: '#C9A84C' }} />
                    <h3 className="heading-2">Availability</h3>
                </div>

                <p style={{ fontSize: 14, color: '#A1A1AA', marginBottom: 10 }}>Available Days</p>
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

            {/* Save */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                <Button onClick={handleSave}>{saved ? '✓ Saved' : 'Save Changes'}</Button>
                {saved && <span style={{ fontSize: 13, color: '#22C55E' }}>Changes saved successfully</span>}
            </div>

            {/* Logout */}
            <div style={{ paddingTop: 20, borderTop: '1px solid #27272A' }}>
                <button onClick={logout}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500, color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                    <SignOut size={18} /> Sign out
                </button>
            </div>
        </div>
    )
}
