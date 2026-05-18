import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
    Basket, TShirt, ForkKnife, Package,
} from '@phosphor-icons/react'

gsap.registerPlugin(ScrollTrigger)

const SERVICES = [
    {
        icon: Basket,
        title: 'Grocery Pickup',
        desc: 'Your weekly shop, handled. Delivered when you need it.',
    },
    {
        icon: TShirt,
        title: 'Dry Cleaning',
        desc: 'Pickup and delivery. Your wardrobe, always ready.',
    },
    {
        icon: ForkKnife,
        title: 'Food Pickup',
        desc: 'Any restaurant, any time. Restaurant quality at home.',
    },
    {
        icon: Package,
        title: 'General Errands',
        desc: 'Pharmacy, returns, drop-offs. Whatever needs doing.',
    },
]

export default function ServicesSection() {
    const containerRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.set(['.l-services-eyebrow', '.l-services-headline', '.l-services-sub'], {
                opacity: 0, y: 32,
            })
            gsap.to(['.l-services-eyebrow', '.l-services-headline', '.l-services-sub'], {
                scrollTrigger: { trigger: '#services', start: 'top 78%' },
                opacity: 1, y: 0, duration: 0.72, stagger: 0.1, ease: 'power2.out',
            })

            gsap.set('.l-service-card', { opacity: 0, y: 52 })
            gsap.to('.l-service-card', {
                scrollTrigger: { trigger: '.l-services-grid', start: 'top 80%' },
                opacity: 1, y: 0, duration: 0.65, stagger: 0.11, ease: 'power2.out',
            })

            gsap.set('.l-services-tagline', { opacity: 0 })
            gsap.to('.l-services-tagline', {
                scrollTrigger: { trigger: '.l-services-tagline', start: 'top 88%' },
                opacity: 1, duration: 0.6, ease: 'power2.out',
            })
        }, containerRef)

        return () => ctx.revert()
    }, [])

    return (
        <section className="l-services" id="services" ref={containerRef}>
            <div className="l-section-inner">
                <p className="t-label l-services-eyebrow">What Butler handles for you</p>
                <h2 className="t-h2 l-services-headline">
                    Everything that steals your day,<br />handled.
                </h2>
                <p className="t-body l-services-sub">
                    Grocery runs to pharmacies, dry cleaning to food pickup.<br />
                    If it takes time, Butler takes care of it.
                </p>

                <div className="l-services-grid">
                    {SERVICES.map((s) => (
                        <div className="l-service-card" key={s.title}>
                            <div className="l-service-icon-wrap">
                                <s.icon size={30} weight="regular" />
                            </div>
                            <h3 className="l-service-title">{s.title}</h3>
                            <p className="l-service-desc">{s.desc}</p>
                        </div>
                    ))}
                </div>

                <p className="t-caption l-services-tagline" style={{ fontStyle: 'italic', letterSpacing: '0.02em' }}>
                    And anything else that's eating your time.
                </p>
            </div>
        </section>
    )
}
