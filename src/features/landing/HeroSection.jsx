import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ArrowDown } from '@phosphor-icons/react'

export default function HeroSection() {
    const containerRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Initial states
            gsap.set(['.l-hero-eyebrow', '.l-hero-headline', '.l-hero-sub', '.l-hero-scroll-cue'], {
                opacity: 0, y: 36,
            })
            gsap.set('.l-hero-bg-word', { opacity: 0 })

            // Sequential entrance
            const tl = gsap.timeline({ delay: 0.1 })
            tl.to('.l-hero-bg-word',    { opacity: 1, duration: 1.2, ease: 'power1.out' }, 0)
            tl.to('.l-hero-eyebrow',    { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' }, 0.15)
            tl.to('.l-hero-headline',   { opacity: 1, y: 0, duration: 0.9,  ease: 'power2.out' }, 0.3)
            tl.to('.l-hero-sub',        { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' }, 0.5)
            tl.to('.l-hero-scroll-cue', { opacity: 1, y: 0, duration: 0.6,  ease: 'power2.out' }, 0.72)

            // Ambient rings — slow sine pulse, offset timing
            gsap.to('.l-ring-1', { scale: 1.06, duration: 4.2,  yoyo: true, repeat: -1, ease: 'sine.inOut' })
            gsap.to('.l-ring-2', { scale: 1.04, duration: 5.8,  yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.1 })
            gsap.to('.l-ring-3', { scale: 1.025, duration: 7.2, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 2.0 })
        }, containerRef)

        return () => ctx.revert()
    }, [])

    const scrollToServices = () => {
        document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <section className="l-hero" id="hero" ref={containerRef}>
            {/* Background watermark */}
            <span className="l-hero-bg-word" aria-hidden>Butler</span>

            {/* Ambient rings */}
            <div className="l-hero-ambient" aria-hidden>
                <div className="l-ambient-ring l-ring-1" />
                <div className="l-ambient-ring l-ring-2" />
                <div className="l-ambient-ring l-ring-3" />
            </div>

            <div className="l-hero-content">
                <p className="t-label l-hero-eyebrow">Personal Concierge Service</p>

                <h1 className="t-hero l-hero-headline">
                    Your time is too<br />valuable for errands.
                </h1>

                <p className="l-hero-sub">
                    Butler handles the things that eat your day —<br />
                    so you can focus on what actually matters.
                </p>

                <button className="l-hero-scroll-cue" onClick={scrollToServices} aria-label="See how it works">
                    <span>See how it works</span>
                    <ArrowDown size={16} weight="regular" />
                </button>
            </div>
        </section>
    )
}
