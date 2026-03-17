import { useState, useEffect } from 'react'
import { Badge, Card, SkeletonCard } from '@/components/ui'
import { toast } from 'sonner'
import { formatDate, formatCurrency } from '@/lib/utils'
import { MOCK_DRIVER_STATS, MOCK_TERRITORIES } from '@/mock/data'
import { PageTransition } from '@/components/motion/Animations'
import { usePageTitle, useIsMobile } from '@/hooks/useEdgeCases'
import { ChatDots, ArrowLeft, ArrowsCounterClockwise, Star, Car } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'

const STATUS_DOT = { online: '#22C55E', offline: '#71717A' }
const BG_STATUS = { cleared: { bg: 'rgba(34,197,94,0.1)', color: '#22C55E' }, pending: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' } }

function DriverMobileCard({ d }) {
    const bgCheck = BG_STATUS[d.backgroundCheck] || BG_STATUS.pending
    return (
        <Card>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#F5F5F4' }}>{d.name}</p>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: STATUS_DOT[d.status] || '#71717A', marginTop: 2 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: STATUS_DOT[d.status] || '#71717A' }} />
                        {d.status || 'Unknown'}
                    </span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 4, backgroundColor: bgCheck.bg, color: bgCheck.color, textTransform: 'capitalize' }}>{d.backgroundCheck || 'pending'}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12, marginBottom: 12 }}>
                <div><span style={{ color: '#71717A' }}>Rating</span><br />
                    {d.rating ? <span style={{ color: '#F59E0B', fontWeight: 600 }}>★ {d.rating}</span> : <span style={{ color: '#71717A' }}>—</span>}
                </div>
                <div><span style={{ color: '#71717A' }}>Active</span><br /><span style={{ color: '#F5F5F4' }}>{d.activeOrders ?? 0} orders</span></div>
                <div><span style={{ color: '#71717A' }}>Completion</span><br /><span style={{ color: d.completionRate ? '#22C55E' : '#71717A' }}>{d.completionRate ? `${(d.completionRate * 100).toFixed(0)}%` : '—'}</span></div>
                <div><span style={{ color: '#71717A' }}>Earnings</span><br /><span style={{ color: '#22C55E', fontWeight: 600 }}>{formatCurrency(d.earningsWeek ?? 0)}/wk</span></div>
            </div>
            <div style={{ display: 'flex', gap: 8, paddingTop: 12, borderTop: '1px solid #1F1F23' }}>
                <button onClick={() => toast.info('Message sent', { description: `Message to ${d.name}` })}
                    style={{ flex: 1, height: 32, borderRadius: 8, border: '1px solid #27272A', backgroundColor: '#1A1A1F', color: '#A1A1AA', fontSize: 12, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'inherit' }}>
                    <ChatDots size={14} /> Message
                </button>
                <button onClick={() => toast.info('Order reassigned', { description: `Reassigned from ${d.name}` })}
                    style={{ flex: 1, height: 32, borderRadius: 8, border: '1px solid #27272A', backgroundColor: '#1A1A1F', color: '#A1A1AA', fontSize: 12, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'inherit' }}>
                    <ArrowsCounterClockwise size={14} /> Reassign
                </button>
            </div>
        </Card>
    )
}

export default function OperatorDriverManagement() {
    usePageTitle('Driver Management')
    const mobile = useIsMobile()
    const [loading, setLoading] = useState(true)
    useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t) }, [])

    const territory = MOCK_TERRITORIES[0]
    const drivers = Object.values(MOCK_DRIVER_STATS)

    if (loading) return (
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div className="page-section" style={{ height: 40, width: '50%', backgroundColor: '#1A1A1F', borderRadius: 8, animation: 'skeleton-pulse 1.5s ease-in-out infinite' }} />
            <div className="page-section grid-cards">{[1, 2].map(i => <SkeletonCard key={i} lines={3} />)}</div>
        </div>
    )

    return (
        <PageTransition>
            <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                <div className="page-section">
                    <Link to="/operator" style={{ fontSize: 13, color: '#71717A', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                        <ArrowLeft size={14} /> Back to Dashboard
                    </Link>
                    <h1 className="heading-1">Driver Management</h1>
                    <p className="muted-text" style={{ marginTop: 4 }}>{territory.name} · {drivers.length} driver{drivers.length !== 1 ? 's' : ''}</p>
                </div>

                {/* Empty state */}
                {drivers.length === 0 ? (
                    <Card>
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <Car size={40} style={{ color: '#71717A', margin: '0 auto 12px' }} />
                            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#F5F5F4', marginBottom: 4 }}>No drivers in this territory</h3>
                            <p style={{ fontSize: 14, color: '#71717A' }}>Drivers will appear here once assigned to your territory.</p>
                        </div>
                    </Card>
                ) : mobile ? (
                    /* Mobile: Card layout */
                    <div className="grid-cards">
                        {drivers.map(d => <DriverMobileCard key={d.driverId} d={d} />)}
                    </div>
                ) : (
                    /* Desktop: Table layout */
                    <div className="responsive-table" style={{ backgroundColor: '#111113', border: '1px solid #27272A', borderRadius: 14, overflow: 'hidden' }}>
                        <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #27272A' }}>
                                    {['Driver', 'Status', 'Active', 'Rate', 'Avg Time', 'Rating', 'Earnings', 'BG Check', 'Actions'].map(h => (
                                        <th key={h} style={{ textAlign: 'left', fontSize: 10, color: '#71717A', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '10px 14px', whiteSpace: 'nowrap' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {drivers.map(d => {
                                    const bgCheck = BG_STATUS[d.backgroundCheck] || BG_STATUS.pending
                                    return (
                                        <tr key={d.driverId} style={{ borderBottom: '1px solid #1F1F23' }}>
                                            <td style={{ padding: '12px 14px', fontWeight: 500, color: '#F5F5F4', whiteSpace: 'nowrap' }}>{d.name}</td>
                                            <td style={{ padding: '12px 14px' }}>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: STATUS_DOT[d.status] || '#71717A', textTransform: 'capitalize' }}>
                                                    <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: STATUS_DOT[d.status] || '#71717A' }} />
                                                    {d.status || 'Unknown'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px 14px', color: '#A1A1AA', textAlign: 'center' }}>{d.activeOrders ?? 0}</td>
                                            <td style={{ padding: '12px 14px', color: d.completionRate ? '#22C55E' : '#71717A' }}>{d.completionRate ? `${(d.completionRate * 100).toFixed(0)}%` : '—'}</td>
                                            <td style={{ padding: '12px 14px', color: '#A1A1AA' }}>{d.avgDeliveryTime ? `${d.avgDeliveryTime}m` : '—'}</td>
                                            <td style={{ padding: '12px 14px' }}>
                                                {d.rating ? (
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: '#F59E0B', fontSize: 12, fontWeight: 600 }}>
                                                        <Star size={12} weight="fill" /> {d.rating}
                                                    </span>
                                                ) : <span style={{ color: '#71717A' }}>—</span>}
                                            </td>
                                            <td style={{ padding: '12px 14px', color: '#22C55E', fontWeight: 600 }}>{formatCurrency(d.earningsWeek ?? 0)}<span style={{ color: '#71717A', fontWeight: 400 }}>/wk</span></td>
                                            <td style={{ padding: '12px 14px' }}>
                                                <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 4, backgroundColor: bgCheck.bg, color: bgCheck.color, textTransform: 'capitalize' }}>{d.backgroundCheck || 'pending'}</span>
                                            </td>
                                            <td style={{ padding: '12px 14px' }}>
                                                <div style={{ display: 'flex', gap: 6 }}>
                                                    <button onClick={() => toast.info('Message sent', { description: `Message to ${d.name}` })}
                                                        style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #27272A', backgroundColor: '#1A1A1F', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#A1A1AA' }}
                                                        title="Message driver">
                                                        <ChatDots size={14} />
                                                    </button>
                                                    <button onClick={() => toast.info('Order reassigned', { description: `Reassigned from ${d.name}` })}
                                                        style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #27272A', backgroundColor: '#1A1A1F', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#A1A1AA' }}
                                                        title="Reassign orders">
                                                        <ArrowsCounterClockwise size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </PageTransition>
    )
}
