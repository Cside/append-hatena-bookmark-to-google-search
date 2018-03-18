import { getQ } from './utils/url'

(() => {
    const q = getQ(location.search)
    if (q.length === 0) return

    const sideBlock = document.querySelector('#rhs_block')
    if (!sideBlock) {
        console.info('Sidebar (#rhs_block) is not found.')
        return
    }

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