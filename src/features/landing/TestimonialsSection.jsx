import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const TESTIMONIALS = [
    {
        quote: "I haven't touched a grocery store in four months. Butler just handles it every week — I don't even think about it anymore.",
        name: 'Sarah K.',
        detail: 'Client since January · Newport Beach',
    },
    {
        quote: "The dry cleaning alone was worth it. But knowing I can hand off literally anything that comes up during the week? That's what changed things.",
        name: 'Marcus T.',
        detail: 'Client since February · Irvine',
    },
    {
        quote: "I work from home with two kids. Butler gives me back the hours I used to lose to errands. That's not a luxury — that's a necessity.",
        name: 'Priya M.',
        detail: 'Client since March · Laguna Beach',
    },
]

export default function TestimonialsSection() {
    const [index, setIndex] = useState(0)

    useEffect(() => {
        const id = setInterval(() => setIndex(i => (i + 1) % TESTIMONIALS.length), 5000)
        return () => clearInterval(id)
    }, [])

    const t = TESTIMONIALS[index]

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

                <p className="t-label" style={{ marginBottom: 40 }}>What members say</p>

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

                        {/* Quote */}
                        <blockquote style={{
                            fontFamily: "'Instrument Serif', Georgia, serif",
                            fontSize: 'clamp(22px, 3vw, 38px)',
                            fontWeight: 400,
                            fontStyle: 'italic',
                            color: 'var(--text-primary)',
                            lineHeight: 1.4,
                            marginBottom: 40,
                            maxWidth: 760,
                        }}>
                            "{t.quote}"
                        </blockquote>

                        {/* Attribution */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{
                                width: 36, height: 36,
                                borderRadius: '50%',
                                background: 'var(--bg-elevated)',
                                border: '1px solid var(--border-default)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontFamily: "'Instrument Serif', Georgia, serif",
                                fontSize: 14,
                                color: 'var(--gold)',
                            }}>
                                {t.name[0]}
                            </div>
                            <div>
                                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Inter', sans-serif" }}>
                                    {t.name}
                                </p>
                                <p style={{ fontSize: 12, color: 'var(--text-dim)', fontFamily: "'Inter', sans-serif", marginTop: 2 }}>
                                    {t.detail}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Dot indicators */}
                <div style={{ display: 'flex', gap: 8, marginTop: 48 }}>
                    {TESTIMONIALS.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setIndex(i)}
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
