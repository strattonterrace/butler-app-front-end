import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from '@phosphor-icons/react'

export default function StickyBar() {
    const [visible, setVisible] = useState(false)
    const [dismissed, setDismissed] = useState(false)

    useEffect(() => {
        const onScroll = () => {
            const scrolledPastHero = window.scrollY > window.innerHeight * 0.9
            const nearBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 120
            setVisible(scrolledPastHero && !nearBottom)
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const scrollToFlow = () => {
        document.getElementById('flow')?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <AnimatePresence>
            {visible && !dismissed && (
                <motion.div
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1, transition: { duration: 0.42, ease: [0.25, 0, 0.2, 1] } }}
                    exit={{ y: 80, opacity: 0, transition: { duration: 0.28 } }}
                    style={{
                        position: 'fixed',
                        bottom: 24,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 90,
                        background: 'rgba(17,17,19,0.92)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid var(--border-default)',
                        borderRadius: 100,
                        padding: '10px 10px 10px 24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,168,76,0.08)',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {/* Pulse dot */}
                    <span style={{
                        width: 7, height: 7, borderRadius: '50%',
                        background: 'var(--gold)',
                        flexShrink: 0,
                        animation: 'pulse-dot 2s ease infinite',
                    }} />

                    <span style={{
                        fontSize: 14,
                        fontFamily: "'Inter', sans-serif",
                        color: 'var(--text-muted)',
                    }}>
                        Ready to get your time back?
                    </span>

                    <button
                        onClick={scrollToFlow}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 8,
                            background: 'var(--gold)',
                            color: '#0A0A0B',
                            border: 'none',
                            borderRadius: 100,
                            padding: '10px 20px',
                            fontSize: 13,
                            fontWeight: 600,
                            fontFamily: "'Inter', sans-serif",
                            cursor: 'pointer',
                            transition: 'background 180ms, transform 180ms',
                            flexShrink: 0,
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--gold-bright)'; e.currentTarget.style.transform = 'scale(1.03)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--gold)'; e.currentTarget.style.transform = 'scale(1)' }}
                    >
                        Secure My Spot <ArrowRight size={13} weight="bold" />
                    </button>

                    {/* Dismiss */}
                    <button
                        onClick={() => setDismissed(true)}
                        style={{
                            width: 28, height: 28,
                            borderRadius: '50%',
                            background: 'transparent',
                            border: '1px solid var(--border-default)',
                            color: 'var(--text-dim)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: 14,
                            fontFamily: "'Inter', sans-serif",
                            flexShrink: 0,
                            transition: 'border-color 180ms',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--text-dim)'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-default)'}
                        aria-label="Dismiss"
                    >
                        ×
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
