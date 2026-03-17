import { useState, useEffect } from 'react'

/**
 * usePageLoading — simulates API loading delay for Phase 1 mock data.
 * Returns { loading, data } — shows skeleton during loading, then data.
 * 
 * Usage:
 *   const { loading, data } = usePageLoading(MOCK_REQUESTS, 600)
 *   if (loading) return <SkeletonCard />
 *   // render with data
 */
export function usePageLoading(mockData, delay = 500) {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState(null)

    useEffect(() => {
        const timer = setTimeout(() => {
            setData(mockData)
            setLoading(false)
        }, delay)
        return () => clearTimeout(timer)
    }, []) // only run on mount

    return { loading, data: data ?? mockData }
}
