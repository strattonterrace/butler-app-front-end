import { useState, useEffect } from 'react'
import { Card, SkeletonCard } from '@/components/ui'
import { toast } from 'sonner'
import { requestsApi } from '@/api/requests'
import { extractErrorMessage } from '@/api/client'
import { formatDate, formatCurrency } from '@/lib/utils'
import { PageTransition } from '@/components/motion/Animations'
import { usePageTitle, useIsMobile } from '@/hooks/useEdgeCases'
import { MagnifyingGlass, ArrowLeft, Users } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'

// Butler has no operator-facing clients endpoint; a client roster is derived
// from the requests this operator can see. Fields shown are only those we can
// ground in real data (name, order count, last activity). Plan is the uniform
// $199/mo Premium tier.
function aggregateClients(requests) {
    const byClient = {}
    for (const r of requests) {
        if (!r.client) continue
        const existing = byClient[r.client]
        if (!existing) {
            byClient[r.client] = { id: r.client, name: r.clientName || 'Client', totalOrders: 1, lastActivity: r.createdAt }
        } else {
            existing.totalOrders += 1
            if (new Date(r.createdAt) > new Date(existing.lastActivity)) existing.lastActivity = r.createdAt
        }
    }
    return Object.values(byClient).sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity))
}

export default function OperatorClientManagement() {
    usePageTitle('Client Management')
    const mobile = useIsMobile()
    const [search, setSearch] = useState('')
    const [allClients, setAllClients] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let active = true
        requestsApi.list({ ordering: '-created_at' })
            .then((data) => { if (active) setAllClients(aggregateClients(data.results ?? [])) })
            .catch((error) => { if (active) toast.error('Could not load clients', { description: extractErrorMessage(error) }) })
            .finally(() => { if (active) setLoading(false) })
        return () => { active = false }
    }, [])

    const clients = allClients.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()))

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
                    <p className="muted-text" style={{ marginTop: 4 }}>{allClients.length} client{allClients.length !== 1 ? 's' : ''} with requests</p>
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

                {clients.length === 0 ? (
                    <Card>
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <Users size={40} style={{ color: '#71717A', margin: '0 auto 12px' }} />
                            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#F5F5F4', marginBottom: 4 }}>
                                {search ? 'No clients match your search' : 'No clients yet'}
                            </h3>
                            <p style={{ fontSize: 14, color: '#71717A' }}>
                                {search ? `No results for "${search}".` : 'Clients appear here once they submit requests in your territory.'}
                            </p>
                            {search && (
                                <button onClick={() => setSearch('')}
                                    style={{ marginTop: 12, fontSize: 13, color: '#C9A84C', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                                    Clear search
                                </button>
                            )}
                        </div>
                    </Card>
                ) : (
                    <div className="responsive-table" style={{ backgroundColor: '#111113', border: '1px solid #27272A', borderRadius: 14, overflow: 'hidden' }}>
                        <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #27272A' }}>
                                    {['Client', 'Plan', 'Requests', 'Last Active'].map(h => (
                                        <th key={h} style={{ textAlign: 'left', fontSize: 10, color: '#71717A', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '10px 14px', whiteSpace: 'nowrap' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {clients.map(c => (
                                    <tr key={c.id} style={{ borderBottom: '1px solid #1F1F23' }}>
                                        <td style={{ padding: '12px 14px', fontWeight: 500, color: '#F5F5F4', whiteSpace: 'nowrap' }}>{c.name}</td>
                                        <td style={{ padding: '12px 14px', color: '#C9A84C', fontSize: 12 }}>Premium · {formatCurrency(199)}/mo</td>
                                        <td style={{ padding: '12px 14px', color: '#A1A1AA', textAlign: 'center' }}>{c.totalOrders}</td>
                                        <td style={{ padding: '12px 14px', color: '#71717A', whiteSpace: 'nowrap' }}>{formatDate(c.lastActivity, { format: 'relative' })}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </PageTransition>
    )
}
