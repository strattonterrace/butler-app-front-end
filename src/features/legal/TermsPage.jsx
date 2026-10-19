import LegalPage from './LegalPage'
import { TERMS } from './legalContent'

export default function TermsPage() {
    return <LegalPage doc={TERMS} other={{ to: '/privacy', label: 'Privacy Policy' }} />
}
