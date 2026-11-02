import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

// Pre-launch service: no real customer reviews yet, so this section carries
// the brand's promise (un-attributed value statements), NOT invented customer
// testimonials. Add real, attributed testimonials here only once they're from
// actual consenting members.
const STATEMENTS = [
    "Hand off the errands that eat your week — groceries, pharmacy, dry cleaning, returns. Just ask, and Butler handles it.",
    "One membership instead of five delivery apps. Send a message, and whatever you need gets picked up or dropped off.",
    "Built for Orange County from day one — a flat monthly membership designed to give you your time back.",
]

export default function TestimonialsSection() {
    const [index, setIndex] = useState(0)

    useEffect(() => {
        const id = setInterval(() => setIndex(i => (i + 1) % STATEMENTS.length), 5000)
        return () => clearInterval(id)
    }, [])

    return (
        <section style={{
            background: 'var(--bg-surface)',
            borderTop: '1px solid var(--border-subtle)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '120px 40px',
            overflow: 'hidden',
        }}>
            <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative' }}>

                {/* Big background number */}
                <span style={{
                    position: 'absolute',
                    top: -40,
                    right: -20,
                    fontFamily: "'Instrument Serif', Georgia, serif",
                    fontSize: 'clamp(120px, 18vw, 220px)',
                    color: 'rgba(201,168,76,0.04)',
                    lineHeight: 1,
                    pointerEvents: 'none',
                    userSelect: 'none',
                    fontStyle: 'italic',
                }}>
                    {String(index + 1).padStart(2, '0')}
                </span>

                <p className="t-label" style={{ marginBottom: 40 }}>The Butler promise</p>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.25, 0, 0.2, 1] } }}
                        exit={{ opacity: 0, y: -16, transition: { duration: 0.35 } }}
                    >
                        {/* Gold rule */}
                        <div style={{
                            width: 40,
                            height: 1,
                            background: 'var(--gold)',
                            marginBottom: 32,
                            opacity: 0.7,
                        }} />

                        {/* Statement */}
                        <p style={{
                            fontFamily: "'Instrument Serif', Georgia, serif",
                            fontSize: 'clamp(22px, 3vw, 38px)',
                            fontWeight: 400,
                            fontStyle: 'italic',
                            color: 'var(--text-primary)',
                            lineHeight: 1.4,
                            maxWidth: 760,
                            margin: 0,
                        }}>
                            {STATEMENTS[index]}
                        </p>
                    </motion.div>
                </AnimatePresence>

                {/* Dot indicators */}
                <div style={{ display: 'flex', gap: 8, marginTop: 48 }}>
                    {STATEMENTS.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setIndex(i)}
                            aria-label={`Statement ${i + 1}`}
                            style={{
                                width: i === index ? 24 : 6,
                                height: 6,
                                borderRadius: 3,
                                background: i === index ? 'var(--gold)' : 'var(--border-default)',
                                border: 'none',
                                padding: 0,
                                transition: 'all 400ms ease',
                                cursor: 'pointer',
                            }}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
