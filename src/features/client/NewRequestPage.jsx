import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button, Input, Textarea } from '@/components/ui'
import { SERVICE_TYPES } from '@/lib/utils'
import { useUnsavedChanges, usePageTitle } from '@/hooks/useEdgeCases'
import { Basket, Pill, TShirt, Package, ArrowUUpLeft, CookingPot, ArrowLeft, CheckCircle } from '@phosphor-icons/react'

const SERVICE_ICONS = { grocery: Basket, pharmacy: Pill, dry_cleaning: TShirt, package: Package, retail_return: ArrowUUpLeft, food_pickup: CookingPot }
const URGENCY_OPTIONS = [
    { value: 'asap', label: 'ASAP', desc: 'As soon as possible' },
    { value: 'today', label: 'Today', desc: 'Before end of day' },
    { value: 'scheduled', label: 'Scheduled', desc: 'Pick a date & time' },
]

export default function NewRequestPage() {
    const navigate = useNavigate()
    const [selectedService, setSelectedService] = useState(null)
    const [urgency, setUrgency] = useState('asap')
    const [submitted, setSubmitted] = useState(false)
    const [form, setForm] = useState({ title: '', description: '', pickup: '', dropoff: '', instructions: '', budget: '' })
    const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

    // Warn before leaving with unsaved form data
    const isDirty = !submitted && (selectedService || Object.values(form).some(v => v))
    useUnsavedChanges(isDirty)
    usePageTitle('New Request')

    if (submitted) {
        return (
            <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center', padding: '64px 0' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <CheckCircle size={32} weight="fill" style={{ color: '#22C55E' }} />
                </div>
                <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 24, color: '#F5F5F4', marginBottom: 8 }}>Request Submitted!</h1>
                <p style={{ fontSize: 14, color: '#71717A', marginBottom: 24 }}>We&apos;ve received your request. An operator will review it shortly.</p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                    <Button variant="secondary" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
                    <Button onClick={() => { setSubmitted(false); setSelectedService(null) }}>Submit Another</Button>
                </div>
            </div>
        )
    }

    return (
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#71717A', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16, padding: 0 }}>
                <ArrowLeft size={16} /> Back
            </button>

            <div className="page-section">
                <h1 className="heading-1">New Request</h1>
                <p className="muted-text" style={{ marginTop: 4 }}>Tell us what you need — we&apos;ll handle the rest.</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); toast.success('Request submitted!', { description: 'An operator will review it shortly.' }) }}>
                {/* Service Type */}
                <div className="page-section">
                    <p className="label-text" style={{ marginBottom: 12 }}>Service Type</p>
                    <div className="grid-3col">
                        {Object.entries(SERVICE_TYPES).map(([key, svc]) => {
                            const Icon = SERVICE_ICONS[key]
                            const active = selectedService === key
                            return (
                                <button key={key} type="button" onClick={() => setSelectedService(key)}
                                    style={{
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                                        padding: '16px 12px', borderRadius: 14, textAlign: 'center', cursor: 'pointer',
                                        border: active ? '1px solid #C9A84C' : '1px solid #27272A',
                                        backgroundColor: active ? 'rgba(201,168,76,0.05)' : '#111113',
                                        color: active ? '#C9A84C' : '#A1A1AA', transition: 'all 150ms',
                                    }}
                                >
                                    <Icon size={24} weight={active ? 'fill' : 'regular'} />
                                    <span style={{ fontSize: 13, fontWeight: 500 }}>{svc.label}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {selectedService && (
                    <>
                        {/* Details */}
                        <div className="page-section" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <p className="label-text">Request Details</p>
                            <Input label="Title" placeholder="e.g., Pick up groceries from Trader Joe's" value={form.title} onChange={update('title')} />
                            <Textarea label="Description" placeholder="Detailed instructions for the driver..." value={form.description} onChange={update('description')} />
                            <Input label="Pickup Location" placeholder="Store name or address" value={form.pickup} onChange={update('pickup')} />
                            <Input label="Drop-off Location" placeholder="Your delivery address" value={form.dropoff} onChange={update('dropoff')} />
                        </div>

                        {/* Urgency */}
                        <div className="page-section">
                            <p className="label-text" style={{ marginBottom: 12 }}>Urgency</p>
                            <div className="grid-3col">
                                {URGENCY_OPTIONS.map(opt => {
                                    const active = urgency === opt.value
                                    return (
                                        <button key={opt.value} type="button" onClick={() => setUrgency(opt.value)}
                                            style={{
                                                padding: '12px', borderRadius: 14, textAlign: 'center', cursor: 'pointer',
                                                border: active ? '1px solid #C9A84C' : '1px solid #27272A',
                                                backgroundColor: active ? 'rgba(201,168,76,0.05)' : '#111113',
                                                transition: 'all 150ms',
                                            }}
                                        >
                                            <p style={{ fontSize: 14, fontWeight: 600, color: active ? '#C9A84C' : '#F5F5F4' }}>{opt.label}</p>
                                            <p style={{ fontSize: 12, color: '#71717A', marginTop: 2 }}>{opt.desc}</p>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Additional */}
                        <div className="page-section" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <p className="label-text">Additional</p>
                            <Textarea label="Special Instructions (optional)" placeholder="Any extra notes..." rows={3} value={form.instructions} onChange={update('instructions')} />
                            <Input label="Estimated Budget (optional)" placeholder="e.g., $80-100" value={form.budget} onChange={update('budget')} />
                        </div>

                        {/* Submit */}
                        <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
                            <Button type="button" variant="secondary" onClick={() => navigate(-1)} style={{ flex: 1 }}>Cancel</Button>
                            <Button type="submit" size="lg" style={{ flex: 1 }}>Submit Request</Button>
                        </div>
                    </>
                )}
            </form>
        </div>
    )
}

