import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { gsap } from 'gsap'
import {
    Basket, TShirt, ForkKnife, FirstAidKit, Package,
} from '@phosphor-icons/react'

const STEP_VARIANT = {
    enter: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.48, ease: [0.25, 0, 0.2, 1] } },
    exit: { opacity: 0, y: -24, transition: { duration: 0.34, ease: [0.4, 0, 1, 1] } },
}

const Q1_OPTIONS = [
    { value: 'grocery',     label: 'Grocery pickup',  icon: Basket },
    { value: 'dry_clean',   label: 'Dry cleaning',    icon: TShirt },
    { value: 'food',        label: 'Food pickup',     icon: ForkKnife },
    { value: 'pharmacy',    label: 'Pharmacy runs',   icon: FirstAidKit },
    { value: 'errands',     label: 'General errands', icon: Package },
]

const Q2_OPTIONS = [
    { value: 'several_week', label: 'A few times a week' },
    { value: 'weekly',       label: 'About once a week' },
    { value: 'occasionally', label: 'Every now and then' },
    { value: 'often',        label: "More than I'd like to admit" },
]

const Q3_OPTIONS = [
    { value: 'family', label: 'Spend more time with family' },
    { value: 'work',   label: 'Focus on work that actually matters' },
    { value: 'health', label: 'Take better care of myself' },
    { value: 'rest',   label: 'Just breathe and decompress' },
    { value: 'build',  label: "Build something I've been putting off" },
]

export default function GuidedFlow({ onComplete }) {
    const [step, setStep] = useState(1)
    const [q1, setQ1] = useState([])
    const [q2, setQ2] = useState(null)
    const [q3, setQ3] = useState(null)
    const [q3Locked, setQ3Locked] = useState(false)

    const toggleQ1 = (val) => {
        setQ1(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val])
    }

    const selectQ2 = (val) => {
        setQ2(val)
        setTimeout(() => setStep(3), 420)
    }

    const selectQ3 = (val) => {
        if (q3Locked) return
        setQ3(val)
        setQ3Locked(true)
        // Subtle gold pulse on selected element — GSAP micro-anim
        gsap.to(`[data-q3="${val}"]`, {
            boxShadow: '0 0 0 4px rgba(201,168,76,0.22)',
            duration: 0.28, ease: 'power2.out',
        })
        setTimeout(() => onComplete({ q1, q2, q3: val }), 820)
    }

    return (
        <section className="l-flow" id="flow">
            <div className="l-flow-inner">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div key="q1" variants={STEP_VARIANT} initial="enter" animate="visible" exit="exit">
                            <p className="t-label l-flow-counter" style={{ textAlign: 'center', marginBottom: 32 }}>
                                01 &nbsp;/&nbsp; 03
                            </p>
                            <h2 className="t-question l-flow-question" style={{ textAlign: 'center', marginBottom: 12 }}>
                                What would you want a Butler<br />to handle for you regularly?
                            </h2>
                            <p className="t-caption l-flow-hint" style={{ textAlign: 'center', marginBottom: 44 }}>
                                Select all that apply
                            </p>
                            <div className="l-options grid-2">
                                {Q1_OPTIONS.map(({ value, label, icon: Icon }) => (
                                    <button
                                        key={value}
                                        className={`l-option${q1.includes(value) ? ' selected' : ''}`}
                                        onClick={() => toggleQ1(value)}
                                    >
                                        <span className="l-option-icon"><Icon size={20} weight="regular" /></span>
                                        {label}
                                    </button>
                                ))}
                            </div>
                            <AnimatePresence>
                                {q1.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0, transition: { duration: 0.28 } }}
                                        exit={{ opacity: 0, y: 6, transition: { duration: 0.2 } }}
                                    >
                                        <button className="l-continue-btn" onClick={() => setStep(2)}>
                                            Continue
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div key="q2" variants={STEP_VARIANT} initial="enter" animate="visible" exit="exit">
                            <p className="t-label l-flow-counter" style={{ textAlign: 'center', marginBottom: 32 }}>
                                02 &nbsp;/&nbsp; 03
                            </p>
                            <h2 className="t-question l-flow-question" style={{ textAlign: 'center', marginBottom: 44 }}>
                                How often do you find yourself<br />needing help with these tasks?
                            </h2>
                            <div className="l-options">
                                {Q2_OPTIONS.map(({ value, label }) => (
                                    <button
                                        key={value}
                                        className={`l-option${q2 === value ? ' selected' : ''}`}
                                        onClick={() => selectQ2(value)}
                                        style={{ justifyContent: 'center', textAlign: 'center' }}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div key="q3" variants={STEP_VARIANT} initial="enter" animate="visible" exit="exit">
                            <p className="t-label l-flow-counter" style={{ textAlign: 'center', marginBottom: 32 }}>
                                03 &nbsp;/&nbsp; 03
                            </p>
                            <h2 className="t-question l-flow-question" style={{ textAlign: 'center', marginBottom: 10 }}>
                                If someone handled all of this<br />for you — what would you do<br />with that extra time?
                            </h2>
                            <p className="t-caption" style={{ textAlign: 'center', fontStyle: 'italic', color: 'var(--text-dim)', marginBottom: 44 }}>
                                Take a moment with this one.
                            </p>
                            <div className="l-options">
                                {Q3_OPTIONS.map(({ value, label }) => (
                                    <button
                                        key={value}
                                        data-q3={value}
                                        className={`l-option${q3 === value ? ' selected' : ''}`}
                                        onClick={() => selectQ3(value)}
                                        style={{ justifyContent: 'center', textAlign: 'center' }}
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
