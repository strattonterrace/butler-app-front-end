import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Badge, Button, Card } from '@/components/ui'
import { Textarea } from '@/components/ui/Input'
import { toast } from 'sonner'
import { formatDate, SERVICE_TYPES } from '@/lib/utils'
import { MOCK_REQUESTS } from '@/mock/data'
import { usePageTitle, useIsMobile } from '@/hooks/useEdgeCases'
import { ArrowLeft, MapPin, CalendarBlank, Clock, User, Car, Play, CheckCircle, Basket, Pill, TShirt, Package, ArrowUUpLeft, CookingPot, ChatDots, Phone, Camera, Image } from '@phosphor-icons/react'

const SERVICE_ICONS = { grocery: Basket, pharmacy: Pill, dry_cleaning: TShirt, package: Package, retail_return: ArrowUUpLeft, food_pickup: CookingPot }
const STATUS_BADGE = { assigned: 'purple', in_progress: 'warning', completed: 'success' }
const STATUS_LABEL = { assigned: 'Assigned', in_progress: 'In Progress', completed: 'Completed' }

export default function TaskDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const mobile = useIsMobile()
    const [showCompletion, setShowCompletion] = useState(false)
    const [completionNotes, setCompletionNotes] = useState('')
    const [confirmed, setConfirmed] = useState(false)
    const [completed, setCompleted] = useState(false)
    const [proofFile, setProofFile] = useState(null)
    const fileInputRef = useRef(null)

    const task = MOCK_REQUESTS.find(r => r.id === id)
    usePageTitle(task ? task.title : 'Task Detail')
    const ServiceIcon = SERVICE_ICONS[task?.serviceType] || Basket

    if (!task) {
        return (
            <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center', padding: '64px 0' }}>
                <h2 style={{ fontSize: 20, fontWeight: 600, color: '#F5F5F4', marginBottom: 8 }}>Task not found</h2>
                <p className="muted-text" style={{ marginBottom: 16 }}>This task doesn&apos;t exist or is no longer assigned to you.</p>
                <Button variant="secondary" onClick={() => navigate('/driver/tasks')}>Back to Tasks</Button>
            </div>
        )
    }

    if (completed) {
        return (
            <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center', padding: '64px 0' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <CheckCircle size={32} weight="fill" style={{ color: '#22C55E' }} />
                </div>
                <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 24, color: '#F5F5F4', marginBottom: 8 }}>Task Completed!</h2>
                <p style={{ fontSize: 14, color: '#71717A', marginBottom: 24 }}>Great work. The client has been notified.</p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                    <Button variant="secondary" onClick={() => navigate('/driver')}>Dashboard</Button>
                    <Button onClick={() => navigate('/driver/tasks')}>View Tasks</Button>
                </div>
            </div>
        )
    }

    return (
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
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
                            <h1 style={{ fontSize: 22, fontWeight: 600, color: '#F5F5F4', marginBottom: 4 }}>{task.title}</h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: 13, color: '#71717A' }}>{SERVICE_TYPES[task.serviceType]?.label} · for {task.clientName}</span>
                                <Badge variant={STATUS_BADGE[task.status]} size="sm">{STATUS_LABEL[task.status]}</Badge>
                            </div>
                        </div>
                    </div>
                    <span style={{ fontSize: 13, color: '#C9A84C', fontWeight: 500, textTransform: 'capitalize' }}>{task.urgency}</span>
                </div>
            </div>

            {/* Route Card */}
            <Card style={{ marginBottom: 16 }}>
                <h3 className="heading-2" style={{ marginBottom: 12 }}>Route</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '12px 16px', backgroundColor: '#1A1A1F', borderRadius: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <MapPin size={16} weight="fill" style={{ color: '#22C55E', marginTop: 2, flexShrink: 0 }} />
                        <div>
                            <p style={{ fontSize: 11, color: '#71717A', marginBottom: 2 }}>PICKUP</p>
                            <p style={{ fontSize: 14, color: '#F5F5F4' }}>{task.pickupLocation}</p>
                        </div>
                    </div>
                    <div style={{ width: 1, height: 16, backgroundColor: '#27272A', marginLeft: 7 }} />
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <MapPin size={16} weight="fill" style={{ color: '#EF4444', marginTop: 2, flexShrink: 0 }} />
                        <div>
                            <p style={{ fontSize: 11, color: '#71717A', marginBottom: 2 }}>DROP-OFF</p>
                            <p style={{ fontSize: 14, color: '#F5F5F4' }}>{task.dropoffLocation}</p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Details */}
            <Card style={{ marginBottom: 16 }}>
                <h3 className="heading-2" style={{ marginBottom: 12 }}>Request Details</h3>
                <p style={{ fontSize: 14, color: '#A1A1AA', lineHeight: 1.7, marginBottom: 12 }}>{task.description}</p>
                {task.specialInstructions && (
                    <div style={{ padding: '12px 16px', backgroundColor: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 10 }}>
                        <p style={{ fontSize: 12, color: '#C9A84C', fontWeight: 600, marginBottom: 4 }}>SPECIAL INSTRUCTIONS</p>
                        <p style={{ fontSize: 14, color: '#A1A1AA', lineHeight: 1.6 }}>{task.specialInstructions}</p>
                    </div>
                )}
                <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 13, color: '#71717A' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><CalendarBlank size={14} />{formatDate(task.createdAt, { format: 'relative' })}</span>
                    {task.estimatedBudget && <span>Budget: {task.estimatedBudget}</span>}
                </div>
            </Card>

            {/* Client Info */}
            <Card style={{ marginBottom: 24 }}>
                <h3 className="heading-2" style={{ marginBottom: 12 }}>Client</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#1A1A1F', border: '1px solid #27272A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, color: '#A1A1AA' }}>
                        {task.clientName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                        <p style={{ fontSize: 14, fontWeight: 500, color: '#F5F5F4' }}>{task.clientName}</p>
                        <p style={{ fontSize: 12, color: '#71717A' }}>Client</p>
                    </div>
                </div>
                {!['completed', 'cancelled'].includes(task.status) && (
                    <div style={{ display: 'flex', gap: 8, paddingTop: 12, borderTop: '1px solid #1F1F23' }}>
                        <button onClick={() => toast.info('Message sent', { description: `Message to ${task.clientName}` })}
                            style={{ flex: 1, height: 34, borderRadius: 8, border: '1px solid #27272A', backgroundColor: '#1A1A1F', color: '#A1A1AA', fontSize: 12, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                            <ChatDots size={14} /> Message
                        </button>
                        <button onClick={() => toast.info('Calling client...', { description: task.clientName })}
                            style={{ flex: 1, height: 34, borderRadius: 8, border: '1px solid #27272A', backgroundColor: '#1A1A1F', color: '#A1A1AA', fontSize: 12, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                            <Phone size={14} /> Call
                        </button>
                    </div>
                )}
            </Card>

            {/* Action Buttons */}
            {task.status === 'assigned' && (
                <Button size="lg" style={{ width: '100%', height: 52, fontSize: 16 }}>
                    <Play size={18} weight="fill" /> Start This Task
                </Button>
            )}

            {task.status === 'in_progress' && !showCompletion && (
                <Button size="lg" variant="secondary" onClick={() => setShowCompletion(true)} style={{ width: '100%', height: 52, fontSize: 16, borderColor: '#22C55E', color: '#22C55E' }}>
                    <CheckCircle size={18} weight="bold" /> Mark as Completed
                </Button>
            )}

            {showCompletion && (
                <Card style={{ marginTop: 8 }}>
                    <h3 className="heading-2" style={{ marginBottom: 12 }}>Complete This Task</h3>

                    {/* Proof of Completion Upload */}
                    <div style={{ marginBottom: 16 }}>
                        <p style={{ fontSize: 13, fontWeight: 500, color: '#A1A1AA', marginBottom: 8 }}>Proof of Completion</p>
                        <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={e => {
                            const file = e.target.files[0]
                            if (!file) return
                            if (file.size > 5 * 1024 * 1024) {
                                toast.error('File too large', { description: 'Max file size is 5 MB' })
                                e.target.value = ''
                                return
                            }
                            setProofFile(file)
                            toast.success('Photo added')
                        }} />
                        {proofFile ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, backgroundColor: '#1A1A1F', borderRadius: 10, border: '1px solid #27272A' }}>
                                <Image size={20} style={{ color: '#22C55E', flexShrink: 0 }} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontSize: 13, color: '#F5F5F4', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{proofFile.name}</p>
                                    <p style={{ fontSize: 11, color: '#71717A' }}>{(proofFile.size / 1024).toFixed(0)} KB</p>
                                </div>
                                <button onClick={() => setProofFile(null)} style={{ fontSize: 12, color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}>Remove</button>
                            </div>
                        ) : (
                            <button onClick={() => fileInputRef.current?.click()}
                                style={{ width: '100%', height: 60, borderRadius: 10, border: '2px dashed #27272A', backgroundColor: '#1A1A1F', color: '#71717A', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                <Camera size={18} /> Upload Photo (optional)
                            </button>
                        )}
                    </div>

                    <div style={{ marginBottom: 16 }}>
                        <Textarea label="Completion Notes (optional)" placeholder="Any notes about this delivery?" rows={3} value={completionNotes} onChange={(e) => setCompletionNotes(e.target.value)} />
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 16 }}>
                        <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} style={{ width: 18, height: 18, accentColor: '#C9A84C', cursor: 'pointer' }} />
                        <span style={{ fontSize: 14, color: '#A1A1AA' }}>I confirm this task has been completed</span>
                    </label>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <Button variant="secondary" onClick={() => setShowCompletion(false)} style={{ flex: 1 }}>Cancel</Button>
                        <Button disabled={!confirmed} onClick={() => setCompleted(true)} style={{ flex: 1, backgroundColor: '#22C55E', color: '#0A0A0B' }}>Submit Completion</Button>
                    </div>
                </Card>
            )}
        </div>
    )
}
