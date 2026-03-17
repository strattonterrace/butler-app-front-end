import { useCallback, useRef, useState, useEffect } from 'react'


/**
 * useIsMobile — returns true when viewport width ≤ breakpoint.
 * Uses window.matchMedia for performance (no resize listener spam).
 * 
 * @param {number} breakpoint — default 768
 * @returns {boolean}
 */
export function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(() => window.innerWidth <= breakpoint)

    useEffect(() => {
        const mql = window.matchMedia(`(max-width: ${breakpoint}px)`)
        const handler = (e) => setIsMobile(e.matches)
        mql.addEventListener('change', handler)
        return () => mql.removeEventListener('change', handler)
    }, [breakpoint])

    return isMobile
}
/**
 * useDebounceClick — prevents double/rage clicks on buttons.
 * Returns [handleClick, isDisabled] — wrap your action in handleClick,
 * pass isDisabled to the button's disabled prop.
 * 
 * @param {Function} callback — the action to run
 * @param {number} cooldownMs — lockout period (default 1000ms)
 */
export function useDebounceClick(callback, cooldownMs = 1000) {
    const [disabled, setDisabled] = useState(false)
    const timerRef = useRef(null)

    const handleClick = useCallback((...args) => {
        if (disabled) return
        setDisabled(true)
        callback(...args)
        timerRef.current = setTimeout(() => setDisabled(false), cooldownMs)
    }, [disabled, callback, cooldownMs])

    useEffect(() => () => clearTimeout(timerRef.current), [])

    return [handleClick, disabled]
}


/**
 * useUnsavedChanges — warns user before leaving a page with unsaved form data.
 * Uses the browser's `beforeunload` event + React Router blocker concept.
 * 
 * @param {boolean} hasUnsavedChanges — true if form has been modified
 */
export function useUnsavedChanges(hasUnsavedChanges) {
    useEffect(() => {
        if (!hasUnsavedChanges) return

        const handleBeforeUnload = (e) => {
            e.preventDefault()
            e.returnValue = '' // Chrome requires this
        }

        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    }, [hasUnsavedChanges])
}


/**
 * useSessionTimeout — auto-logs out the user after a period of inactivity.
 * Resets the timer on mouse move, key press, or touch.
 * 
 * @param {Function} onTimeout — callback when session expires (e.g., logout)
 * @param {number} timeoutMs — inactivity threshold (default 30 min)
 */
export function useSessionTimeout(onTimeout, timeoutMs = 30 * 60 * 1000) {
    const timerRef = useRef(null)

    useEffect(() => {
        const resetTimer = () => {
            clearTimeout(timerRef.current)
            timerRef.current = setTimeout(onTimeout, timeoutMs)
        }

        const events = ['mousemove', 'keydown', 'touchstart', 'click', 'scroll']
        events.forEach(e => window.addEventListener(e, resetTimer, { passive: true }))
        resetTimer() // start the timer

        return () => {
            clearTimeout(timerRef.current)
            events.forEach(e => window.removeEventListener(e, resetTimer))
        }
    }, [onTimeout, timeoutMs])
}


/**
 * useOnlineStatus — tracks whether user is online/offline.
 * Returns true if online, false if offline.
 */
export function useOnlineStatus() {
    const [online, setOnline] = useState(navigator.onLine)

    useEffect(() => {
        const goOnline = () => setOnline(true)
        const goOffline = () => setOnline(false)

        window.addEventListener('online', goOnline)
        window.addEventListener('offline', goOffline)
        return () => {
            window.removeEventListener('online', goOnline)
            window.removeEventListener('offline', goOffline)
        }
    }, [])

    return online
}


/**
 * usePageTitle — sets the document title dynamically per page.
 * Appends " | Butler" suffix and restores to "Butler" on unmount.
 * 
 * @param {string} title — e.g., "My Requests"
 */
export function usePageTitle(title) {
    useEffect(() => {
        const prev = document.title
        document.title = title ? `${title} | Butler` : 'Butler'
        return () => { document.title = prev }
    }, [title])
}


/**
 * useEscapeKey — calls callback when Escape key is pressed.
 * Use to close modals, dropdowns, dialogs.
 * 
 * @param {Function} callback — function to call on Escape
 */
export function useEscapeKey(callback) {
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') callback() }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [callback])
}


/**
 * useDebouncedValue — debounces a value by delay ms.
 * Great for search inputs — avoids filtering on every keystroke.
 * 
 * @param {any} value — the raw value (e.g., search input)
 * @param {number} delay — debounce delay in ms (default 300)
 * @returns {any} — the debounced value
 */
export function useDebouncedValue(value, delay = 300) {
    const [debounced, setDebounced] = useState(value)

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay)
        return () => clearTimeout(timer)
    }, [value, delay])

    return debounced
}
