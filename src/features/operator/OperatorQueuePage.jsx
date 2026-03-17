import { useState, useEffect } from 'react'
import { Badge, Button, Card, SkeletonCard } from '@/components/ui'
import { toast } from 'sonner'
import { formatDate, SERVICE_TYPES } from '@/lib/utils'
import { MOCK_REQUESTS, MOCK_ALL_USERS } from '@/mock/data'
import { PageTransition } from '@/components/motion/Animations'
import { usePageTitle } from '@/hooks/useEdgeCases'
import { MapPin, CalendarBlank, MagnifyingGlass, UserCirclePlus, Eye } from '@phosphor-icons/react'

const STATUS_BADGE = { submitted: 'gold', reviewed: 'info' }
const STATUS_LABEL = { submitted: 'Submitted', reviewed: 'Reviewed' }

export default function OperatorQueuePage() {
    usePageTitle('Request Queue')
    const [search, setSearch] = useState('')
    const [serviceFilter, setServiceFilter] = useState('')
    const [urgencyFilter, setUrgencyFilter] = useState('')
    const drivers = MOCK_ALL_USERS.filter(u => u.role === 'driver' && u.approvalStatus === 'approved')
    const queue = MOCK_REQUESTS.filter(r => ['submitted', 'reviewed'].includes(r.status))
        .filter(r => !search || r.title.toLowerCase().includes(search.toLowerCase()))
        .filter(r => !serviceFilter || r.serviceType === serviceFilter)
        .filter(r => !urgencyFilter || r.urgency === urgencyFilter)

    const selectStyle = { height: 34, borderRadius: 8, border: '1px solid #27272A', backgroundColor: '#1E1E24', color: '#F5F5F4', padding: '0 10px', fontSize: 13, fontFamily: 'inherit', cursor: 'pointer', outline: 'none' }

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div className="page-section">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h1 className="heading-1">Request Queue</h1>
                        <p className="muted-text" style={{ marginTop: 4 }}>{queue.length} request{queue.length !== 1 ? 's' : ''} awaiting action</p>
                    </div>
                    <div style={{ position: 'relative', width: 240 }}>
                        <MagnifyingGlass size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#71717A' }} />
                        <input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
                            style={{ width: '100%', height: 38, borderRadius: 10, border: '1px solid #27272A', backgroundColor: '#1E1E24', padding: '0 12px 0 36px', fontSize: 13, color: '#F5F5F4', outline: 'none', fontFamily: 'inherit' }} />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="page-section" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)} style={selectStyle}>
                    <option value="">All Services</option>
                    {Object.entries(SERVICE_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
                <select value={urgencyFilter} onChange={(e) => setUrgencyFilter(e.target.value)} style={selectStyle}>
                    <option value="">All Urgency</option>
                    <option value="asap">ASAP</option>
                    <option value="today">Today</option>
                    <option value="scheduled">Scheduled</option>
                </select>
                {(serviceFilter || urgencyFilter) && (
                    <button onClick={() => { setServiceFilter(''); setUrgencyFilter('') }}
                        style={{ padding: '6px 12px', borderRadius: 8, fontSize: 12, border: '1px solid #27272A', backgroundColor: 'transparent', color: '#C9A84C', cursor: 'pointer' }}>
                        Clear Filters
                    </button>
                )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {queue.map(req => (
                    <Card key={req.id}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                    <p style={{ fontSize: 15, fontWeight: 600, color: '#F5F5F4' }}>{req.title}</p>
                                    <Badge variant={STATUS_BADGE[req.status]} size="sm">{STATUS_LABEL[req.status]}</Badge>
                                </div>
                                <p style={{ fontSize: 13, color: '#71717A' }}>{SERVICE_TYPES[req.serviceType]?.label} · Submitted by {req.clientName}</p>
                            </div>
                            <span style={{ fontSize: 12, color: '#C9A84C', fontWeight: 500, textTransform: 'capitalize', flexShrink: 0 }}>{req.urgency}</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 24, fontSize: 13, color: '#A1A1AA', marginBottom: 12 }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={14} /> {req.pickupLocation.split(',')[0]}</span>
                            <span>→</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={14} /> {req.dropoffLocation.split(',')[0]}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}><CalendarBlank size={14} /> {formatDate(req.createdAt, { format: 'relative' })}</span>
                        </div>

                        {req.specialInstructions && (
                            <p style={{ fontSize: 13, color: '#71717A', fontStyle: 'italic', marginBottom: 12, padding: '8px 12px', backgroundColor: '#1A1A1F', borderRadius: 8 }}>"{req.specialInstructions.substring(0, 100)}{req.specialInstructions.length > 100 ? '...' : ''}"</p>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 12, borderTop: '1px solid #1F1F23' }}>
                            {req.status === 'submitted' && <Button size="sm" onClick={() => toast.success('Marked as reviewed', { description: req.title })}>Mark Reviewed</Button>}
                            {req.status === 'reviewed' && (
                                <select onChange={(e) => { if (e.target.value) toast.success('Driver assigned', { description: `${req.title} → ${e.target.selectedOptions[0].text}` }) }} style={{
                                    height: 34, borderRadius: 8, border: '1px solid #27272A', backgroundColor: '#1E1E24',
                                    color: '#F5F5F4', padding: '0 12px', fontSize: 13, fontFamily: 'inherit', cursor: 'pointer',
                                }}>
                                    <option value="">Assign to driver...</option>
                                    {drivers.map(d => <option key={d.id} value={d.id}>{d.fullName}</option>)}
                                </select>
                            )}
                            <Button variant="ghost" size="sm"><Eye size={14} /> View</Button>
                        </div>
                    </Card>
                ))}
                {queue.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '48px 0' }}>
                        <p style={{ fontSize: 14, color: '#71717A' }}>Queue is empty — all caught up!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
