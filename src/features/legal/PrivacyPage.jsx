import LegalPage from './LegalPage'
import { PRIVACY } from './legalContent'

export default function PrivacyPage() {
    return <LegalPage doc={PRIVACY} other={{ to: '/terms', label: 'Terms of Service' }} />
}
