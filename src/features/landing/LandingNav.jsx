import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { ArrowRight } from '@phosphor-icons/react'

export default function LandingNav() {
    const [scrolled, setScrolled] = useState(false)
    const { isAuthenticated, currentUser } = useAuthStore()

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const dashboardRoute = currentUser?.role
        ? { client: '/dashboard', operator: '/operator', driver: '/driver', admin: '/admin' }[currentUser.role] || '/dashboard'
        : '/dashboard'

    return (
        <nav className={`l-nav${scrolled ? ' scrolled' : ''}`}>
            <div className="l-nav-inner">
                <a href="#" className="l-nav-logo">Butler</a>
                {isAuthenticated ? (
                    <Link to={dashboardRoute} className="l-nav-cta">
                        Go to dashboard <ArrowRight size={13} weight="bold" />
                    </Link>
                ) : (
                    <Link to="/login" className="l-nav-cta">
                        Already a member? Sign in <ArrowRight size={13} weight="bold" />
                    </Link>
                )}
            </div>
        </nav>
    )
}
