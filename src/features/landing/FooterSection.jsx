import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const NAV_COLS = [
    {
        title: 'Product',
        links: [
            { label: 'How it works', href: '#services' },
            { label: 'Pricing',      href: '#flow' },
            { label: 'Drive with us', to: '/become-driver' },
        ],
    },
    {
        title: 'Company',
        links: [
            { label: 'About Butler', href: '#hero' },
            { label: 'Contact',      href: 'mailto:hello@butlerapp.com' },
        ],
    },
    {
        title: 'Legal',
        links: [
            { label: 'Terms of Service', href: '#' },
            { label: 'Privacy Policy',   href: '#' },
        ],
    },
]

export default function FooterSection() {
    const wordRef = useRef(null)

    useEffect(() => {
        if (!wordRef.current) return
        gsap.set(wordRef.current, { yPercent: 60, opacity: 0 })
        gsap.to(wordRef.current, {
            scrollTrigger: {
                trigger: wordRef.current,
                start: 'top 90%',
            },
            yPercent: 0,
            opacity: 1,
            duration: 1.1,
            ease: 'power3.out',
        })
    }, [])

    return (
        <footer style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)' }}>

            {/* Top nav section */}
            <div style={{
                maxWidth: 1060, margin: '0 auto',
                padding: '72px 40px 64px',
                display: 'grid',
                gridTemplateColumns: '260px 1fr',
                gap: 64,
                borderBottom: '1px solid var(--border-subtle)',
            }}>
                {/* Brand */}
                <div>
                    <p style={{
                        fontFamily: "'Instrument Serif', Georgia, serif",
                        fontSize: 22,
                        color: 'var(--text-primary)',
                        marginBottom: 12,
                        letterSpacing: '0.02em',
                    }}>Butler</p>
                    <p style={{
                        fontSize: 13,
                        color: 'var(--text-dim)',
                        lineHeight: 1.7,
                        fontFamily: "'Inter', sans-serif",
                        maxWidth: 200,
                    }}>
                        Premium personal errand service, built for Orange County.
                    </p>
                </div>

                {/* Nav columns */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
                    {NAV_COLS.map((col) => (
                        <div key={col.title}>
                            <p style={{
                                fontSize: 10,
                                fontWeight: 700,
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                color: 'var(--text-dim)',
                                marginBottom: 20,
                                fontFamily: "'Inter', sans-serif",
                            }}>
                                {col.title}
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                {col.links.map((link) => (
                                    link.to ? (
                                        <Link
                                            key={link.label}
                                            to={link.to}
                                            style={{
                                                fontSize: 14,
                                                color: 'var(--text-muted)',
                                                textDecoration: 'none',
                                                fontFamily: "'Inter', sans-serif",
                                                transition: 'color 180ms',
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                                        >
                                            {link.label}
                                        </Link>
                                    ) : (
                                        <a
                                            key={link.label}
                                            href={link.href}
                                            style={{
                                                fontSize: 14,
                                                color: 'var(--text-muted)',
                                                textDecoration: 'none',
                                                fontFamily: "'Inter', sans-serif",
                                                transition: 'color 180ms',
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                                        >
                                            {link.label}
                                        </a>
                                    )
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Massive wordmark */}
            <div style={{ overflow: 'hidden', padding: '48px 32px 0' }}>
                <p
                    ref={wordRef}
                    style={{
                        fontFamily: "'Instrument Serif', Georgia, serif",
                        fontSize: 'clamp(72px, 15vw, 200px)',
                        fontWeight: 400,
                        color: 'var(--text-primary)',
                        lineHeight: 0.9,
                        letterSpacing: '-0.02em',
                        whiteSpace: 'nowrap',
                        marginLeft: -4,
                    }}
                    aria-hidden
                >
                    Butler.
                </p>
            </div>

            {/* Copyright bar */}
            <div style={{
                maxWidth: 1060, margin: '0 auto',
                padding: '20px 40px 32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12,
            }}>
                <p style={{ fontSize: 12, color: 'var(--text-dim)', fontFamily: "'Inter', sans-serif" }}>
                    © 2026 Butler. All rights reserved.
                </p>
                <p style={{ fontSize: 12, color: 'var(--text-dim)', fontFamily: "'Inter', sans-serif", letterSpacing: '0.06em' }}>
                    OC &nbsp;·&nbsp; EST. 2026
                </p>
                <Link
                    to="/login"
                    style={{ fontSize: 12, color: 'var(--text-dim)', fontFamily: "'Inter', sans-serif", textDecoration: 'none', transition: 'color 180ms' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-dim)'}
                >
                    Member login →
                </Link>
            </div>
        </footer>
    )
}
