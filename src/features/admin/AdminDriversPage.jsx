import { Badge, Button, Card } from '@/components/ui'
import { toast } from 'sonner'
import { MOCK_ALL_USERS } from '@/mock/data'
import { Car, CheckCircle, XCircle, Clock } from '@phosphor-icons/react'

export default function AdminDriversPage() {
    const drivers = MOCK_ALL_USERS.filter(u => u.role === 'driver')
    const pending = drivers.filter(d => d.approvalStatus === 'pending')
    const approved = drivers.filter(d => d.approvalStatus === 'approved')

    return (
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div className="page-section">
                <h1 className="heading-1">Driver Approvals</h1>
                <p className="muted-text" style={{ marginTop: 4 }}>{drivers.length} total drivers · {pending.length} pending</p>
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
                                            {driver.fullName.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p style={{ fontSize: 15, fontWeight: 500, color: '#F5F5F4' }}>{driver.fullName}</p>
                                            <p style={{ fontSize: 13, color: '#71717A' }}>{driver.email} · {driver.phone}</p>
                                        </div>
                                    </div>
                                    <Badge variant="warning" size="sm"><Clock size={10} /> Pending</Badge>
                                </div>

                                {driver.vehicle && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '12px 0', padding: '10px 12px', backgroundColor: '#1A1A1F', borderRadius: 10, fontSize: 13, color: '#A1A1AA' }}>
                                        <Car size={16} style={{ color: '#71717A' }} />
                                        <span>{driver.vehicle.year} {driver.vehicle.make} {driver.vehicle.model}</span>
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: 8, paddingTop: 12, borderTop: '1px solid #1F1F23' }}>
                                    <Button size="sm" onClick={() => toast.success('Driver approved', { description: driver.fullName })} style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.2)' }}>
                                        <CheckCircle size={14} weight="bold" /> Approve
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={() => toast.error('Driver rejected', { description: driver.fullName })}><XCircle size={14} weight="bold" /> Reject</Button>
                                    <Button size="sm" variant="ghost">View Full Application</Button>
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
                                {['Driver', 'Vehicle', 'Phone', 'Status', 'Joined'].map(h => (
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
                                                {d.fullName.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p style={{ fontWeight: 500, color: '#F5F5F4' }}>{d.fullName}</p>
                                                <p style={{ fontSize: 12, color: '#71717A' }}>{d.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '14px 16px', color: '#A1A1AA', fontSize: 13 }}>{d.vehicle ? `${d.vehicle.year} ${d.vehicle.make} ${d.vehicle.model}` : '—'}</td>
                                    <td style={{ padding: '14px 16px', color: '#A1A1AA', fontSize: 13 }}>{d.phone}</td>
                                    <td style={{ padding: '14px 16px' }}><Badge variant="success" size="sm">Approved</Badge></td>
                                    <td style={{ padding: '14px 16px', color: '#71717A', fontSize: 13 }}>{d.createdAt}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
