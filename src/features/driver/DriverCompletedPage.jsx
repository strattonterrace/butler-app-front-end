import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { Badge, Card, SkeletonCard } from '@/components/ui'
import { formatDate, SERVICE_TYPES } from '@/lib/utils'
import { MOCK_REQUESTS } from '@/mock/data'
import { PageTransition } from '@/components/motion/Animations'
import { usePageTitle } from '@/hooks/useEdgeCases'
import { CheckCircle, MapPin, CalendarBlank, Star } from '@phosphor-icons/react'

export default function DriverCompletedPage() {
    usePageTitle('Completed Tasks')
    const { currentUser } = useAuthStore()
    const completed = MOCK_REQUESTS.filter(r => r.driverId === currentUser?.id && r.status === 'completed')
    const [loading, setLoading] = useState(true)
    useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t) }, [])

    if (loading) return <div style={{ maxWidth: 900, margin: '0 auto' }}><SkeletonCard /><SkeletonCard /></div>

    return (
        <PageTransition>
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
                <div className="page-section">
                    <h1 className="heading-1">Completed Tasks</h1>
                    <p className="muted-text" style={{ marginTop: 4 }}>{completed.length} task{completed.length !== 1 ? 's' : ''} completed</p>
                </div>

                {/* Stats */}
                <div className="page-section grid-3col">
                    <div style={{ backgroundColor: '#111113', border: '1px solid #27272A', borderRadius: 'clamp(10px, 2vw, 14px)', padding: 'clamp(12px, 2vw, 16px) clamp(14px, 2.5vw, 20px)' }}>
                        <p style={{ fontSize: 'clamp(18px, 4vw, 28px)', fontWeight: 700, color: '#F5F5F4', lineHeight: 1.1 }}>{completed.length}</p>
                        <p style={{ fontSize: 12, color: '#71717A', marginTop: 4 }}>Total Completed</p>
                    </div>
                    <div style={{ backgroundColor: '#111113', border: '1px solid #27272A', borderRadius: 'clamp(10px, 2vw, 14px)', padding: 'clamp(12px, 2vw, 16px) clamp(14px, 2.5vw, 20px)' }}>
                        <p style={{ fontSize: 'clamp(18px, 4vw, 28px)', fontWeight: 700, color: '#F5F5F4', lineHeight: 1.1 }}>4.9</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} weight="fill" style={{ color: i <= 5 ? '#C9A84C' : '#27272A' }} />)}
                            <span style={{ fontSize: 12, color: '#71717A', marginLeft: 2 }}>Rating</span>
                        </div>
                    </div>
                    <div style={{ backgroundColor: '#111113', border: '1px solid #27272A', borderRadius: 'clamp(10px, 2vw, 14px)', padding: 'clamp(12px, 2vw, 16px) clamp(14px, 2.5vw, 20px)' }}>
                        <p style={{ fontSize: 'clamp(18px, 4vw, 28px)', fontWeight: 700, color: '#22C55E', lineHeight: 1.1 }}>100%</p>
                        <p style={{ fontSize: 12, color: '#71717A', marginTop: 4 }}>Completion Rate</p>
                    </div>
                </div>

                {/* List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {completed.map(req => (
                        <div key={req.id} style={{
                            display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px',
                            backgroundColor: '#111113', border: '1px solid #27272A', borderRadius: 14,
                        }}>
                            <CheckCircle size={24} weight="fill" style={{ color: '#22C55E', flexShrink: 0 }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontSize: 14, fontWeight: 600, color: '#F5F5F4' }}>{req.title}</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: '#71717A', marginTop: 4 }}>
                                    <span>{SERVICE_TYPES[req.serviceType]?.label}</span>
                                    <span>for {req.clientName}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><CalendarBlank size={12} />{formatDate(req.updatedAt, { format: 'relative' })}</span>
                                </div>
                            </div>
                            {req.completionNotes && (
                                <p style={{ fontSize: 12, color: '#A1A1AA', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flexShrink: 0 }}>{req.completionNotes}</p>
                            )}
                        </div>
                    ))}
                    {completed.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '48px 0' }}>
                            <CheckCircle size={40} style={{ color: '#71717A', margin: '0 auto 12px' }} />
                            <p style={{ fontSize: 14, color: '#71717A' }}>No completed tasks yet. Keep going!</p>
                        </div>
                    )}
                </div>
            </div>
        </PageTransition>
    )
}



