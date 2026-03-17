import { useParams, Link, useNavigate } from 'react-router-dom'
import { Badge, Button, Card } from '@/components/ui'
import { toast } from 'sonner'
import { formatDate, SERVICE_TYPES } from '@/lib/utils'
import { MOCK_REQUESTS } from '@/mock/data'
import { usePageTitle, useIsMobile } from '@/hooks/useEdgeCases'
import { ArrowLeft, MapPin, CalendarBlank, Clock, User, Car, Phone, CheckCircle, Circle, Basket, Pill, TShirt, Package, ArrowUUpLeft, CookingPot, Star, ChatDots, Timer } from '@phosphor-icons/react'

const SERVICE_ICONS = { grocery: Basket, pharmacy: Pill, dry_cleaning: TShirt, package: Package, retail_return: ArrowUUpLeft, food_pickup: CookingPot }
const STATUS_BADGE = { submitted: 'gold', reviewed: 'info', assigned: 'purple', in_progress: 'warning', completed: 'success', cancelled: 'error' }
const STATUS_LABEL = { submitted: 'Submitted', reviewed: 'Reviewed', assigned: 'Assigned', in_progress: 'In Progress', completed: 'Completed', cancelled: 'Cancelled' }

function InfoRow({ icon: Icon, label, value }) {
    return (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0', borderBottom: '1px solid #1F1F23' }}>
            <Icon size={16} style={{ color: '#71717A', marginTop: 2, flexShrink: 0 }} />
            <div>
                <p style={{ fontSize: 12, color: '#71717A', marginBottom: 2 }}>{label}</p>
                <p style={{ fontSize: 14, color: '#F5F5F4' }}>{value}</p>
            </div>
        </div>
    )
}

function TimelineItem({ entry, isLast }) {
    const isCompleted = true
    return (
        <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <CheckCircle size={18} weight="fill" style={{ color: '#22C55E', flexShrink: 0 }} />
                {!isLast && <div style={{ width: 2, flex: 1, backgroundColor: '#27272A', marginTop: 4 }} />}
            </div>
            <div style={{ paddingBottom: isLast ? 0 : 16 }}>
                <p style={{ fontSize: 14, fontWeight: 500, color: '#F5F5F4', textTransform: 'capitalize' }}>{entry.status.replace('_', ' ')}</p>
                <p style={{ fontSize: 12, color: '#71717A' }}>{entry.actor} · {formatDate(entry.timestamp, { format: 'relative' })}</p>
            </div>
        </div>
    )
}

export default function RequestDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const mobile = useIsMobile()
    const request = MOCK_REQUESTS.find(r => r.id === id)
    usePageTitle(request ? request.title : 'Request Detail')
    const ServiceIcon = SERVICE_ICONS[request?.serviceType] || Basket

    if (!request) {
        return (
            <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center', padding: '64px 0' }}>
                <h2 style={{ fontSize: 20, fontWeight: 600, color: '#F5F5F4', marginBottom: 8 }}>Request not found</h2>
                <p className="muted-text" style={{ marginBottom: 16 }}>This request doesn&apos;t exist or has been removed.</p>
                <Button variant="secondary" onClick={() => navigate('/requests')}>Back to Requests</Button>
            </div>
        )
    }

    return (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#71717A', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 24, padding: 0 }}>
                <ArrowLeft size={16} /> Back
            </button>

            {/* Header */}
            <div className="page-section">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: '#1A1A1F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A1A1AA' }}>
                            <ServiceIcon size={24} weight="regular" />
                        </div>
                        <div>
                            <h1 style={{ fontSize: 22, fontWeight: 600, color: '#F5F5F4', marginBottom: 4 }}>{request.title}</h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: 13, color: '#71717A' }}>{SERVICE_TYPES[request.serviceType]?.label}</span>
                                <span style={{ color: '#27272A' }}>·</span>
                                <Badge variant={STATUS_BADGE[request.status]} size="sm">{STATUS_LABEL[request.status]}</Badge>
                            </div>
                        </div>
                    </div>
                    {['submitted', 'reviewed'].includes(request.status) && (
                        <Button variant="destructive" size="sm">Cancel Request</Button>
                    )}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 320px', gap: 20 }}>
                {/* Left — Details */}
                <div>
                    <Card style={{ marginBottom: 16 }}>
                        <h3 className="heading-2" style={{ marginBottom: 12 }}>Details</h3>
                        <p style={{ fontSize: 14, color: '#A1A1AA', lineHeight: 1.7, marginBottom: 16 }}>{request.description}</p>
                        <InfoRow icon={MapPin} label="Pickup" value={request.pickupLocation} />
                        <InfoRow icon={MapPin} label="Drop-off" value={request.dropoffLocation} />
                        <InfoRow icon={Clock} label="Urgency" value={request.urgency === 'scheduled' ? `Scheduled — ${request.scheduledDate} (${request.scheduledWindow})` : request.urgency.toUpperCase()} />
                        <InfoRow icon={CalendarBlank} label="Submitted" value={formatDate(request.createdAt)} />
                        {request.estimatedBudget && <InfoRow icon={CalendarBlank} label="Budget" value={request.estimatedBudget} />}
                    </Card>

                    {request.specialInstructions && (
                        <Card style={{ marginBottom: 16 }}>
                            <h3 className="heading-2" style={{ marginBottom: 8 }}>Special Instructions</h3>
                            <p style={{ fontSize: 14, color: '#A1A1AA', lineHeight: 1.7 }}>{request.specialInstructions}</p>
                        </Card>
                    )}

                    {request.completionNotes && (
                        <Card>
                            <h3 className="heading-2" style={{ marginBottom: 8 }}>Completion Notes</h3>
                            <p style={{ fontSize: 14, color: '#A1A1AA', lineHeight: 1.7 }}>{request.completionNotes}</p>
                        </Card>
                    )}

                    {request.cancelReason && (
                        <Card>
                            <h3 className="heading-2" style={{ marginBottom: 8 }}>Cancellation Reason</h3>
                            <p style={{ fontSize: 14, color: '#EF4444', lineHeight: 1.7 }}>{request.cancelReason}</p>
                        </Card>
                    )}
                </div>

                {/* Right — Sidebar */}
                <div>
                    {/* Driver Info */}
                    {request.driverName && (
                        <Card style={{ marginBottom: 16 }}>
                            <h3 className="heading-2" style={{ marginBottom: 12 }}>Your Driver</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                                <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#1A1A1F', border: '1px solid #27272A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, color: '#A1A1AA' }}>
                                    {request.driverName.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <p style={{ fontSize: 14, fontWeight: 500, color: '#F5F5F4' }}>{request.driverName}</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 12, color: '#F59E0B', fontWeight: 600 }}><Star size={11} weight="fill" /> 4.9</span>
                                        <span style={{ fontSize: 12, color: '#71717A' }}>· Driver</span>
                                    </div>
                                </div>
                            </div>
                            {request.driverVehicle && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#A1A1AA', padding: '8px 0', borderTop: '1px solid #1F1F23' }}>
                                    <Car size={16} style={{ color: '#71717A' }} />
                                    <span>{request.driverVehicle.year} {request.driverVehicle.make} {request.driverVehicle.model}</span>
                                    <span style={{ color: '#71717A' }}>·</span>
                                    <span style={{ color: '#71717A' }}>{request.driverVehicle.plate}</span>
                                </div>
                            )}
                            {['assigned', 'in_progress'].includes(request.status) && (
                                <div style={{ padding: '8px 0', borderTop: '1px solid #1F1F23', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#A1A1AA' }}>
                                    <Timer size={16} style={{ color: '#3B82F6' }} />
                                    <span>Est. arrival: <strong style={{ color: '#F5F5F4' }}>~25 min</strong></span>
                                </div>
                            )}
                            {/* Message / Call Driver */}
                            {!['completed', 'cancelled'].includes(request.status) && (
                                <div style={{ display: 'flex', gap: 8, marginTop: 12, paddingTop: 12, borderTop: '1px solid #1F1F23' }}>
                                    <button onClick={() => toast.info('Message sent', { description: `Message to ${request.driverName}` })}
                                        style={{ flex: 1, height: 34, borderRadius: 8, border: '1px solid #27272A', backgroundColor: '#1A1A1F', color: '#A1A1AA', fontSize: 12, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                        <ChatDots size={14} /> Message
                                    </button>
                                    <button onClick={() => toast.info('Calling driver...', { description: request.driverName })}
                                        style={{ flex: 1, height: 34, borderRadius: 8, border: '1px solid #27272A', backgroundColor: '#1A1A1F', color: '#A1A1AA', fontSize: 12, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                        <Phone size={14} /> Call
                                    </button>
                                </div>
                            )}
                        </Card>
                    )}

                    {/* Tip Prompt — visible on completed requests */}
                    {request.status === 'completed' && request.driverName && (
                        <Card style={{ marginBottom: 16, borderColor: 'rgba(201,168,76,0.2)' }}>
                            <h3 className="heading-2" style={{ marginBottom: 8 }}>💛 Tip Your Driver</h3>
                            <p style={{ fontSize: 14, color: '#A1A1AA', lineHeight: 1.6, marginBottom: 12 }}>
                                {request.driverName.split(' ')[0]} did a great job! If you&apos;d like to show appreciation, consider tipping directly via:
                            </p>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <div style={{ flex: 1, padding: '10px 12px', borderRadius: 8, backgroundColor: '#1A1A1F', textAlign: 'center' }}>
                                    <p style={{ fontSize: 13, fontWeight: 500, color: '#F5F5F4' }}>Venmo</p>
                                    <p style={{ fontSize: 11, color: '#71717A' }}>@driver-handle</p>
                                </div>
                                <div style={{ flex: 1, padding: '10px 12px', borderRadius: 8, backgroundColor: '#1A1A1F', textAlign: 'center' }}>
                                    <p style={{ fontSize: 13, fontWeight: 500, color: '#F5F5F4' }}>Cash App</p>
                                    <p style={{ fontSize: 11, color: '#71717A' }}>$driver-handle</p>
                                </div>
                            </div>
                            <p style={{ fontSize: 11, color: '#71717A', marginTop: 8 }}>Tips are optional and go directly to your driver.</p>
                        </Card>
                    )}

                    {/* Timeline */}
                    <Card>
                        <h3 className="heading-2" style={{ marginBottom: 16 }}>Timeline</h3>
                        <div>
                            {[...request.statusHistory].reverse().map((entry, i) => (
                                <TimelineItem key={i} entry={entry} isLast={i === request.statusHistory.length - 1} />
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
