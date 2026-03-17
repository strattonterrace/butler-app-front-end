import { forwardRef } from 'react'
import { useIsMobile } from '@/hooks/useEdgeCases'

const labelStyle = {
    display: 'block', fontSize: 14, fontWeight: 500, color: '#A1A1AA',
    marginBottom: 6,
}

const errorStyle = { fontSize: 12, color: '#EF4444', marginTop: 4 }

const Input = forwardRef(({ type = 'text', label, error, style, ...props }, ref) => {
    const mobile = useIsMobile()
    const inputStyle = {
        display: 'flex', width: '100%', height: mobile ? 38 : 44, borderRadius: mobile ? 8 : 10,
        border: '1px solid #27272A', backgroundColor: '#1E1E24',
        padding: mobile ? '0 12px' : '0 14px', fontSize: mobile ? 13 : 14, color: '#F5F5F4',
        outline: 'none', transition: 'border-color 150ms ease',
        fontFamily: 'inherit',
    }
    return (
        <div style={{ marginBottom: 0 }}>
            {label && <label style={{ ...labelStyle, fontSize: mobile ? 13 : 14 }}>{label}</label>}
            <input
                type={type}
                ref={ref}
                style={{
                    ...inputStyle,
                    borderColor: error ? '#EF4444' : '#27272A',
                    ...style,
                }}
                onFocus={(e) => { e.target.style.borderColor = error ? '#EF4444' : '#C9A84C'; e.target.style.boxShadow = `0 0 0 3px ${error ? 'rgba(239,68,68,0.15)' : 'rgba(201,168,76,0.15)'}` }}
                onBlur={(e) => { e.target.style.borderColor = error ? '#EF4444' : '#27272A'; e.target.style.boxShadow = 'none' }}
                {...props}
            />
            {error && <p style={errorStyle}>{error}</p>}
        </div>
    )
})
Input.displayName = 'Input'

const Textarea = forwardRef(({ label, error, rows = 4, style, ...props }, ref) => {
    const mobile = useIsMobile()
    const inputStyle = {
        display: 'flex', width: '100%', borderRadius: mobile ? 8 : 10,
        border: '1px solid #27272A', backgroundColor: '#1E1E24',
        padding: mobile ? '8px 12px' : '10px 14px', fontSize: mobile ? 13 : 14, color: '#F5F5F4',
        outline: 'none', transition: 'border-color 150ms ease',
        fontFamily: 'inherit', height: 'auto', resize: 'none',
    }
    return (
        <div style={{ marginBottom: 0 }}>
            {label && <label style={{ ...labelStyle, fontSize: mobile ? 13 : 14 }}>{label}</label>}
            <textarea
                rows={rows}
                ref={ref}
                style={{
                    ...inputStyle,
                    borderColor: error ? '#EF4444' : '#27272A', ...style,
                }}
                onFocus={(e) => { e.target.style.borderColor = error ? '#EF4444' : '#C9A84C'; e.target.style.boxShadow = `0 0 0 3px ${error ? 'rgba(239,68,68,0.15)' : 'rgba(201,168,76,0.15)'}` }}
                onBlur={(e) => { e.target.style.borderColor = error ? '#EF4444' : '#27272A'; e.target.style.boxShadow = 'none' }}
                {...props}
            />
            {error && <p style={errorStyle}>{error}</p>}
        </div>
    )
})
Textarea.displayName = 'Textarea'

export { Input, Textarea }

