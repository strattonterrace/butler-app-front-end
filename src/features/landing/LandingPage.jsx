import { useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import Lenis from 'lenis'
import LandingNav from './LandingNav'
import HeroSection from './HeroSection'
import MarqueeStrip from './MarqueeStrip'
import ServicesSection from './ServicesSection'
import GuidedFlow from './GuidedFlow'
import TestimonialsSection from './TestimonialsSection'
import ProcessSection from './ProcessSection'
import TimeSection from './TimeSection'
import FAQSection from './FAQSection'
import FooterSection from './FooterSection'
import StickyBar from './StickyBar'
import ReassuranceSection from './ReassuranceSection'
import CaptureSection from './CaptureSection'
import OfferSection from './OfferSection'
import ThankYouState from './ThankYouState'
import './landing.css'

function GoldCursor() {
    const dotRef  = useRef(null)
    const ringRef = useRef(null)

    useEffect(() => {
        const dot  = dotRef.current
        const ring = ringRef.current
        if (!dot || !ring) return

        let mouseX = 0, mouseY = 0

        const onMove = (e) => {
            mouseX = e.clientX
            mouseY = e.clientY
            gsap.to(dot,  { x: mouseX, y: mouseY, duration: 0.08, ease: 'none' })
            gsap.to(ring, { x: mouseX, y: mouseY, duration: 0.45, ease: 'power2.out' })
        }

        const onEnterClickable = () => {
            gsap.to(ring, { scale: 1.8, opacity: 0.5, duration: 0.25 })
            gsap.to(dot,  { scale: 0.5, duration: 0.25 })
        }
        const onLeaveClickable = () => {
            gsap.to(ring, { scale: 1, opacity: 1, duration: 0.25 })
            gsap.to(dot,  { scale: 1, duration: 0.25 })
        }

        window.addEventListener('mousemove', onMove)
        document.querySelectorAll('a, button').forEach(el => {
            el.addEventListener('mouseenter', onEnterClickable)
            el.addEventListener('mouseleave', onLeaveClickable)
        })

        return () => {
            window.removeEventListener('mousemove', onMove)
        }
    }, [])

    return (
        <>
            {/* Dot */}
            <div ref={dotRef} style={{
                position: 'fixed', top: -4, left: -4,
                width: 8, height: 8,
                borderRadius: '50%',
                background: 'var(--gold)',
                pointerEvents: 'none',
                zIndex: 9999,
                mixBlendMode: 'difference',
            }} aria-hidden />
            {/* Ring */}
            <div ref={ringRef} style={{
                position: 'fixed', top: -16, left: -16,
                width: 32, height: 32,
                borderRadius: '50%',
                border: '1px solid rgba(201,168,76,0.5)',
                pointerEvents: 'none',
                zIndex: 9998,
            }} aria-hidden />
        </>
    )
}

export default function LandingPage() {
    const [phase, setPhase] = useState('landing')
    const [answers, setAnswers] = useState({ q1: [], q2: null, q3: null })

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        if (params.get('success') === 'true') setPhase('thankyou')
    }, [])

    useEffect(() => {
        if (phase !== 'landing') return
        const lenis = new Lenis({ lerp: 0.085, smoothWheel: true })
        let rafId
        function raf(time) { lenis.raf(time); rafId = requestAnimationFrame(raf) }
        rafId = requestAnimationFrame(raf)
        return () => { cancelAnimationFrame(rafId); lenis.destroy() }
    }, [phase])

    useEffect(() => {
        document.body.style.overflow = phase !== 'landing' ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [phase])

    const handleFlowComplete = (userAnswers) => {
        setAnswers(userAnswers)
        setPhase('reassurance')
    }

    return (
        <div className="landing-root">
            <GoldCursor />
            <StickyBar />
            <LandingNav />

            <div style={{ visibility: phase === 'landing' ? 'visible' : 'hidden' }}>
                <HeroSection />
                <MarqueeStrip />
                <ServicesSection />
                <TestimonialsSection />
                <ProcessSection />
                <TimeSection />
                <GuidedFlow onComplete={handleFlowComplete} />
                <FAQSection />
                <FooterSection />
            </div>

            <AnimatePresence mode="wait">
                {phase === 'reassurance' && (
                    <ReassuranceSection
                        key="reassurance"
                        q3Answer={answers.q3}
                        onContinue={() => setPhase('capture')}
                    />
                )}
                {phase === 'capture' && (
                    <CaptureSection
                        key="capture"
                        onSubmit={() => setPhase('offer')}
                    />
                )}
                {phase === 'offer' && (
                    <OfferSection key="offer" />
                )}
                {phase === 'thankyou' && (
                    <ThankYouState key="thankyou" />
                )}
            </AnimatePresence>
        </div>
    )
}
