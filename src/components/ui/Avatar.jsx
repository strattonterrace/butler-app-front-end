import { getInitials } from '@/lib/utils'

const SIZE_MAP = { sm: 32, md: 40, lg: 48, xl: 64 }
const FONT_MAP = { sm: 12, md: 14, lg: 16, xl: 20 }

function Avatar({ name, src, size = 'md', style, ...props }) {
    const dim = SIZE_MAP[size] || 40
    const font = FONT_MAP[size] || 14
    const initials = getInitials(name)

    if (src) {
        return (
            <img src={src} alt={name || 'Avatar'}
                style={{ width: dim, height: dim, borderRadius: '50%', objectFit: 'cover', backgroundColor: '#1A1A1F', ...style }}
                {...props}
            />
        )
    }

    return (
        <div
            style={{
                width: dim, height: dim, borderRadius: '50%', backgroundColor: '#1A1A1F',
                border: '1px solid #27272A', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: font, fontWeight: 600, color: '#A1A1AA', flexShrink: 0, ...style,
            }}
            title={name} {...props}
        >
            {initials}
        </div>
    )
}

export { Avatar }
