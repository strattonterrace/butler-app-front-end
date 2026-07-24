import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Card, SkeletonCard } from '@/components/ui'
import { adminApi } from '@/api/admin'
import { extractErrorMessage } from '@/api/client'
import { formatCurrency } from '@/lib/utils'
import { PageTransition } from '@/components/motion/Animations'
import { usePageTitle } from '@/hooks/useEdgeCases'
import { CurrencyDollar, ChartBar, Users, ArrowDown } from '@phosphor-icons/react'

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
// "2026-07" → "Jul"
function monthLabel(ym) {
    const mo = parseInt(ym.split('-')[1], 10)
    return MONTH_NAMES[mo - 1] || ym
}

export default function AdminRevenuePage() {
    usePageTitle('Revenue')
    const [loading, setLoading] = useState(true)
    const [metrics, setMetrics] = useState(null)
    const [revenue, setRevenue] = useState(null)

    useEffect(() => {
        let active = true
        Promise.all([
            adminApi.metrics().catch(() => null),
            adminApi.revenue().catch(() => null),
        ]).then(([m, r]) => {
            if (!active) return
            setMetrics(m)
            setRevenue(r)
        }).catch((error) => {
            if (active) toast.error('Could not load revenue', { description: extractErrorMessage(error) })
        }).finally(() => { if (active) setLoading(false) })
        return () => { active = false }
    }, [])

    if (loading) return <div style={{ maxWidth: 1000, margin: '0 auto' }}><SkeletonCard /><SkeletonCard /></div>

    const series = revenue?.monthly ?? []
    const summary = revenue?.summary ?? {}
    const maxRev = Math.max(1, ...series.map(s => Number(s.revenue) || 0))

    const cards = [
        { label: 'Monthly Recurring Revenue', value: formatCurrency(Number(metrics?.monthlyRevenue ?? 0)), icon: CurrencyDollar },
        { label: 'Total Collected', value: formatCurrency(Number(metrics?.totalRevenue ?? 0)), icon: ChartBar },
        { label: 'Active Subscribers', value: metrics?.activeSubscribers ?? 0, icon: Users },
        { label: 'Churn Rate (30d)', value: `${((metrics?.churnRate ?? 0) * 100).toFixed(1)}%`, icon: ArrowDown },
    ]

    return (
        <PageTransition>
            <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                <div className="page-section">
                    <h1 className="heading-1">Revenue</h1>
                    <p className="muted-text" style={{ marginTop: 4 }}>Subscription revenue, derived from live Stripe data.</p>
                </div>

                <div className="page-section grid-stats">
                    {cards.map((m, i) => (
                        <div key={i} style={{ backgroundColor: '#111113', border: '1px solid #27272A', borderRadius: 'clamp(10px, 2vw, 14px)', padding: 'clamp(12px, 2vw, 16px) clamp(14px, 2.5vw, 20px)' }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#1A1A1F', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                                <m.icon size={18} style={{ color: '#A1A1AA' }} />
                            </div>
                            <p style={{ fontSize: 'clamp(18px, 4vw, 28px)', fontWeight: 700, color: '#F5F5F4', lineHeight: 1.1 }}>{m.value}</p>
                            <p style={{ fontSize: 12, color: '#71717A', marginTop: 4 }}>{m.label}</p>
                        </div>
                    ))}
                </div>

                {/* Bar Chart — real monthly series */}
                <div className="page-section">
                    <Card>
                        <h2 className="heading-2" style={{ marginBottom: 20 }}>Monthly Revenue Trend</h2>
                        {series.length > 0 ? (
                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 200, padding: '0 8px' }}>
                                {series.map((point, i) => {
                                    const rev = Number(point.revenue) || 0
                                    return (
                                        <div key={point.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                                            <span style={{ fontSize: 11, fontWeight: 500, color: '#A1A1AA' }}>{formatCurrency(rev)}</span>
                                            <div style={{
                                                width: '100%', borderRadius: '6px 6px 0 0',
                                                height: `${(rev / maxRev) * 160}px`,
                                                background: i === series.length - 1
                                                    ? 'linear-gradient(180deg, #C9A84C, rgba(201,168,76,0.3))'
                                                    : 'linear-gradient(180deg, #27272A, #1A1A1F)',
                                                transition: 'height 300ms ease',
                                            }} />
                                            <span style={{ fontSize: 11, color: '#71717A' }}>{monthLabel(point.month)}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <p style={{ textAlign: 'center', fontSize: 14, color: '#71717A', padding: '40px 0' }}>No revenue data yet.</p>
                        )}
                    </Card>
                </div>

                {/* Real summary — subscription is Butler's only revenue stream */}
                <div className="page-section">
                    <Card>
                        <h3 className="heading-2" style={{ marginBottom: 12 }}>This Month</h3>
                        {[
                            { label: 'Average Revenue Per User', value: formatCurrency(Number(summary.averageRevenuePerUser ?? 0)) },
                            { label: 'Active Subscribers', value: summary.activeSubscribers ?? 0 },
                            { label: 'Cancelled This Month', value: summary.cancelledThisMonth ?? 0 },
                            { label: 'Lifetime Collected', value: formatCurrency(Number(summary.totalRevenue ?? 0)) },
                        ].map((m, i, arr) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < arr.length - 1 ? '1px solid #1F1F23' : 'none' }}>
                                <span style={{ fontSize: 13, color: '#71717A' }}>{m.label}</span>
                                <span style={{ fontSize: 14, fontWeight: 600, color: '#F5F5F4' }}>{m.value}</span>
                            </div>
                        ))}
                    </Card>
                </div>
            </div>
        </PageTransition>
    )
}
