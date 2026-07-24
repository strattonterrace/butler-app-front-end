import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'

const STEPS = [
    { id: 'submitted',  label: 'Request submitted',  detail: 'Grocery run · 3 items',       time: 'Just now'   },
    { id: 'reviewed',   label: 'Operator reviewing', detail: 'Confirming availability',      time: '1 min ago'  },
    { id: 'assigned',   label: 'Driver assigned',    detail: 'Marcus J. · 4.9★ · 8 min ETA', time: '3 min ago'  },
    { id: 'enroute',    label: 'Driver en route',    detail: 'Heading to Whole Foods',       time: '11 min ago' },
    { id: 'completed',  label: 'Task completed',     detail: 'Delivered to your door',       time: '47 min ago' },
]

const MOCK_REQUESTS = [
    { service: 'Grocery Pickup',  location: 'Whole Foods — Fashion Island',    client: 'S.K.' },
    { service: 'Dry Cleaning',    location: 'Village Cleaners — Newport',      client: 'R.M.' },
    { service: 'Food Pickup',     location: 'Nobu — Newport Beach',            client: 'P.T.' },
    { service: 'Pharmacy Run',    location: 'CVS — Irvine Spectrum',           client: 'A.L.' },
]

function RequestCard({ step, request }) {
    return (
        <div style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: 16,
            padding: '24px 28px',
            width: '100%',
            maxWidth: 340,
        }}>
            {/* Live badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <span style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: step === 4 ? '#22C55E' : 'var(--gold)',
                    boxShadow: step === 4 ? '0 0 0 3px rgba(34,197,94,0.2)' : '0 0 0 3px rgba(201,168,76,0.2)',
                    animation: 'pulse-dot 2s ease infinite',
                }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)', fontFamily: "'Inter', sans-serif" }}>
                    {step === 4 ? 'Completed' : 'Active Request'}
                </span>
            </div>

            {/* Service */}
            <p style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontSize: 26,
                color: 'var(--text-primary)',
                marginBottom: 4,
                lineHeight: 1.2,
            }}>
                {request.service}
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-dim)', fontFamily: "'Inter', sans-serif", marginBottom: 24 }}>
                {request.location}
            </p>

            {/* Meta grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 24px' }}>
                {[
                    { label: 'Status',  value: STEPS[step].label },
                    { label: 'Client',  value: request.client },
                    { label: 'Detail',  value: STEPS[step].detail },
                    { label: 'Updated', value: STEPS[step].time },
                ].map(({ label, value }) => (
                    <div key={label}>
                        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 4, fontFamily: "'Inter', sans-serif" }}>
                            {label}
                        </p>
                        <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', fontFamily: "'Inter', sans-serif" }}>
                            {value}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}

function Timeline({ activeStep }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative' }}>
            {/* Vertical connecting line */}
            <div style={{
                position: 'absolute',
                left: 11, top: 12, bottom: 12,
                width: 1,
                background: 'var(--border-subtle)',
            }} />
            {/* Animated fill */}
            <motion.div
                style={{
                    position: 'absolute',
                    left: 11, top: 12,
                    width: 1,
                    background: 'var(--gold)',
                    transformOrigin: 'top',
                }}
                animate={{ height: `${(activeStep / (STEPS.length - 1)) * 100}%` }}
                transition={{ duration: 0.8, ease: [0.25, 0, 0.2, 1] }}
            />

            {STEPS.map((s, i) => {
                const isActive = i === activeStep
                const isDone   = i < activeStep

                return (
                    <div key={s.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 20, paddingBottom: i < STEPS.length - 1 ? 32 : 0, position: 'relative' }}>
                        {/* Node */}
                        <div style={{
                            width: 23, height: 23, borderRadius: '50%', flexShrink: 0,
                            border: `1px solid ${isActive ? 'var(--gold)' : isDone ? 'rgba(201,168,76,0.4)' : 'var(--border-default)'}`,
                            background: isDone ? 'rgba(201,168,76,0.12)' : isActive ? 'rgba(201,168,76,0.08)' : 'var(--bg-base)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 400ms',
                            zIndex: 1,
                            boxShadow: isActive ? '0 0 0 4px rgba(201,168,76,0.12)' : 'none',
                        }}>
                            {isDone ? (
                                <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                                    <path d="M1.5 4.5l2 2 4-4" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            ) : isActive ? (
                                <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--gold)' }} />
                            ) : (
                                <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--border-default)' }} />
                            )}
                        </div>

                        {/* Label */}
                        <div style={{ paddingTop: 2 }}>
                            <p style={{
                                fontSize: 14, fontWeight: isActive ? 600 : 400,
                                color: isActive ? 'var(--text-primary)' : isDone ? 'var(--text-muted)' : 'var(--text-dim)',
                                fontFamily: "'Inter', sans-serif",
                                transition: 'color 300ms',
                                marginBottom: 2,
                            }}>
                                {s.label}
                            </p>
                            {isActive && (
                                <motion.p
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{ fontSize: 12, color: 'var(--gold)', fontFamily: "'Inter', sans-serif" }}
                                >
                                    {s.detail}
                                </motion.p>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default function ProcessSection() {
    const [activeStep, setActiveStep] = useState(0)
    const [requestIndex, setRequestIndex] = useState(0)
    const stepRef = useRef(0)

    useEffect(() => {
        const advance = () => {
            stepRef.current = (stepRef.current + 1) % STEPS.length
            setActiveStep(stepRef.current)

            if (stepRef.current === 0) {
                setRequestIndex(i => (i + 1) % MOCK_REQUESTS.length)
            }
        }

        const id = setInterval(advance, 2200)
        return () => clearInterval(id)
    }, [])

    return (
        <section style={{
            background: 'var(--bg-base)',
            padding: '120px 40px',
            borderTop: '1px solid var(--border-subtle)',
        }}>
            <div style={{ maxWidth: 1060, margin: '0 auto' }}>

                {/* Header */}
                <div style={{ marginBottom: 80 }}>
                    <p className="t-label" style={{ marginBottom: 20 }}>How it works</p>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' }}>
                        <h2 className="t-h2" style={{ maxWidth: 480 }}>
                            You submit. We handle<br />everything else.
                        </h2>
                        <p className="t-body" style={{ maxWidth: 280, fontSize: 14, lineHeight: 1.8 }}>
                            A real request, moving through our system in real time. This is what happens every time you use Butler.
                        </p>
                    </div>
                </div>

                {/* Live visualization */}
                <div style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 20,
                    padding: 'clamp(32px, 5vw, 56px)',
                    display: 'grid',
                    gridTemplateColumns: '1fr auto 1fr',
                    gap: 'clamp(32px, 5vw, 72px)',
                    alignItems: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                }}>
                    {/* Background glow */}
                    <div style={{
                        position: 'absolute', top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400, height: 400, borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(201,168,76,0.04), transparent 70%)',
                        pointerEvents: 'none',
                    }} aria-hidden />

                    {/* Request card */}
                    <div>
                        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 16, fontFamily: "'Inter', sans-serif" }}>
                            Your Request
                        </p>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={requestIndex}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
                                exit={{ opacity: 0, y: -8, transition: { duration: 0.3 } }}
                            >
                                <RequestCard step={activeStep} request={MOCK_REQUESTS[requestIndex]} />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Center arrow */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 1, height: 40, background: 'var(--border-subtle)' }} />
                        <div style={{
                            width: 36, height: 36, borderRadius: '50%',
                            border: '1px solid var(--gold-border)',
                            background: 'var(--gold-dim)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
                                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div style={{ width: 1, height: 40, background: 'var(--border-subtle)' }} />
                    </div>

                    {/* Timeline */}
                    <div>
                        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 24, fontFamily: "'Inter', sans-serif" }}>
                            Butler in Action
                        </p>
                        <Timeline activeStep={activeStep} />
                    </div>
                </div>

                {/* Stats strip */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 1,
                    marginTop: 1,
                    background: 'var(--border-subtle)',
                    borderRadius: '0 0 20px 20px',
                    overflow: 'hidden',
                }}>
                    {[
                        { num: '~24min', label: 'Average response time' },
                        { num: '4.9★',   label: 'Driver rating average' },
                        { num: '100%',   label: 'Orange County coverage' },
                    ].map(({ num, label }) => (
                        <div key={label} style={{
                            background: 'var(--bg-surface)',
                            padding: '20px 28px',
                            textAlign: 'center',
                        }}>
                            <p style={{
                                fontFamily: "'Instrument Serif', Georgia, serif",
                                fontSize: 'clamp(22px, 2.5vw, 32px)',
                                color: 'var(--text-primary)',
                                marginBottom: 4,
                            }}>{num}</p>
                            <p style={{ fontSize: 12, color: 'var(--text-dim)', fontFamily: "'Inter', sans-serif" }}>
                                {label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes pulse-dot {
                    0%, 100% { opacity: 1; }
                    50%       { opacity: 0.4; }
                }
            `}</style>
        </section>
    )
}
