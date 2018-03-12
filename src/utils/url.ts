export const getQ = (url: string): string | null => {
    const m = url.match(/[?&]q=([^&]+)/)
    if (!m) return null
    return decodeURIComponent(m[1].replace(/\+/g, ' '))
}