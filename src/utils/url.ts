export const getQ = (search: string): string[] => {
    const params = new URLSearchParams(search)
    const q = params.get('q')
    if (!q) return []

    return decodeURIComponent(
        q.replace(/\+/g, ' ')
    ).trim().split(/\s+/)
}