const p = m => { console.log(m) }
const pj = m => { console.log(JSON.stringify(m, null, '  ')) }

const getQ = (): string | null => {
    const m = location.href.match(/[?&]q=([^&]+)/)
    if (!m) return null
    return decodeURIComponent(m[1].replace(/\+/g, ' '))
}

(() => {
    const q = getQ() // space で分割とかはやってない ...
    if (!q) return

    const sideBlock = document.querySelector('#rhs_block')
    if (!sideBlock) return
    // TODO 消すまでもない。下に追いやるとかで良いのでは。
    while (sideBlock.firstChild) {
        sideBlock.removeChild(sideBlock.firstChild)
    }
})()