import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from '@phosphor-icons/react'

const FAQS = [
    {
        q: 'How fast does Butler respond?',
        a: "Most requests are acknowledged within minutes and fulfilled within the same day. For grocery runs, dry cleaning, and food pickup, our average turnaround is under 2 hours. We'll always confirm timing before we head out.",
    },
    {
        q: 'What areas do you currently serve?',
        a: "Butler is currently operating across Orange County — Newport Beach, Irvine, Laguna Beach, Costa Mesa, Huntington Beach, and surrounding areas. If you're on the edge, just ask. We'll let you know.",
    },
    {
        q: 'What happens after I pay the $25 founding fee?',
        a: "You're locked in as a founding member. When Butler goes live, you'll be among the first clients onboarded — with priority access, 20% off your first two months, and 2 free errands. We'll email you everything you need.",
    },
    {
        q: "Is there a long-term commitment?",
        a: "No. The $25 founding fee reserves your spot. When we launch, the monthly subscription is $199 — and you can cancel anytime. No contracts, no minimums, no catch.",
    },
    {
        q: 'Who are the Butler drivers?',
        a: "Every driver goes through a background check, vehicle inspection, and approval process before handling any request. You'll see their name, rating, and ETA before they pick anything up.",
    },
]

export default function FAQSection() {
    const [open, setOpen] = useState(null)

    return (
        <section style={{
            background: 'var(--bg-base)',
            padding: '120px 40px',
            borderTop: '1px solid var(--border-subtle)',
        }}>
            <div style={{ maxWidth: 760, margin: '0 auto' }}>
                <p className="t-label" style={{ marginBottom: 20, textAlign: 'center' }}>Questions</p>
                <h2 className="t-h2" style={{ textAlign: 'center', marginBottom: 64, fontSize: 'clamp(28px, 3.5vw, 44px)' }}>
                    Everything you need to know.
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {FAQS.map((faq, i) => (
                        <div
                            key={i}
                            style={{
                                borderTop: '1px solid var(--border-subtle)',
                                borderBottom: i === FAQS.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                            }}
                        >
                            <button
                                onClick={() => setOpen(open === i ? null : i)}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 24,
                                    padding: '22px 0',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                }}
                            >
                                <span style={{
                                    fontFamily: "'Instrument Serif', Georgia, serif",
                                    fontSize: 'clamp(17px, 2vw, 22px)',
                                    color: open === i ? 'var(--text-primary)' : 'var(--text-muted)',
                                    lineHeight: 1.3,
                                    transition: 'color 200ms',
                                }}>
                                    {faq.q}
                                </span>
                                <span style={{
                                    width: 28, height: 28,
                                    borderRadius: '50%',
                                    border: `1px solid ${open === i ? 'var(--gold-border)' : 'var(--border-default)'}`,
                                    background: open === i ? 'var(--gold-dim)' : 'transparent',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: open === i ? 'var(--gold)' : 'var(--text-dim)',
                                    flexShrink: 0,
                                    transition: 'all 200ms',
                                }}>
                                    {open === i
                                        ? <Minus size={13} weight="bold" />
                                        : <Plus  size={13} weight="bold" />
                                    }
                                </span>
                            </button>

                            <AnimatePresence initial={false}>
                                {open === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1, transition: { duration: 0.35, ease: [0.25, 0, 0.2, 1] } }}
                                        exit={{ height: 0, opacity: 0, transition: { duration: 0.25 } }}
                                        style={{ overflow: 'hidden' }}
                                    >
                                        <p style={{
                                            fontFamily: "'Inter', sans-serif",
                                            fontSize: 15,
                                            color: 'var(--text-muted)',
                                            lineHeight: 1.8,
                                            paddingBottom: 24,
                                            maxWidth: 640,
                                        }}>
                                            {faq.a}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
