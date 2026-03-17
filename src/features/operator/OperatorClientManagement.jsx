import { useState, useEffect } from 'react'
import { Badge, Card, SkeletonCard, Button } from '@/components/ui'
import { toast } from 'sonner'
import { formatDate, formatCurrency } from '@/lib/utils'
import { MOCK_CLIENT_DETAILS, MOCK_TERRITORIES } from '@/mock/data'
import { PageTransition } from '@/components/motion/Animations'
import { usePageTitle, useIsMobile } from '@/hooks/useEdgeCases'
import { MagnifyingGlass, ChatDots, Flag, ArrowLeft, Users } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'

const STATUS_COLORS = { active: '#22C55E', flagged: '#F59E0B', paused: '#71717A' }

function ClientMobileCard({ c }) {
    return (
        <Card>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#F5F5F4' }}>{c.name}</p>
                    <p style={{ fontSize: 12, color: '#C9A84C' }}>{c.tier} · {formatCurrency(c.monthlyFee)}/mo</p>
                </div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: STATUS_COLORS[c.status] || '#71717A', textTransform: 'capitalize' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: STATUS_COLORS[c.status] || '#71717A' }} />
                    {c.status}
                </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12, marginBottom: 12 }}>
                <div><span style={{ color: '#71717A' }}>LTV</span><br /><span style={{ color: '#22C55E', fontWeight: 600 }}>{formatCurrency(c.ltv)}</span></div>
                <div><span style={{ color: '#71717A' }}>Orders</span><br /><span style={{ color: '#F5F5F4' }}>{c.totalOrders}</span></div>
                <div><span style={{ color: '#71717A' }}>Since</span><br /><span style={{ color: '#A1A1AA' }}>{formatDate(c.startDate)}</span></div>
                <div><span style={{ color: '#71717A' }}>Last Active</span><br /><span style={{ color: '#A1A1AA' }}>{formatDate(c.lastActivity, { format: 'relative' })}</span></div>
            </div>
            {c.notes && (
                <div style={{ padding: '8px 10px', backgroundColor: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 8, marginBottom: 12 }}>
                    <p style={{ fontSize: 11, color: '#F59E0B' }}>{c.notes}</p>
                </div>
            )}
            <div style={{ display: 'flex', gap: 8, paddingTop: 12, borderTop: '1px solid #1F1F23' }}>
                <button onClick={() => toast.info('Message sent', { description: `Message to ${c.name}` })}
                    style={{ flex: 1, height: 32, borderRadius: 8, border: '1px solid #27272A', backgroundColor: '#1A1A1F', color: '#A1A1AA', fontSize: 12, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'inherit' }}>
                    <ChatDots size={14} /> Message
                </button>
                <button onClick={() => toast.warning('Account flagged', { description: `${c.name} flagged for review` })}
                    style={{ flex: 1, height: 32, borderRadius: 8, border: '1px solid #27272A', backgroundColor: '#1A1A1F', color: '#A1A1AA', fontSize: 12, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'inherit' }}>
                    <Flag size={14} /> Flag
                </button>
            </div>
        </Card>
    )
}

export default function OperatorClientManagement() {
    usePageTitle('Client Management')
    const mobile = useIsMobile()
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t) }, [])

    const territory = MOCK_TERRITORIES[0]
    const clients = MOCK_CLIENT_DETAILS.filter(c =>
        c.territoryId === territory.id &&
        (!search || c.name.toLowerCase().includes(search.toLowerCase()))
    )

    if (loading) return (
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div className="page-section" style={{ height: 40, width: '50%', backgroundColor: '#1A1A1F', borderRadius: 8, animation: 'skeleton-pulse 1.5s ease-in-out infinite' }} />
            <div className="page-section grid-cards">{[1, 2, 3].map(i => <SkeletonCard key={i} lines={3} />)}</div>
        </div>
    )

    return (
        <PageTransition>
            <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                <div className="page-section">
                    <Link to="/operator" style={{ fontSize: 13, color: '#71717A', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                        <ArrowLeft size={14} /> Back to Dashboard
                    </Link>
                    <h1 className="heading-1">Client Management</h1>
                    <p className="muted-text" style={{ marginTop: 4 }}>{territory.name} · {clients.length} client{clients.length !== 1 ? 's' : ''}</p>
                </div>

                {/* Search */}
                <div className="page-section">
                    <div style={{ position: 'relative', maxWidth: mobile ? '100%' : 360 }}>
                        <MagnifyingGlass size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#71717A' }} />
                        <input placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)}
                            style={{ width: '100%', height: 38, borderRadius: 10, border: '1px solid #27272A', backgroundColor: '#1E1E24', padding: '0 12px 0 36px', fontSize: 13, color: '#F5F5F4', outline: 'none', fontFamily: 'inherit' }}
                        />
                    </div>
                </div>

                {/* Empty state */}
                {clients.length === 0 ? (
                    <Card>
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <Users size={40} style={{ color: '#71717A', margin: '0 auto 12px' }} />
                            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#F5F5F4', marginBottom: 4 }}>
                                {search ? 'No clients match your search' : 'No clients in this territory'}
                            </h3>
                            <p style={{ fontSize: 14, color: '#71717A' }}>
                                {search ? `No results for "${search}". Try a different search.` : 'Clients will appear here once added to your territory.'}
                            </p>
                            {search && (
                                <button onClick={() => setSearch('')}
                                    style={{ marginTop: 12, fontSize: 13, color: '#C9A84C', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                                    Clear search
                                </button>
                            )}
                        </div>
                    </Card>
                ) : mobile ? (
                    /* Mobile: Card layout */
                    <div className="grid-cards">
                        {clients.map(c => <ClientMobileCard key={c.id} c={c} />)}
                    </div>
                ) : (
                    /* Desktop: Table layout */
                    <div className="responsive-table" style={{ backgroundColor: '#111113', border: '1px solid #27272A', borderRadius: 14, overflow: 'hidden' }}>
                        <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #27272A' }}>
                                    {['Client', 'Tier', 'Monthly Fee', 'Start Date', 'LTV', 'Orders', 'Last Active', 'Status', 'Actions'].map(h => (
                                        <th key={h} style={{ textAlign: 'left', fontSize: 10, color: '#71717A', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '10px 14px', whiteSpace: 'nowrap' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {clients.map(c => (
                                    <tr key={c.id} style={{ borderBottom: '1px solid #1F1F23' }}>
                                        <td style={{ padding: '12px 14px', fontWeight: 500, color: '#F5F5F4', whiteSpace: 'nowrap' }}>{c.name}</td>
                                        <td style={{ padding: '12px 14px', color: '#C9A84C', fontSize: 12 }}>{c.tier}</td>
                                        <td style={{ padding: '12px 14px', color: '#A1A1AA' }}>{formatCurrency(c.monthlyFee)}</td>
                                        <td style={{ padding: '12px 14px', color: '#71717A', whiteSpace: 'nowrap' }}>{formatDate(c.startDate)}</td>
                                        <td style={{ padding: '12px 14px', color: '#22C55E', fontWeight: 600 }}>{formatCurrency(c.ltv)}</td>
                                        <td style={{ padding: '12px 14px', color: '#A1A1AA', textAlign: 'center' }}>{c.totalOrders}</td>
                                        <td style={{ padding: '12px 14px', color: '#71717A', whiteSpace: 'nowrap' }}>{formatDate(c.lastActivity, { format: 'relative' })}</td>
                                        <td style={{ padding: '12px 14px' }}>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: STATUS_COLORS[c.status] || '#71717A', textTransform: 'capitalize' }}>
                                                <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: STATUS_COLORS[c.status] || '#71717A' }} />
                                                {c.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 14px' }}>
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                <button onClick={() => toast.info('Message sent', { description: `Message to ${c.name}` })}
                                                    style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #27272A', backgroundColor: '#1A1A1F', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#A1A1AA' }}
                                                    title="Message client">
                                                    <ChatDots size={14} />
                                                </button>
                                                <button onClick={() => toast.warning('Account flagged', { description: `${c.name} flagged for review` })}
                                                    style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #27272A', backgroundColor: '#1A1A1F', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#A1A1AA' }}
                                                    title="Flag account">
                                                    <Flag size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Flagged Notes */}
                {!mobile && clients.filter(c => c.notes).length > 0 && (
                    <div className="page-section" style={{ marginTop: 24 }}>
                        <h2 className="heading-2" style={{ marginBottom: 12 }}>Flagged Notes</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {clients.filter(c => c.notes).map(c => (
                                <div key={c.id} style={{ padding: '12px 16px', backgroundColor: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 10 }}>
                                    <p style={{ fontSize: 13, fontWeight: 500, color: '#F59E0B' }}>{c.name}</p>
                                    <p style={{ fontSize: 12, color: '#A1A1AA', marginTop: 4 }}>{c.notes}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </PageTransition>
    )
}
