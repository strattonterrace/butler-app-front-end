import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { gsap } from 'gsap'

const STEP_VARIANT = {
    enter:   { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0,  transition: { duration: 0.55, ease: [0.25, 0, 0.2, 1] } },
    exit:    { opacity: 0, y: -28, transition: { duration: 0.35, ease: [0.4, 0, 1, 1] } },
}

const Q1_OPTIONS = [
    'Grocery pickup',
    'Dry cleaning',
    'Food pickup',
    'Pharmacy runs',
    'General errands',
]

const Q2_OPTIONS = [
    'A few times a week',
    'About once a week',
    'Every now and then',
    "More than I'd like to admit",
]

const Q3_OPTIONS = [
    'Spend more time with family',
    'Focus on work that actually matters',
    'Take better care of myself',
    'Just breathe and decompress',
    "Build something I've been putting off",
]

function ProgressBar({ step }) {
    return (
        <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: 1,
            background: 'var(--border-subtle)',
        }}>
            <motion.div
                style={{ height: '100%', background: 'var(--gold)', transformOrigin: 'left' }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: step / 3, transition: { duration: 0.5, ease: [0.25, 0, 0.2, 1] } }}
            />
        </div>
    )
}

export default function GuidedFlow({ onComplete }) {
    const [step, setStep]       = useState(1)
    const [q1, setQ1]           = useState([])
    const [q2, setQ2]           = useState(null)
    const [q3, setQ3]           = useState(null)
    const [q3Locked, setQ3Locked] = useState(false)

    const toggleQ1 = (val) =>
        setQ1(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val])

    const selectQ2 = (val) => {
        setQ2(val)
        setTimeout(() => setStep(3), 420)
    }

    const selectQ3 = (val) => {
        if (q3Locked) return
        setQ3(val)
        setQ3Locked(true)
        gsap.to(`[data-q3val="${val}"]`, {
            color: 'var(--gold)',
            borderBottomColor: 'var(--gold)',
            duration: 0.25,
        })
        setTimeout(() => onComplete({ q1, q2, q3: val }), 860)
    }

    return (
        <section id="flow" style={{
            background: 'var(--bg-base)',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '100px 40px',
            position: 'relative',
        }}>
            <ProgressBar step={step} />

            <div style={{ width: '100%', maxWidth: 740 }}>
                <AnimatePresence mode="wait">

                    {/* Q1 */}
                    {step === 1 && (
                        <motion.div key="q1" variants={STEP_VARIANT} initial="enter" animate="visible" exit="exit">
                            <p className="t-label" style={{ marginBottom: 36, display: 'block' }}>01 / 03</p>

                            <h2 className="t-question" style={{ marginBottom: 56, maxWidth: 620 }}>
                                What would you want a Butler to handle for you regularly?
                            </h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                                {Q1_OPTIONS.map((label) => (
                                    <button
                                        key={label}
                                        onClick={() => toggleQ1(label)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            borderBottom: '1px solid var(--border-subtle)',
                                            padding: '20px 0',
                                            fontFamily: "'Instrument Serif', Georgia, serif",
                                            fontSize: 'clamp(20px, 2.6vw, 30px)',
                                            fontWeight: 400,
                                            color: q1.includes(label) ? 'var(--text-primary)' : 'var(--text-dim)',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            transition: 'color 180ms',
                                            width: '100%',
                                        }}
                                        onMouseEnter={(e) => { if (!q1.includes(label)) e.currentTarget.style.color = 'var(--text-muted)' }}
                                        onMouseLeave={(e) => { if (!q1.includes(label)) e.currentTarget.style.color = 'var(--text-dim)' }}
                                    >
                                        <span>{label}</span>
                                        <span style={{
                                            width: 22, height: 22,
                                            borderRadius: '50%',
                                            border: `1px solid ${q1.includes(label) ? 'var(--gold)' : 'var(--border-default)'}`,
                                            background: q1.includes(label) ? 'var(--gold)' : 'transparent',
                                            flexShrink: 0,
                                            transition: 'all 180ms',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            {q1.includes(label) && (
                                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                                    <path d="M2 5l2 2 4-4" stroke="#0A0A0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            )}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <AnimatePresence>
                                {q1.length > 0 && (
                                    <motion.button
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
                                        exit={{ opacity: 0 }}
                                        onClick={() => setStep(2)}
                                        className="l-continue-btn"
                                        style={{ marginTop: 48, textAlign: 'left' }}
                                    >
                                        Continue
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {/* Q2 */}
                    {step === 2 && (
                        <motion.div key="q2" variants={STEP_VARIANT} initial="enter" animate="visible" exit="exit">
                            <p className="t-label" style={{ marginBottom: 36 }}>02 / 03</p>

                            <h2 className="t-question" style={{ marginBottom: 56, maxWidth: 560 }}>
                                How often do you find yourself needing help with these tasks?
                            </h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                                {Q2_OPTIONS.map((label) => (
                                    <button
                                        key={label}
                                        onClick={() => selectQ2(label)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            borderBottom: '1px solid var(--border-subtle)',
                                            padding: '20px 0',
                                            fontFamily: "'Instrument Serif', Georgia, serif",
                                            fontSize: 'clamp(20px, 2.6vw, 30px)',
                                            fontWeight: 400,
                                            color: q2 === label ? 'var(--text-primary)' : 'var(--text-dim)',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            width: '100%',
                                            transition: 'color 180ms',
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)' }}
                                        onMouseLeave={(e) => { if (q2 !== label) e.currentTarget.style.color = 'var(--text-dim)' }}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Q3 */}
                    {step === 3 && (
                        <motion.div key="q3" variants={STEP_VARIANT} initial="enter" animate="visible" exit="exit">
                            <p className="t-label" style={{ marginBottom: 36 }}>03 / 03</p>

                            <h2 className="t-question" style={{ marginBottom: 16, maxWidth: 580 }}>
                                If someone handled all of this — what would you do with that extra time?
                            </h2>
                            <p style={{
                                fontFamily: "'Instrument Serif', Georgia, serif",
                                fontSize: 15,
                                fontStyle: 'italic',
                                color: 'var(--text-dim)',
                                marginBottom: 52,
                            }}>
                                Take a moment with this one.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                                {Q3_OPTIONS.map((label) => (
                                    <button
                                        key={label}
                                        data-q3val={label}
                                        onClick={() => selectQ3(label)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            borderBottom: '1px solid var(--border-subtle)',
                                            padding: '20px 0',
                                            fontFamily: "'Instrument Serif', Georgia, serif",
                                            fontSize: 'clamp(20px, 2.6vw, 30px)',
                                            fontWeight: 400,
                                            color: q3 === label ? 'var(--gold)' : 'var(--text-dim)',
                                            cursor: q3Locked ? 'default' : 'pointer',
                                            textAlign: 'left',
                                            width: '100%',
                                            transition: 'color 200ms',
                                        }}
                                        onMouseEnter={(e) => { if (!q3Locked) e.currentTarget.style.color = 'var(--text-primary)' }}
                                        onMouseLeave={(e) => { if (!q3Locked && q3 !== label) e.currentTarget.style.color = 'var(--text-dim)' }}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </section>
    )
}
