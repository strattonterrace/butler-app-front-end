import { useState, useEffect, useCallback } from 'react'
import { Badge, Button, Card, SkeletonCard } from '@/components/ui'
import { toast } from 'sonner'
import { driversApi } from '@/api/drivers'
import { extractErrorMessage } from '@/api/client'
import { usePageTitle } from '@/hooks/useEdgeCases'
import { Car, CheckCircle, XCircle, Clock } from '@phosphor-icons/react'

export default function AdminDriversPage() {
    usePageTitle('Driver Approvals')
    const [pending, setPending] = useState([])
    const [approved, setApproved] = useState([])
    const [loading, setLoading] = useState(true)
    const [actingId, setActingId] = useState(null)

    const load = useCallback(async () => {
        const [pend, appr] = await Promise.all([
            driversApi.pending().catch(() => []),
            driversApi.available().catch(() => []),
        ])
        setPending(pend)
        setApproved(appr)
    }, [])

    useEffect(() => {
        let active = true
        load()
            .catch((error) => { if (active) toast.error('Could not load drivers', { description: extractErrorMessage(error) }) })
            .finally(() => { if (active) setLoading(false) })
        return () => { active = false }
    }, [load])

    const approve = async (driver) => {
        setActingId(driver.id)
        try {
            await driversApi.approve(driver.id)
            toast.success('Driver approved', { description: driver.name })
            await load()
        } catch (error) {
            toast.error('Could not approve driver', { description: extractErrorMessage(error) })
        } finally {
            setActingId(null)
        }
    }

    const reject = async (driver) => {
        const reason = window.prompt(`Reject ${driver.name}'s application? Add an optional reason:`)
        if (reason === null) return
        setActingId(driver.id)
        try {
            await driversApi.reject(driver.id, reason.trim())
            toast.success('Application declined', { description: driver.name })
            await load()
        } catch (error) {
            toast.error('Could not reject driver', { description: extractErrorMessage(error) })
        } finally {
            setActingId(null)
        }
    }

    if (loading) return <div style={{ maxWidth: 900, margin: '0 auto' }}><SkeletonCard /><SkeletonCard /></div>

    const totalDrivers = pending.length + approved.length

    return (
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div className="page-section">
                <h1 className="heading-1">Driver Approvals</h1>
                <p className="muted-text" style={{ marginTop: 4 }}>{totalDrivers} total drivers · {pending.length} pending</p>
            </div>

            {/* Pending */}
            {pending.length > 0 && (
                <div className="page-section">
                    <div className="section-header">
                        <h2 className="heading-2">
                            Pending Applications
                            <span style={{ marginLeft: 8, fontSize: 14, fontWeight: 400, color: '#F59E0B' }}>({pending.length})</span>
                        </h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {pending.map(driver => (
                            <Card key={driver.id}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: '#1A1A1F', border: '1px solid #27272A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 600, color: '#A1A1AA' }}>
                                            {driver.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p style={{ fontSize: 15, fontWeight: 500, color: '#F5F5F4' }}>{driver.name}</p>
                                            <p style={{ fontSize: 13, color: '#71717A' }}>{driver.email} · {driver.phone}</p>
                                        </div>
                                    </div>
                                    <Badge variant="warning" size="sm"><Clock size={10} /> Pending</Badge>
                                </div>

                                {driver.vehicle && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '12px 0', padding: '10px 12px', backgroundColor: '#1A1A1F', borderRadius: 10, fontSize: 13, color: '#A1A1AA' }}>
                                        <Car size={16} style={{ color: '#71717A' }} />
                                        <span>{driver.vehicle}{driver.licensePlate ? ` · ${driver.licensePlate}` : ''}</span>
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: 8, paddingTop: 12, borderTop: '1px solid #1F1F23' }}>
                                    <Button size="sm" disabled={actingId === driver.id} onClick={() => approve(driver)} style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.2)' }}>
                                        <CheckCircle size={14} weight="bold" /> {actingId === driver.id ? 'Working…' : 'Approve'}
                                    </Button>
                                    <Button size="sm" variant="destructive" disabled={actingId === driver.id} onClick={() => reject(driver)}><XCircle size={14} weight="bold" /> Reject</Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Approved */}
            <div className="page-section">
                <div className="section-header">
                    <h2 className="heading-2">Approved Drivers ({approved.length})</h2>
                </div>
                <div style={{ backgroundColor: '#111113', border: '1px solid #27272A', borderRadius: 14, overflow: 'hidden' }}>
                    <table style={{ width: '100%', fontSize: 14, borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #27272A' }}>
                                {['Driver', 'Vehicle', 'Phone', 'Active Tasks', 'Status'].map(h => (
                                    <th key={h} style={{ textAlign: 'left', fontSize: 11, color: '#71717A', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '12px 16px' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {approved.map(d => (
                                <tr key={d.id} style={{ borderBottom: '1px solid #1F1F23' }}>
                                    <td style={{ padding: '14px 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#1A1A1F', border: '1px solid #27272A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: '#A1A1AA' }}>
                                                {d.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <p style={{ fontWeight: 500, color: '#F5F5F4' }}>{d.name}</p>
                                        </div>
                                    </td>
                                    <td style={{ padding: '14px 16px', color: '#A1A1AA', fontSize: 13 }}>{d.vehicle || '—'}</td>
                                    <td style={{ padding: '14px 16px', color: '#A1A1AA', fontSize: 13 }}>{d.phone}</td>
                                    <td style={{ padding: '14px 16px', color: '#A1A1AA', fontSize: 13 }}>{typeof d.currentTaskCount === 'number' ? d.currentTaskCount : '—'}</td>
                                    <td style={{ padding: '14px 16px' }}><Badge variant="success" size="sm">Approved</Badge></td>
                                </tr>
                            ))}
                            {approved.length === 0 && (
                                <tr><td colSpan={5} style={{ padding: '32px 16px', textAlign: 'center', color: '#71717A', fontSize: 14 }}>No approved drivers yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
