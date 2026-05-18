import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Lenis from 'lenis'
import LandingNav from './LandingNav'
import HeroSection from './HeroSection'
import ServicesSection from './ServicesSection'
import GuidedFlow from './GuidedFlow'
import ReassuranceSection from './ReassuranceSection'
import CaptureSection from './CaptureSection'
import OfferSection from './OfferSection'
import ThankYouState from './ThankYouState'
import './landing.css'

// phase: 'landing' | 'reassurance' | 'capture' | 'offer' | 'thankyou'

export default function LandingPage() {
    const [phase, setPhase] = useState('landing')
    const [answers, setAnswers] = useState({ q1: [], q2: null, q3: null })

    // Check for Stripe success redirect
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        if (params.get('success') === 'true') setPhase('thankyou')
    }, [])

    // Lenis smooth scroll — only while on landing, destroy on unmount
    useEffect(() => {
        if (phase !== 'landing') return

        const lenis = new Lenis({ lerp: 0.085, smoothWheel: true })
        let rafId

        function raf(time) {
            lenis.raf(time)
            rafId = requestAnimationFrame(raf)
        }
        rafId = requestAnimationFrame(raf)

        return () => {
            cancelAnimationFrame(rafId)
            lenis.destroy()
        }
    }, [phase])

    // Lock body scroll when in post-flow phases
    useEffect(() => {
        if (phase !== 'landing') {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [phase])

    const handleFlowComplete = (userAnswers) => {
        setAnswers(userAnswers)
        setPhase('reassurance')
    }

    return (
        <div className="landing-root">
            <LandingNav />

            {/* Scroll sections — always rendered, hidden behind overlay when phase != landing */}
            <div style={{ visibility: phase === 'landing' ? 'visible' : 'hidden' }}>
                <HeroSection />
                <ServicesSection />
                <GuidedFlow onComplete={handleFlowComplete} />
            </div>

            {/* Post-flow phases — full-screen fixed overlays */}
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
