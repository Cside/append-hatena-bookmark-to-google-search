let Debug = true

export const p = (...stuffs: any[]) => {
    if (Debug) console.debug(...stuffs)
}
export const j = (obj: any): string => {
    return JSON.stringify(obj, null, '  ')
}
export const pj = (stuff: any) => {
    p(j(stuff))
}