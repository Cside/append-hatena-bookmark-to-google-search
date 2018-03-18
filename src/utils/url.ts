export const getQ = (search: string): string[] => {
    const params = new URLSearchParams(search)
    const q = params.get('q')
    if (!q) return []

    return q.
        replace(/\+/g, ' ').
        replace(/(?:\(|\)|OR|"|')/g, '').
        trim().split(/\s+/)
}