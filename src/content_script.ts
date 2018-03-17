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
        if (args.error) {
            console.error(args.error)
            sideBlock.innerHTML = `
                <p>Error:</p>
                <pre><code>${JSON.stringify(args.error, null, '    ')}</code></pre>`
            return
        } else if (!args.html) {
            throw new Error('!error && !html')
        }

        while (sideBlock.firstChild) {
            sideBlock.removeChild(sideBlock.firstChild)
        }
        sideBlock.innerHTML = args.html || ''
    })
})()