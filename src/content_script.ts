import { getQ } from './utils/url'
import { p, j } from './utils/log'

(() => {
    const q = getQ(location.href)
    if (!q) return

    const sideBlock = document.querySelector('#rhs_block')
    if (!sideBlock) return
    // TODO: 消すまでもない。下に追いやるとかで良いのでは。
    //       てか、ブクマ検索結果を受け取ってからいじるべき。
    while (sideBlock.firstChild) {
        sideBlock.removeChild(sideBlock.firstChild)
    }

    chrome.runtime.sendMessage({ q }, (html: string) => {
        p(html)
        sideBlock.innerHTML = html
    })
})()