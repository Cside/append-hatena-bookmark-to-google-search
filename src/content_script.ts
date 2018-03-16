import { getQ } from './utils/url'

(() => {
    const q = getQ(location.href)
    if (!q) return

    const sideBlock = document.querySelector('#rhs_block')
    if (!sideBlock)
        throw new Error('Sidebar (#rhs_block) is not found.')

    chrome.runtime.sendMessage({ q }, (args: {
        html?: string,
        error?: Error,
    }) => {
        console.log(JSON.stringify(args))
        console.log(args)
        if (args.error) {
            sideBlock.innerHTML = `<p>${String(args.error)}</p>`
            return
        }
        while (sideBlock.firstChild) {
            sideBlock.removeChild(sideBlock.firstChild)
        }
        sideBlock.innerHTML = args.html || ''
    })
})()