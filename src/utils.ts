const Debug = true

export const p = m => { if (Debug) console.debug(m) }
export const j = (m): string => { return JSON.stringify(m, null, '  ') }
export const pj = m => { p(j(m)) }


export const getQ = (url: string): string | null => {
    const m = url.match(/[?&]q=([^&]+)/)
    if (!m) return null
    return decodeURIComponent(m[1].replace(/\+/g, ' '))
}