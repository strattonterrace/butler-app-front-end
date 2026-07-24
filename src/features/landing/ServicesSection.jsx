import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SERVICES = [
    {
        num: '01',
        title: 'Grocery Pickup',
        desc: 'Your weekly shop, handled. Delivered when you need it.',
        tag: 'Most requested',
    },
    {
        num: '02',
        title: 'Dry Cleaning',
        desc: 'Pickup and drop-off on your schedule. Your wardrobe, always ready.',
        tag: null,
    },
    {
        num: '03',
        title: 'Food Pickup',
        desc: "Any restaurant, any time. We handle the wait so you don't have to.",
        tag: null,
    },
    {
        num: '04',
        title: 'General Errands',
        desc: 'Pharmacy, returns, post office, hardware stores, warehouse clubs. Whatever needs doing.',
        tag: 'And more',
    },
]

export default function ServicesSection() {
    const containerRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Header reveal
            gsap.set('.srv-header', { opacity: 0, y: 40 })
            gsap.to('.srv-header', {
                scrollTrigger: { trigger: '#services', start: 'top 75%' },
                opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
            })

            // Each row slides in with stagger
            gsap.set('.srv-row', { opacity: 0, x: -32 })
            gsap.to('.srv-row', {
                scrollTrigger: { trigger: '.srv-list', start: 'top 80%' },
                opacity: 1, x: 0, duration: 0.7, stagger: 0.14, ease: 'power2.out',
            })
        }, containerRef)

        return () => ctx.revert()
    }, [])

    return (
        <section id="services" ref={containerRef} style={{
            background: 'var(--bg-base)',
            padding: '120px 0',
        }}>
            <div style={{ maxWidth: 1060, margin: '0 auto', padding: '0 40px' }}>

                {/* Header */}
                <div className="srv-header" style={{ marginBottom: 72, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' }}>
                    <div>
                        <p className="t-label" style={{ marginBottom: 20 }}>What Butler handles for you</p>
                        <h2 className="t-h2" style={{ maxWidth: 520 }}>
                            Everything that<br />steals your day.
                        </h2>
                    </div>
                    <p className="t-body" style={{ maxWidth: 300, textAlign: 'right', fontSize: 14, lineHeight: 1.8 }}>
                        If it takes time you don't have,<br />Butler takes care of it.
                    </p>
                </div>

                {/* Editorial list */}
                <div className="srv-list">
                    {SERVICES.map((s, i) => (
                        <div
                            key={s.num}
                            className="srv-row"
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '80px 1fr auto',
                                alignItems: 'center',
                                gap: 40,
                                padding: '32px 0',
                                borderTop: '1px solid var(--border-subtle)',
                                borderBottom: i === SERVICES.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                                cursor: 'default',
                                transition: 'background 200ms',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(201,168,76,0.025)'
                                e.currentTarget.querySelector('.srv-num').style.color = 'var(--gold)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent'
                                e.currentTarget.querySelector('.srv-num').style.color = 'var(--border-default)'
                            }}
                        >
                            <span className="srv-num" style={{
                                fontFamily: "'Instrument Serif', Georgia, serif",
                                fontSize: 'clamp(32px, 3.5vw, 48px)',
                                color: 'var(--border-default)',
                                lineHeight: 1,
                                transition: 'color 200ms',
                                userSelect: 'none',
                            }}>
                                {s.num}
                            </span>

                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
                                    <h3 style={{
                                        fontFamily: "'Instrument Serif', Georgia, serif",
                                        fontSize: 'clamp(22px, 2.8vw, 36px)',
                                        fontWeight: 400,
                                        color: 'var(--text-primary)',
                                        lineHeight: 1.15,
                                    }}>
                                        {s.title}
                                    </h3>
                                    {s.tag && (
                                        <span style={{
                                            fontFamily: "'Inter', sans-serif",
                                            fontSize: 10,
                                            fontWeight: 700,
                                            letterSpacing: '0.1em',
                                            textTransform: 'uppercase',
                                            color: 'var(--gold)',
                                            border: '1px solid rgba(201,168,76,0.25)',
                                            borderRadius: 100,
                                            padding: '3px 10px',
                                            flexShrink: 0,
                                        }}>
                                            {s.tag}
                                        </span>
                                    )}
                                </div>
                                <p style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: 14,
                                    color: 'var(--text-dim)',
                                    lineHeight: 1.7,
                                }}>
                                    {s.desc}
                                </p>
                            </div>

                            <div style={{
                                width: 40, height: 40,
                                borderRadius: '50%',
                                border: '1px solid var(--border-default)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0,
                                opacity: 0.4,
                            }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--text-muted)' }}>
                                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer tagline */}
                <p style={{
                    fontFamily: "'Instrument Serif', Georgia, serif",
                    fontSize: 'clamp(14px, 1.6vw, 17px)',
                    color: 'var(--text-dim)',
                    fontStyle: 'italic',
                    textAlign: 'right',
                    marginTop: 32,
                    letterSpacing: '0.02em',
                }}>
                    And anything else that's eating your time.
                </p>
            </div>
        </section>
    )
}
