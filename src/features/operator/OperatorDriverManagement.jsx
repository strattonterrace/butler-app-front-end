import { useState, useEffect } from 'react'
import { Card, SkeletonCard } from '@/components/ui'
import { toast } from 'sonner'
import { driversApi } from '@/api/drivers'
import { extractErrorMessage } from '@/api/client'
import { PageTransition } from '@/components/motion/Animations'
import { usePageTitle, useIsMobile } from '@/hooks/useEdgeCases'
import { ArrowLeft, Car, Phone, Star } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'

function DriverMobileCard({ d }) {
    return (
        <Card>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#F5F5F4' }}>{d.name}</p>
                    <p style={{ fontSize: 12, color: '#71717A', marginTop: 2 }}>{d.vehicle}</p>
                </div>
                {typeof d.rating === 'number' && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: '#F59E0B', fontSize: 12, fontWeight: 600 }}><Star size={12} weight="fill" /> {d.rating}</span>
                )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12, marginBottom: 12 }}>
                <div><span style={{ color: '#71717A' }}>Active tasks</span><br /><span style={{ color: '#F5F5F4' }}>{d.currentTaskCount ?? 0}</span></div>
                <div><span style={{ color: '#71717A' }}>Availability</span><br /><span style={{ color: '#F5F5F4', textTransform: 'capitalize' }}>{d.availableHours || '—'}</span></div>
            </div>
            {d.phone && (
                <a href={`tel:${d.phone}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, height: 32, borderRadius: 8, border: '1px solid #27272A', backgroundColor: '#1A1A1F', color: '#A1A1AA', fontSize: 12, fontWeight: 500, textDecoration: 'none' }}>
                    <Phone size={14} /> {d.phone}
                </a>
            )}
        </Card>
    )
}

export default function OperatorDriverManagement() {
    usePageTitle('Driver Management')
    const mobile = useIsMobile()
    const [drivers, setDrivers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let active = true
        driversApi.available()
            .then((data) => { if (active) setDrivers(data) })
            .catch((error) => { if (active) toast.error('Could not load drivers', { description: extractErrorMessage(error) }) })
            .finally(() => { if (active) setLoading(false) })
        return () => { active = false }
    }, [])

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
                    <p className="muted-text" style={{ marginTop: 4 }}>{drivers.length} approved driver{drivers.length !== 1 ? 's' : ''} in your territory</p>
                </div>

                {drivers.length === 0 ? (
                    <Card>
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <Car size={40} style={{ color: '#71717A', margin: '0 auto 12px' }} />
                            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#F5F5F4', marginBottom: 4 }}>No drivers in this territory</h3>
                            <p style={{ fontSize: 14, color: '#71717A' }}>Approved drivers assigned to your territory will appear here.</p>
                        </div>
                    </Card>
                ) : mobile ? (
                    <div className="grid-cards">
                        {drivers.map(d => <DriverMobileCard key={d.id} d={d} />)}
                    </div>
                ) : (
                    <div className="responsive-table" style={{ backgroundColor: '#111113', border: '1px solid #27272A', borderRadius: 14, overflow: 'hidden' }}>
                        <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #27272A' }}>
                                    {['Driver', 'Vehicle', 'Phone', 'Active Tasks', 'Availability', 'Rating'].map(h => (
                                        <th key={h} style={{ textAlign: 'left', fontSize: 10, color: '#71717A', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '10px 14px', whiteSpace: 'nowrap' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {drivers.map(d => (
                                    <tr key={d.id} style={{ borderBottom: '1px solid #1F1F23' }}>
                                        <td style={{ padding: '12px 14px', fontWeight: 500, color: '#F5F5F4', whiteSpace: 'nowrap' }}>{d.name}</td>
                                        <td style={{ padding: '12px 14px', color: '#A1A1AA' }}>{d.vehicle || '—'}</td>
                                        <td style={{ padding: '12px 14px', color: '#A1A1AA' }}>{d.phone || '—'}</td>
                                        <td style={{ padding: '12px 14px', color: '#A1A1AA', textAlign: 'center' }}>{d.currentTaskCount ?? 0}</td>
                                        <td style={{ padding: '12px 14px', color: '#A1A1AA', textTransform: 'capitalize' }}>{d.availableHours || '—'}</td>
                                        <td style={{ padding: '12px 14px' }}>
                                            {typeof d.rating === 'number'
                                                ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: '#F59E0B', fontSize: 12, fontWeight: 600 }}><Star size={12} weight="fill" /> {d.rating}</span>
                                                : <span style={{ color: '#71717A' }}>—</span>}
                                        </td>
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
