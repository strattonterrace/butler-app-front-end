/**
 * Legal content for Butler's Terms of Service and Privacy Policy.
 *
 * These are solid, service-specific starter documents tailored to Butler (a
 * membership concierge/errand service in Orange County that takes Stripe
 * payments and handles personal data). They should be reviewed by a licensed
 * attorney before public launch — they are a strong starting point, not a
 * substitute for legal counsel.
 */

const LAST_UPDATED = 'October 19, 2026'
const CONTACT_EMAIL = 'hello@mybutlerclub.com'

export const TERMS = {
    title: 'Terms of Service',
    lastUpdated: LAST_UPDATED,
    intro:
        'These Terms of Service ("Terms") govern your access to and use of Butler, a ' +
        'membership-based personal concierge and errand service operated in Orange County, ' +
        'California ("Butler", "we", "us", or "our"). By creating an account, subscribing to a ' +
        'membership, or otherwise using the service, you agree to be bound by these Terms. If you ' +
        'do not agree, please do not use Butler.',
    sections: [
        {
            heading: '1. What Butler Is',
            body: [
                'Butler is a subscription service that coordinates and completes everyday errands on ' +
                'your behalf — including grocery and pharmacy pickups, dry cleaning, package drop-offs, ' +
                'retail returns, and food pickups. Requests are reviewed by a territory operator and ' +
                'fulfilled by an approved driver.',
                'Butler is a service provider, not a retailer. We do not sell the goods you ask us to ' +
                'purchase or retrieve; we coordinate their pickup, delivery, or return on your behalf.',
            ],
        },
        {
            heading: '2. Eligibility',
            body: [
                'You must be at least 18 years old and able to form a binding contract to use Butler. ' +
                'Service is available only within territories we currently serve. We may refuse, ' +
                'limit, or discontinue service to anyone, at any time, at our discretion.',
            ],
        },
        {
            heading: '3. Your Account',
            body: [
                'You are responsible for the accuracy of the information you provide and for keeping ' +
                'your login credentials confidential. You are responsible for all activity under your ' +
                'account. Notify us promptly at ' + CONTACT_EMAIL + ' if you suspect unauthorized use.',
            ],
        },
        {
            heading: '4. Membership & Billing',
            body: [
                'Butler is offered as a recurring membership of $199 per month. Payments are processed ' +
                'securely by our payment processor, Stripe. By subscribing, you authorize us to charge ' +
                'your payment method on a recurring monthly basis until you cancel.',
                'Your membership automatically renews each billing period. We may change membership ' +
                'pricing with reasonable advance notice; changes take effect at your next renewal.',
            ],
        },
        {
            heading: '5. First-Month Guarantee, Cancellation & Refunds',
            body: [
                'First-month guarantee: if you are not satisfied within the first 30 days of your ' +
                'initial membership, contact us and we will refund your first month’s membership fee.',
                'You may cancel your membership at any time from your account settings. Your membership ' +
                'remains active through the end of the current paid period, and you will not be charged ' +
                'again after cancellation. Except for the first-month guarantee or where required by ' +
                'law, membership fees are non-refundable and we do not provide prorated refunds for ' +
                'partial periods.',
            ],
        },
        {
            heading: '6. Costs of Goods & Reimbursement',
            body: [
                'Your membership covers the Butler service itself. It does not cover the cost of the ' +
                'goods we purchase or handle on your behalf (for example, groceries, prescriptions, or ' +
                'meals) or any third-party fees. You are responsible for these costs, and we may ' +
                'require pre-authorization or reimbursement for out-of-pocket amounts incurred to ' +
                'fulfill your request.',
            ],
        },
        {
            heading: '7. Requests We Cannot Fulfill',
            body: ['For the safety of our members and staff, you may not use Butler to request:'],
            list: [
                'Anything illegal, or any item whose purchase or handling would violate the law.',
                'Controlled substances without a valid, lawful prescription in your name.',
                'Weapons, firearms, ammunition, explosives, or hazardous materials.',
                'Alcohol, tobacco, or cannabis for anyone under the legal age, or where we are not ' +
                'licensed to handle them.',
                'Any task that is unsafe, abusive, or requires a professional license we do not hold.',
            ],
            after: [
                'We may decline or cancel any request at our discretion, including requests that fall ' +
                'outside the scope of the service.',
            ],
        },
        {
            heading: '8. Fulfillment & Timing',
            body: [
                'We use commercially reasonable efforts to complete your requests promptly. Any time ' +
                'estimates are approximate and are not guarantees. Fulfillment may be affected by ' +
                'merchant availability, traffic, weather, and other factors outside our control.',
            ],
        },
        {
            heading: '9. Tips',
            body: [
                'Tips to drivers are optional and always appreciated. Where offered, tips are passed ' +
                'to the driver who completed your errand.',
            ],
        },
        {
            heading: '10. Your Conduct',
            body: [
                'You agree to provide accurate pickup and drop-off details, to be reachable and ' +
                'available as needed to complete your request, and to treat Butler staff, operators, ' +
                'and drivers with respect. Abusive, fraudulent, or unlawful conduct may result in ' +
                'suspension or termination of your account.',
            ],
        },
        {
            heading: '11. Disclaimers',
            body: [
                'Butler is provided "as is" and "as available." To the fullest extent permitted by ' +
                'law, we disclaim all warranties, express or implied, including merchantability, ' +
                'fitness for a particular purpose, and non-infringement. We do not warrant that the ' +
                'service will be uninterrupted or error-free, and we are not responsible for the ' +
                'quality, safety, or legality of goods purchased or handled on your behalf from ' +
                'third-party merchants.',
            ],
        },
        {
            heading: '12. Limitation of Liability',
            body: [
                'To the fullest extent permitted by law, Butler and its affiliates, operators, and ' +
                'drivers will not be liable for any indirect, incidental, special, consequential, or ' +
                'punitive damages. Our total liability for any claim arising out of or relating to the ' +
                'service will not exceed the amount you paid to Butler in the three (3) months before ' +
                'the event giving rise to the claim.',
            ],
        },
        {
            heading: '13. Indemnification',
            body: [
                'You agree to indemnify and hold harmless Butler and its affiliates, operators, and ' +
                'drivers from any claims, losses, or expenses (including reasonable legal fees) arising ' +
                'from your misuse of the service or your violation of these Terms or applicable law.',
            ],
        },
        {
            heading: '14. Suspension & Termination',
            body: [
                'We may suspend or terminate your access to Butler at any time if you breach these ' +
                'Terms, misuse the service, or where required to protect our members, staff, or ' +
                'business. You may stop using the service at any time by cancelling your membership.',
            ],
        },
        {
            heading: '15. Changes to These Terms',
            body: [
                'We may update these Terms from time to time. When we make material changes, we will ' +
                'update the "Last updated" date above and, where appropriate, notify you. Your ' +
                'continued use of Butler after changes take effect constitutes acceptance of the ' +
                'updated Terms.',
            ],
        },
        {
            heading: '16. Governing Law',
            body: [
                'These Terms are governed by the laws of the State of California, without regard to its ' +
                'conflict-of-laws rules. Any dispute arising from these Terms or the service will be ' +
                'subject to the exclusive jurisdiction of the state and federal courts located in ' +
                'Orange County, California. We encourage you to contact us first so we can try to ' +
                'resolve any issue informally.',
            ],
        },
        {
            heading: '17. Contact Us',
            body: ['Questions about these Terms? Reach us at ' + CONTACT_EMAIL + '.'],
        },
    ],
}

export const PRIVACY = {
    title: 'Privacy Policy',
    lastUpdated: LAST_UPDATED,
    intro:
        'This Privacy Policy explains how Butler ("we", "us", or "our") collects, uses, and shares ' +
        'information when you use our membership concierge and errand service. By using Butler, you ' +
        'agree to the practices described here.',
    sections: [
        {
            heading: '1. Information We Collect',
            body: ['We collect the following information to provide and improve the service:'],
            list: [
                'Account information: your name, email address, phone number, and password.',
                'Addresses and service area: your home or default address, pickup and drop-off ' +
                'locations, and the ZIP code you use to check availability.',
                'Request details: the errands you ask us to run, including any special instructions ' +
                'and estimated budgets you provide.',
                'Payment information: processed securely by Stripe. We store your subscription status ' +
                'and limited billing details, but we never see or store your full card number.',
                'Driver information (for drivers): vehicle details, license plate, and availability.',
                'Usage and device data: log data, device and browser information, and how you ' +
                'interact with the app.',
            ],
        },
        {
            heading: '2. How We Use Your Information',
            body: ['We use your information to:'],
            list: [
                'Provide, coordinate, and fulfill your requests.',
                'Process your membership payments and manage your subscription.',
                'Route your requests to the right operator and driver.',
                'Send you service notifications (for example, request updates and account emails).',
                'Provide customer support and respond to your inquiries.',
                'Maintain the security of the service and prevent fraud or abuse.',
                'Improve the service and comply with legal obligations.',
            ],
        },
        {
            heading: '3. How We Share Your Information',
            body: ['We share your information only as needed to run the service:'],
            list: [
                'With operators and drivers: to fulfill your request, the assigned operator and driver ' +
                'may see your name, request details, pickup and drop-off addresses, and contact number.',
                'With service providers who help us operate, including Stripe (payments), Resend ' +
                '(email delivery), Cloudinary (photo storage), and our hosting providers. These ' +
                'providers may process your data only to provide services to us.',
                'For legal reasons: when required by law, legal process, or to protect the rights, ' +
                'safety, or property of Butler, our members, or others.',
            ],
            after: [
                'We do not sell your personal information.',
            ],
        },
        {
            heading: '4. Payment Processing',
            body: [
                'Payments are handled by Stripe, a PCI-compliant payment processor. Your card details ' +
                'are provided directly to Stripe and are governed by Stripe’s privacy policy. Butler ' +
                'does not receive or store your full payment card information.',
            ],
        },
        {
            heading: '5. Data Retention',
            body: [
                'We retain your information for as long as your account is active and as needed to ' +
                'provide the service. We may retain certain information longer where required for ' +
                'legal, accounting, dispute-resolution, or fraud-prevention purposes.',
            ],
        },
        {
            heading: '6. Security',
            body: [
                'We protect your information using measures such as encryption in transit (HTTPS), ' +
                'access controls, and securely stored credentials. No method of transmission or ' +
                'storage is completely secure, so we cannot guarantee absolute security, but we work ' +
                'to protect your data and to address any issues promptly.',
            ],
        },
        {
            heading: '7. Your Privacy Rights',
            body: [
                'Depending on where you live, including under the California Consumer Privacy Act ' +
                '(CCPA/CPRA), you may have the right to access, correct, or delete the personal ' +
                'information we hold about you, and to not be discriminated against for exercising ' +
                'these rights. To make a request, contact us at ' + CONTACT_EMAIL + ' and we will ' +
                'respond as required by applicable law.',
            ],
        },
        {
            heading: '8. Cookies & Local Storage',
            body: [
                'We use essential cookies and browser local storage to keep you signed in and to ' +
                'remember basic preferences. These are necessary for the app to function. We do not ' +
                'use third-party advertising trackers.',
            ],
        },
        {
            heading: '9. Children’s Privacy',
            body: [
                'Butler is intended for adults 18 and older. We do not knowingly collect personal ' +
                'information from anyone under 18. If you believe a minor has provided us information, ' +
                'contact us and we will delete it.',
            ],
        },
        {
            heading: '10. Changes to This Policy',
            body: [
                'We may update this Privacy Policy from time to time. We will update the "Last ' +
                'updated" date above and, where appropriate, notify you of material changes.',
            ],
        },
        {
            heading: '11. Contact Us',
            body: ['Questions about your privacy? Reach us at ' + CONTACT_EMAIL + '.'],
        },
    ],
}
