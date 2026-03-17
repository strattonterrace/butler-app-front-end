import { useState, useEffect } from 'react'
import { Badge, Card, SkeletonTable } from '@/components/ui'
import { formatDate, SERVICE_TYPES } from '@/lib/utils'
import { MOCK_REQUESTS } from '@/mock/data'
import { PageTransition } from '@/components/motion/Animations'
import { usePageTitle } from '@/hooks/useEdgeCases'
import { MapPin, User } from '@phosphor-icons/react'

const STATUS_BADGE = { assigned: 'purple', in_progress: 'warning' }
const STATUS_LABEL = { assigned: 'Assigned', in_progress: 'In Progress' }

export default function OperatorActivePage() {
    usePageTitle('Active Fulfillments')
    const active = MOCK_REQUESTS.filter(r => ['assigned', 'in_progress'].includes(r.status))
    const [loading, setLoading] = useState(true)
    useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t) }, [])

    if (loading) return <div style={{ maxWidth: 1000, margin: '0 auto' }}><SkeletonTable /></div>

    return (
        <PageTransition>
            <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                <div className="page-section">
                    <h1 className="heading-1">Active Fulfillments</h1>
                    <p className="muted-text" style={{ marginTop: 4 }}>{active.length} request{active.length !== 1 ? 's' : ''} in progress</p>
                </div>

                <div style={{ backgroundColor: '#111113', border: '1px solid #27272A', borderRadius: 14, overflow: 'hidden' }}>
                    <table style={{ width: '100%', fontSize: 14, borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #27272A' }}>
                                {['Request', 'Service', 'Client', 'Driver', 'Urgency', 'Status', 'Updated'].map(h => (
                                    <th key={h} style={{ textAlign: 'left', fontSize: 11, color: '#71717A', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '12px 16px' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {active.map(req => (
                                <tr key={req.id} style={{ borderBottom: '1px solid #1F1F23', cursor: 'pointer' }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(26,26,31,0.5)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <td style={{ padding: '14px 16px', fontWeight: 500, color: '#F5F5F4' }}>{req.title}</td>
                                    <td style={{ padding: '14px 16px', color: '#A1A1AA' }}>{SERVICE_TYPES[req.serviceType]?.label}</td>
                                    <td style={{ padding: '14px 16px', color: '#A1A1AA' }}>{req.clientName}</td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: '#1A1A1F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, color: '#A1A1AA' }}>
                                                {req.driverName?.split(' ').map(n => n[0]).join('') || '—'}
                                            </div>
                                            <span style={{ color: '#A1A1AA' }}>{req.driverName || 'Unassigned'}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '14px 16px', color: '#C9A84C', fontSize: 13, textTransform: 'capitalize' }}>{req.urgency}</td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <Badge variant={STATUS_BADGE[req.status]} size="sm">{STATUS_LABEL[req.status]}</Badge>
                                    </td>
                                    <td style={{ padding: '14px 16px', color: '#71717A', fontSize: 13 }}>{formatDate(req.updatedAt, { format: 'relative' })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {active.length === 0 && (
                        <p style={{ textAlign: 'center', fontSize: 14, color: '#71717A', padding: '40px 0' }}>No active fulfillments at the moment.</p>
                    )}
                </div>
            </div>
        </PageTransition>
    )
}
