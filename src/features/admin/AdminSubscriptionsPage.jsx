import { useState, useEffect } from 'react'
import { Badge, Card, SkeletonTable } from '@/components/ui'
import { formatCurrency } from '@/lib/utils'
import { MOCK_ALL_USERS } from '@/mock/data'
import { PageTransition } from '@/components/motion/Animations'
import { CreditCard, CheckCircle, Warning, XCircle } from '@phosphor-icons/react'

const STATUS_CONFIG = {
    active: { badge: 'success', icon: CheckCircle, label: 'Active' },
    past_due: { badge: 'warning', icon: Warning, label: 'Past Due' },
    cancelled: { badge: 'error', icon: XCircle, label: 'Cancelled' },
}

export default function AdminSubscriptionsPage() {
    const clients = MOCK_ALL_USERS.filter(u => u.role === 'client' && u.subscription)
    const active = clients.filter(c => c.subscription.status === 'active')
    const pastDue = clients.filter(c => c.subscription.status === 'past_due')

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div className="page-section">
                <h1 className="heading-1">Subscriptions</h1>
                <p className="muted-text" style={{ marginTop: 4 }}>{clients.length} subscribers · {formatCurrency(clients.length * 199)}/mo MRR</p>
            </div>

            <div className="page-section grid-3col">
                <div style={{ backgroundColor: '#111113', border: '1px solid #27272A', borderRadius: 'clamp(10px, 2vw, 14px)', padding: 'clamp(12px, 2vw, 16px) clamp(14px, 2.5vw, 20px)' }}>
                    <p style={{ fontSize: 'clamp(18px, 4vw, 28px)', fontWeight: 700, color: '#22C55E', lineHeight: 1.1 }}>{active.length}</p>
                    <p style={{ fontSize: 12, color: '#71717A', marginTop: 4 }}>Active</p>
                </div>
                <div style={{ backgroundColor: '#111113', border: '1px solid #27272A', borderRadius: 'clamp(10px, 2vw, 14px)', padding: 'clamp(12px, 2vw, 16px) clamp(14px, 2.5vw, 20px)' }}>
                    <p style={{ fontSize: 'clamp(18px, 4vw, 28px)', fontWeight: 700, color: '#F59E0B', lineHeight: 1.1 }}>{pastDue.length}</p>
                    <p style={{ fontSize: 12, color: '#71717A', marginTop: 4 }}>Past Due</p>
                </div>
                <div style={{ backgroundColor: '#111113', border: '1px solid #27272A', borderRadius: 'clamp(10px, 2vw, 14px)', padding: 'clamp(12px, 2vw, 16px) clamp(14px, 2.5vw, 20px)' }}>
                    <p style={{ fontSize: 'clamp(18px, 4vw, 28px)', fontWeight: 700, color: '#F5F5F4', lineHeight: 1.1 }}>{formatCurrency(active.length * 199)}</p>
                    <p style={{ fontSize: 12, color: '#71717A', marginTop: 4 }}>Monthly Revenue</p>
                </div>
            </div>

            {/* Recent Subscription Events */}
            <div className="page-section">
                <div className="section-header"><h2 className="heading-2">Recent Events</h2></div>
                <Card>
                    {[
                        { type: 'new', text: 'Mark Rodriguez subscribed to Butler Premium', time: '2h ago', color: '#22C55E', icon: '🎉' },
                        { type: 'cancelled', text: 'Priya Patel cancelled their subscription', time: '1d ago', color: '#EF4444', icon: '🚪' },
                        { type: 'failed', text: 'Payment failed for Emily Chen ($199)', time: '2d ago', color: '#F59E0B', icon: '⚠️' },
                        { type: 'reactivated', text: 'John Davis reactivated their subscription', time: '3d ago', color: '#3B82F6', icon: '🔄' },
                        { type: 'new', text: 'Sarah Kim subscribed to Butler Premium', time: '5d ago', color: '#22C55E', icon: '🎉' },
                    ].map((evt, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < 4 ? '1px solid #1F1F23' : 'none' }}>
                            <span style={{ fontSize: 16 }}>{evt.icon}</span>
                            <p style={{ flex: 1, fontSize: 14, color: '#A1A1AA' }}>{evt.text}</p>
                            <span style={{ fontSize: 12, color: '#71717A', flexShrink: 0 }}>{evt.time}</span>
                        </div>
                    ))}
                </Card>
            </div>

            <div className="page-section">
                <div className="section-header"><h2 className="heading-2">All Subscribers</h2></div>
                <div style={{ backgroundColor: '#111113', border: '1px solid #27272A', borderRadius: 14, overflow: 'hidden' }}>
                    <table style={{ width: '100%', fontSize: 14, borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #27272A' }}>
                                {['Member', 'Plan', 'Status', 'Start Date', 'Amount'].map(h => (
                                    <th key={h} style={{ textAlign: 'left', fontSize: 11, color: '#71717A', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '12px 16px' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map(c => {
                                const config = STATUS_CONFIG[c.subscription.status] || STATUS_CONFIG.active
                                return (
                                    <tr key={c.id} style={{ borderBottom: '1px solid #1F1F23' }}>
                                        <td style={{ padding: '14px 16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#1A1A1F', border: '1px solid #27272A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: '#A1A1AA' }}>
                                                    {c.fullName.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <p style={{ fontWeight: 500, color: '#F5F5F4' }}>{c.fullName}</p>
                                                    <p style={{ fontSize: 12, color: '#71717A' }}>{c.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px 16px', color: '#A1A1AA' }}>Butler Premium</td>
                                        <td style={{ padding: '14px 16px' }}><Badge variant={config.badge} size="sm">{config.label}</Badge></td>
                                        <td style={{ padding: '14px 16px', color: '#71717A', fontSize: 13 }}>{c.subscription.startDate}</td>
                                        <td style={{ padding: '14px 16px', fontWeight: 500, color: '#F5F5F4' }}>$199/mo</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}



