import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { motion } from 'framer-motion'
import { ArrowDown } from '@phosphor-icons/react'

const CITIES = ['Newport Beach', 'Irvine', 'Laguna Beach', 'Costa Mesa', 'Huntington Beach']

export default function HeroSection() {
    const containerRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.set(['.l-hero-eyebrow', '.l-hero-headline', '.l-hero-sub', '.l-hero-scroll-cue'], {
                opacity: 0, y: 36,
            })
            gsap.set('.l-hero-bg-word', { opacity: 0 })

            const tl = gsap.timeline({ delay: 0.1 })
            tl.to('.l-hero-bg-word',    { opacity: 1, duration: 1.4, ease: 'power1.out' }, 0)
            tl.to('.l-hero-eyebrow',    { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' }, 0.18)
            tl.to('.l-hero-headline',   { opacity: 1, y: 0, duration: 0.95, ease: 'power2.out' }, 0.32)
            tl.to('.l-hero-sub',        { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' }, 0.54)
            tl.to('.l-hero-scroll-cue', { opacity: 1, y: 0, duration: 0.6,  ease: 'power2.out' }, 0.76)

            // Ring pulse
            gsap.to('.l-ring-1', { scale: 1.07, duration: 4.2,  yoyo: true, repeat: -1, ease: 'sine.inOut' })
            gsap.to('.l-ring-2', { scale: 1.045, duration: 5.8, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.1 })
            gsap.to('.l-ring-3', { scale: 1.025, duration: 7.2, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 2.0 })

        }, containerRef)

        // Mouse parallax
        const handleMouseMove = (e) => {
            const { clientX, clientY, currentTarget } = e
            const { width, height } = currentTarget.getBoundingClientRect()
            const x = (clientX / width  - 0.5) * 22
            const y = (clientY / height - 0.5) * 14

            gsap.to('.l-ring-1', { x: x * 0.7,  y: y * 0.7,  duration: 1.2, ease: 'power1.out', overwrite: 'auto' })
            gsap.to('.l-ring-2', { x: x * 0.4,  y: y * 0.4,  duration: 1.5, ease: 'power1.out', overwrite: 'auto' })
            gsap.to('.l-ring-3', { x: x * 0.18, y: y * 0.18, duration: 1.8, ease: 'power1.out', overwrite: 'auto' })
            gsap.to('.l-hero-bg-word', { x: x * 0.18, y: y * 0.1, duration: 1.6, ease: 'power1.out', overwrite: 'auto' })
        }

        const hero = containerRef.current
        hero?.addEventListener('mousemove', handleMouseMove)
        return () => {
            ctx.revert()
            hero?.removeEventListener('mousemove', handleMouseMove)
        }
    }, [])

    const scrollToServices = () => {
        document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <section
            className="l-hero"
            id="hero"
            ref={containerRef}
            style={{ alignItems: 'center', justifyContent: 'flex-start' }}
        >
            {/* SVG grain */}
            <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
                <filter id="grain">
                    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                    <feColorMatrix type="saturate" values="0" />
                    <feBlend in="SourceGraphic" mode="overlay" result="blend" />
                    <feComposite in="blend" in2="SourceGraphic" operator="in" />
                </filter>
            </svg>
            <div style={{
                position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
                filter: 'url(#grain)', opacity: 0.04, background: 'var(--text-primary)',
            }} aria-hidden />

            {/* Center glow */}
            <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 600, height: 600, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)',
                pointerEvents: 'none', zIndex: 1,
            }} aria-hidden />

            {/* Watermark */}
            <span className="l-hero-bg-word" aria-hidden style={{ zIndex: 0, left: '50%', transform: 'translateX(-50%)' }}>
                Butler
            </span>

            {/* Rings */}
            <div className="l-hero-ambient" aria-hidden>
                <div className="l-ambient-ring l-ring-1" />
                <div className="l-ambient-ring l-ring-2" />
                <div className="l-ambient-ring l-ring-3" />
            </div>

            {/* Two-column layout */}
            <div style={{
                position: 'relative', zIndex: 4,
                width: '100%', maxWidth: 1100,
                margin: '0 auto',
                padding: '0 40px',
                display: 'grid',
                gridTemplateColumns: '1fr 340px',
                alignItems: 'center',
                gap: 60,
            }}>
                {/* Left: headline */}
                <div>
                    <p className="t-label l-hero-eyebrow" style={{ marginBottom: 28, textAlign: 'left' }}>
                        Personal Concierge Service
                    </p>

                    <h1 className="t-hero l-hero-headline" style={{ textAlign: 'left', marginBottom: 28 }}>
                        Your time is<br />
                        too{' '}
                        <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>valuable</em>
                        <br />
                        for errands.
                    </h1>

                    <p className="l-hero-sub" style={{ textAlign: 'left', margin: '0 0 48px 0' }}>
                        Butler handles the things that eat your time —<br />
                        so you can focus on what actually matters.
                    </p>

                    <button className="l-hero-scroll-cue" onClick={scrollToServices} style={{ justifyContent: 'flex-start' }}>
                        <span>See how it works</span>
                        <ArrowDown size={15} weight="regular" />
                    </button>
                </div>

                {/* Right: editorial column */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9, duration: 1.0 }}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0,
                        paddingLeft: 40,
                        borderLeft: '1px solid var(--border-subtle)',
                    }}
                >
                    {/* Founding spots */}
                    <div style={{ paddingBottom: 32, marginBottom: 32, borderBottom: '1px solid var(--border-subtle)' }}>
                        <p style={{
                            fontFamily: "'Instrument Serif', Georgia, serif",
                            fontSize: 'clamp(52px, 7vw, 80px)',
                            color: 'var(--text-primary)',
                            lineHeight: 1,
                            letterSpacing: '-0.02em',
                            marginBottom: 8,
                        }}>
                            47
                        </p>
                        <p style={{
                            fontSize: 12, fontWeight: 500,
                            color: 'var(--text-dim)',
                            fontFamily: "'Inter', sans-serif",
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                        }}>
                            Founding spots remaining
                        </p>
                    </div>

                    {/* Currently serving */}
                    <div style={{ paddingBottom: 32, marginBottom: 32, borderBottom: '1px solid var(--border-subtle)' }}>
                        <p style={{
                            fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
                            textTransform: 'uppercase', color: 'var(--gold)',
                            fontFamily: "'Inter', sans-serif",
                            marginBottom: 16,
                        }}>
                            Currently serving
                        </p>
                        {CITIES.map((city, i) => (
                            <p key={city} style={{
                                fontFamily: "'Instrument Serif', Georgia, serif",
                                fontSize: 15,
                                color: i === 0 ? 'var(--text-muted)' : 'var(--text-dim)',
                                lineHeight: 1,
                                padding: '7px 0',
                                borderBottom: i < CITIES.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                                fontStyle: i === 0 ? 'italic' : 'normal',
                            }}>
                                {city}
                            </p>
                        ))}
                    </div>

                    {/* Est. */}
                    <div>
                        <p style={{
                            fontSize: 11,
                            color: 'var(--text-dim)',
                            fontFamily: "'Inter', sans-serif",
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                        }}>
                            Orange County, CA &nbsp;·&nbsp; Est. 2026
                        </p>
                    </div>
                </motion.div>
            </div>

            <style>{`
                @keyframes pulse-dot {
                    0%, 100% { opacity: 1; }
                    50%       { opacity: 0.4; }
                }
                @media (max-width: 860px) {
                    #hero > div[style] { grid-template-columns: 1fr !important; }
                    #hero > div[style] > div:last-child { display: none !important; }
                }
            `}</style>
        </section>
    )
}
