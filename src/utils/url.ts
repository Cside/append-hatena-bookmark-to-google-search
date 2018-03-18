export const getQ = (search: string): string[] => {
    const params = new URLSearchParams(search)
    const q = params.get('q')
    if (!q) return []

    return q.
        replace(/\+/g, ' ').
        replace(/[()"']/g, '').
        trim().
        split(/\s+/).
        filter((elm) => {
            return !(
                elm === 'OR' ||
                /^(?:\-|\w+:.+)/.test(elm)
            )
        })
}