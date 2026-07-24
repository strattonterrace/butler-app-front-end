import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const ITEMS = [
    'Grocery Pickup',
    'Dry Cleaning',
    'Food Pickup',
    'Pharmacy Runs',
    'Package Drop-offs',
    'General Errands',
    'Personal Shopping',
    'Airport Runs',
]

function StripRow({ reversed = false }) {
    const trackRef = useRef(null)

    useEffect(() => {
        const track = trackRef.current
        if (!track) return
        const totalWidth = track.scrollWidth / 2

        gsap.set(track, { x: reversed ? -totalWidth : 0 })
        gsap.to(track, {
            x: reversed ? 0 : -totalWidth,
            duration: 28,
            ease: 'none',
            repeat: -1,
        })
    }, [reversed])

    const repeated = [...ITEMS, ...ITEMS, ...ITEMS]

    return (
        <div style={{ overflow: 'hidden', width: '100%' }}>
            <div
                ref={trackRef}
                style={{ display: 'flex', alignItems: 'center', gap: 0, width: 'max-content' }}
            >
                {repeated.map((item, i) => (
                    <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 0 }}>
                        <span style={{
                            fontFamily: "'Instrument Serif', Georgia, serif",
                            fontSize: 'clamp(13px, 1.4vw, 16px)',
                            color: i % 2 === 0 ? 'var(--text-dim)' : 'rgba(201,168,76,0.35)',
                            whiteSpace: 'nowrap',
                            padding: '0 24px',
                            letterSpacing: '0.04em',
                            fontStyle: i % 3 === 0 ? 'italic' : 'normal',
                        }}>
                            {item}
                        </span>
                        <span style={{ color: 'var(--border-default)', fontSize: 10, flexShrink: 0 }}>◆</span>
                    </span>
                ))}
            </div>
        </div>
    )
}

export default function MarqueeStrip() {
    return (
        <div style={{
            background: 'var(--bg-base)',
            borderTop: '1px solid var(--border-subtle)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '18px 0',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            overflow: 'hidden',
        }}>
            <StripRow reversed={false} />
            <StripRow reversed={true} />
        </div>
    )
}
