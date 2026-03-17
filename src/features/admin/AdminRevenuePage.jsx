import { useState, useEffect } from 'react'
import { Card, SkeletonCard } from '@/components/ui'
import { formatCurrency } from '@/lib/utils'
import { MOCK_METRICS } from '@/mock/data'
import { PageTransition } from '@/components/motion/Animations'
import { CurrencyDollar, TrendUp, ChartBar, Users, ArrowUp, ArrowDown } from '@phosphor-icons/react'

const MONTHS = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']
const REVENUE_DATA = [2800, 3100, 3450, 3800, 4100, 4378]
const maxRev = Math.max(...REVENUE_DATA)

export default function AdminRevenuePage() {
    const [loading, setLoading] = useState(true)
    useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t) }, [])

    if (loading) return <div style={{ maxWidth: 1000, margin: '0 auto' }}><SkeletonCard /><SkeletonCard /></div>

    return (
        <PageTransition>
            <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                <div className="page-section">
                    <h1 className="heading-1">Revenue</h1>
                    <p className="muted-text" style={{ marginTop: 4 }}>Financial overview and trends.</p>
                </div>

                <div className="page-section grid-stats">
                    {[
                        { label: 'Monthly Revenue', value: formatCurrency(MOCK_METRICS.monthlyRevenue), trend: '+12%', icon: CurrencyDollar, up: true },
                        { label: 'Total Revenue', value: formatCurrency(MOCK_METRICS.totalRevenue), trend: null, icon: ChartBar, up: true },
                        { label: 'Active Subscribers', value: MOCK_METRICS.activeSubscribers, trend: '+3', icon: Users, up: true },
                        { label: 'Churn Rate', value: `${(MOCK_METRICS.churnRate * 100).toFixed(0)}%`, trend: '-2%', icon: ArrowDown, up: false },
                    ].map((m, i) => (
                        <div key={i} style={{ backgroundColor: '#111113', border: '1px solid #27272A', borderRadius: 'clamp(10px, 2vw, 14px)', padding: 'clamp(12px, 2vw, 16px) clamp(14px, 2.5vw, 20px)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                                <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#1A1A1F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <m.icon size={18} style={{ color: '#A1A1AA' }} />
                                </div>
                                {m.trend && (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 12, fontWeight: 500, color: m.up ? '#22C55E' : '#EF4444' }}>
                                        {m.up ? <ArrowUp size={10} weight="bold" /> : <ArrowDown size={10} weight="bold" />}{m.trend}
                                    </span>
                                )}
                            </div>
                            <p style={{ fontSize: 'clamp(18px, 4vw, 28px)', fontWeight: 700, color: '#F5F5F4', lineHeight: 1.1 }}>{m.value}</p>
                            <p style={{ fontSize: 12, color: '#71717A', marginTop: 4 }}>{m.label}</p>
                        </div>
                    ))}
                </div>

                {/* Bar Chart */}
                <div className="page-section">
                    <Card>
                        <h2 className="heading-2" style={{ marginBottom: 20 }}>Monthly Revenue Trend</h2>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 200, padding: '0 8px' }}>
                            {REVENUE_DATA.map((rev, i) => (
                                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                                    <span style={{ fontSize: 11, fontWeight: 500, color: '#A1A1AA' }}>{formatCurrency(rev)}</span>
                                    <div style={{
                                        width: '100%', borderRadius: '6px 6px 0 0',
                                        height: `${(rev / maxRev) * 160}px`,
                                        background: i === REVENUE_DATA.length - 1
                                            ? 'linear-gradient(180deg, #C9A84C, rgba(201,168,76,0.3))'
                                            : 'linear-gradient(180deg, #27272A, #1A1A1F)',
                                        transition: 'height 300ms ease',
                                    }} />
                                    <span style={{ fontSize: 11, color: '#71717A' }}>{MONTHS[i]}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Breakdown */}
                <div className="page-section" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <Card>
                        <h3 className="heading-2" style={{ marginBottom: 12 }}>Revenue Breakdown</h3>
                        {[
                            { label: 'Subscription Revenue', amount: MOCK_METRICS.activeSubscribers * 199, pct: 85 },
                            { label: 'Service Fees', amount: 380, pct: 10 },
                            { label: 'Late Fees', amount: 120, pct: 5 },
                        ].map((item, i) => (
                            <div key={i} style={{ marginBottom: 12 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                                    <span style={{ color: '#A1A1AA' }}>{item.label}</span>
                                    <span style={{ fontWeight: 500, color: '#F5F5F4' }}>{formatCurrency(item.amount)}</span>
                                </div>
                                <div style={{ height: 6, borderRadius: 3, backgroundColor: '#1A1A1F', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${item.pct}%`, borderRadius: 3, backgroundColor: i === 0 ? '#C9A84C' : i === 1 ? '#3B82F6' : '#71717A' }} />
                                </div>
                            </div>
                        ))}
                    </Card>

                    <Card>
                        <h3 className="heading-2" style={{ marginBottom: 12 }}>Key Metrics</h3>
                        {[
                            { label: 'Avg Revenue Per User', value: formatCurrency(199) },
                            { label: 'Customer Lifetime Value', value: formatCurrency(2388) },
                            { label: 'Monthly Churn Rate', value: `${(MOCK_METRICS.churnRate * 100).toFixed(1)}%` },
                            { label: 'Net Promoter Score', value: '72' },
                        ].map((m, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < 3 ? '1px solid #1F1F23' : 'none' }}>
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



