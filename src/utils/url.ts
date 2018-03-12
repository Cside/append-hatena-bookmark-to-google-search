export const getQ = (url: string): string[] | undefined => {
    const m = url.match(/[?&]q=([^&]+)/)

    // TODO: Go に慣れた身からすると string[] | undefined って違和感が...。
    // とはいえ [], new Error(...) とか書くのは流石に Go っぽすぎ ... ?
    if (!m) return undefined
    return decodeURIComponent(
        m[1].replace(/\+/g, ' ')
    ).trim().split(/\s+/)
}