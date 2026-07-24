import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { SkeletonCard } from '@/components/ui'
import { requestsApi } from '@/api/requests'
import { extractErrorMessage } from '@/api/client'
import { formatDate, SERVICE_TYPES } from '@/lib/utils'
import { PageTransition } from '@/components/motion/Animations'
import { usePageTitle } from '@/hooks/useEdgeCases'
import { CheckCircle, CalendarBlank } from '@phosphor-icons/react'

export default function DriverCompletedPage() {
    usePageTitle('Completed Tasks')
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let active = true
        requestsApi.list({ status: 'completed', ordering: '-updated_at' })
            .then((data) => { if (active) setRequests(data.results ?? []) })
            .catch((error) => { if (active) toast.error('Could not load completed tasks', { description: extractErrorMessage(error) }) })
            .finally(() => { if (active) setLoading(false) })
        return () => { active = false }
    }, [])

    const completed = requests.filter(r => r.status === 'completed')

    if (loading) return <div style={{ maxWidth: 900, margin: '0 auto' }}><SkeletonCard /><SkeletonCard /></div>

    return (
        <PageTransition>
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
                <div className="page-section">
                    <h1 className="heading-1">Completed Tasks</h1>
                    <p className="muted-text" style={{ marginTop: 4 }}>{completed.length} task{completed.length !== 1 ? 's' : ''} completed</p>
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



