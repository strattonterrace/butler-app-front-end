import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { Badge, Button, Card, SkeletonCard } from '@/components/ui'
import { toast } from 'sonner'
import { formatDate, SERVICE_TYPES } from '@/lib/utils'
import { MOCK_REQUESTS } from '@/mock/data'
import { PageTransition } from '@/components/motion/Animations'
import { usePageTitle } from '@/hooks/useEdgeCases'
import { MapPin, Play, CheckCircle, Clock } from '@phosphor-icons/react'

const STATUS_BADGE = { assigned: 'purple', in_progress: 'warning' }
const STATUS_LABEL = { assigned: 'Assigned', in_progress: 'In Progress' }
const TABS = [
    { key: 'assigned', label: 'Assigned' },
    { key: 'in_progress', label: 'In Progress' },
]

export default function DriverTasksPage() {
    usePageTitle('My Tasks')
    const { currentUser } = useAuthStore()
    const [activeTab, setActiveTab] = useState('assigned')
    const myTasks = MOCK_REQUESTS.filter(r => r.driverId === currentUser?.id)
    const filtered = myTasks.filter(r => r.status === activeTab)

    const [loading, setLoading] = useState(true)
    useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t) }, [])

    if (loading) return <div style={{ maxWidth: 900, margin: '0 auto' }}><SkeletonCard /><SkeletonCard /></div>

    return (
        <PageTransition>
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
                <div className="page-section">
                    <h1 className="heading-1">My Tasks</h1>
                    <p className="muted-text" style={{ marginTop: 4 }}>{myTasks.filter(r => ['assigned', 'in_progress'].includes(r.status)).length} active task(s)</p>
                </div>

                <div className="page-section" style={{ display: 'flex', gap: 4, borderBottom: '1px solid #27272A', paddingBottom: 0 }}>
                    {TABS.map(tab => (
                        <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                            style={{
                                padding: '10px 16px', fontSize: 14, fontWeight: 500, border: 'none', cursor: 'pointer',
                                backgroundColor: 'transparent', borderBottom: activeTab === tab.key ? '2px solid #C9A84C' : '2px solid transparent',
                                color: activeTab === tab.key ? '#C9A84C' : '#71717A', transition: 'all 150ms', marginBottom: -1,
                            }}
                        >
                            {tab.label}
                            {' '}
                            <span style={{ fontSize: 12, color: activeTab === tab.key ? '#C9A84C' : '#52525B' }}>
                                ({myTasks.filter(r => r.status === tab.key).length})
                            </span>
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {filtered.map(req => (
                        <Card key={req.id}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                                <div>
                                    <p style={{ fontSize: 15, fontWeight: 600, color: '#F5F5F4' }}>{req.title}</p>
                                    <p style={{ fontSize: 13, color: '#71717A' }}>{SERVICE_TYPES[req.serviceType]?.label} · for {req.clientName}</p>
                                </div>
                                <Badge variant={STATUS_BADGE[req.status]} size="sm">{STATUS_LABEL[req.status]}</Badge>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: '12px 0', padding: '12px', backgroundColor: '#1A1A1F', borderRadius: 10 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#A1A1AA' }}>
                                    <MapPin size={14} style={{ color: '#22C55E', flexShrink: 0 }} />
                                    <span><strong style={{ color: '#71717A', fontWeight: 400 }}>Pickup:</strong> {req.pickupLocation.split(',').slice(0, 2).join(',')}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#A1A1AA' }}>
                                    <MapPin size={14} style={{ color: '#EF4444', flexShrink: 0 }} />
                                    <span><strong style={{ color: '#71717A', fontWeight: 400 }}>Drop-off:</strong> {req.dropoffLocation.split(',').slice(0, 2).join(',')}</span>
                                </div>
                            </div>

                            {req.specialInstructions && (
                                <p style={{ fontSize: 13, color: '#71717A', fontStyle: 'italic', marginBottom: 12 }}>Note: {req.specialInstructions.substring(0, 80)}...</p>
                            )}

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid #1F1F23' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#71717A' }}>
                                    <Clock size={14} /> {formatDate(req.updatedAt, { format: 'relative' })}
                                    <span style={{ marginLeft: 8, textTransform: 'capitalize', color: '#C9A84C' }}>{req.urgency}</span>
                                </div>
                                {req.status === 'assigned'
                                    ? <Button size="sm" onClick={() => toast.success('Task started', { description: req.title })}><Play size={14} weight="fill" /> Start Task</Button>
                                    : <Button size="sm" variant="secondary" onClick={() => toast.success('Task completed!', { description: req.title })}><CheckCircle size={14} weight="bold" /> Mark Completed</Button>
                                }
                            </div>
                        </Card>
                    ))}
                    {filtered.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '48px 0' }}>
                            <p style={{ fontSize: 14, color: '#71717A' }}>No {activeTab === 'assigned' ? 'assigned' : 'in-progress'} tasks.</p>
                        </div>
                    )}
                </div>
            </div>
        </PageTransition>
    )
}
