const Debug = true

export const p = (...stuffs: any[]) => {
    if (Debug) console.debug(...stuffs)
}
export const j = (obj: any): string => {
    return JSON.stringify(obj, null, '  ')
}
export const pj = (stuff: any) => {
    p(j(stuff))
}

export const getQ = (url: string): string | null => {
    const m = url.match(/[?&]q=([^&]+)/)
    if (!m) return null
    return decodeURIComponent(m[1].replace(/\+/g, ' '))
}