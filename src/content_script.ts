import { getQ } from './utils/url'
import { p, j } from './utils/log'

(() => {
    const q = getQ(location.href)
    if (!q) return

    const sideBlock = document.querySelector('#rhs_block')
    if (!sideBlock)
        throw new Error("Sidebar (#rhs_block) is not found.")

    chrome.runtime.sendMessage({ q }, (html: string) => {
        while (sideBlock.firstChild) {
            sideBlock.removeChild(sideBlock.firstChild)
        }
        sideBlock.innerHTML = html
    })
})()