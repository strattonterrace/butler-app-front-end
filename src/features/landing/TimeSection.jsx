import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function TimeSection() {
    const containerRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.set('.time-num', { opacity: 0, y: 60 })
            gsap.set('.time-line', { opacity: 0, y: 30 })

            gsap.to('.time-num', {
                scrollTrigger: { trigger: containerRef.current, start: 'top 72%' },
                opacity: 1, y: 0, duration: 1.0, ease: 'power3.out',
            })
            gsap.to('.time-line', {
                scrollTrigger: { trigger: containerRef.current, start: 'top 68%' },
                opacity: 1, y: 0, duration: 0.75, stagger: 0.12, ease: 'power2.out', delay: 0.3,
            })
        }, containerRef)
        return () => ctx.revert()
    }, [])

    return (
        <section ref={containerRef} style={{
            background: 'var(--bg-base)',
            padding: '130px 40px',
            borderTop: '1px solid var(--border-subtle)',
            textAlign: 'center',
        }}>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
                <p className="t-label time-line" style={{ marginBottom: 40 }}>The cost of doing nothing</p>

                {/* Big number */}
                <div style={{ marginBottom: 32, overflow: 'hidden' }}>
                    <p className="time-num" style={{
                        fontFamily: "'Instrument Serif', Georgia, serif",
                        fontSize: 'clamp(80px, 16vw, 180px)',
                        fontWeight: 400,
                        lineHeight: 0.95,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-primary)',
                        display: 'inline-block',
                    }}>
                        9.8
                    </p>
                </div>

                <p className="time-line" style={{
                    fontFamily: "'Instrument Serif', Georgia, serif",
                    fontSize: 'clamp(18px, 2.5vw, 28px)',
                    color: 'var(--text-muted)',
                    marginBottom: 48,
                    lineHeight: 1.5,
                }}>
                    hours every week. The average person spends that<br />
                    on errands, waiting rooms, and grocery lines.
                </p>

                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 'clamp(24px, 6vw, 72px)',
                    flexWrap: 'wrap',
                }}>
                    {[
                        { num: '510',    unit: 'hours',    label: 'per year' },
                        { num: '21',     unit: 'full days', label: 'gone every year' },
                        { num: '$6.55',  unit: 'per hour', label: "if your time's worth $35/hr" },
                    ].map(({ num, unit, label }) => (
                        <div className="time-line" key={label} style={{ textAlign: 'center' }}>
                            <p style={{
                                fontFamily: "'Instrument Serif', Georgia, serif",
                                fontSize: 'clamp(28px, 4vw, 44px)',
                                color: 'var(--gold)',
                                lineHeight: 1,
                                marginBottom: 4,
                            }}>
                                {num}
                                <span style={{ fontSize: '0.45em', color: 'var(--text-dim)', marginLeft: 4, fontFamily: "'Inter', sans-serif" }}>
                                    {unit}
                                </span>
                            </p>
                            <p style={{ fontSize: 12, color: 'var(--text-dim)', fontFamily: "'Inter', sans-serif" }}>
                                {label}
                            </p>
                        </div>
                    ))}
                </div>

                <p className="time-line" style={{
                    fontFamily: "'Instrument Serif', Georgia, serif",
                    fontSize: 'clamp(16px, 2vw, 22px)',
                    fontStyle: 'italic',
                    color: 'var(--text-dim)',
                    marginTop: 56,
                }}>
                    Butler costs $199 a month. Your time is worth more than that.
                </p>
            </div>
        </section>
    )
}
