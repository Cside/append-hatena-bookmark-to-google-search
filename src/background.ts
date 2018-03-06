// XXX /runtime は何が違う？
import Handlebars = require('handlebars');
import Axios = require('axios');

const Debug = true

const p = m => { if (Debug) console.debug(m) }
const j = (m): string => { return JSON.stringify(m, null, '  ') }
const pj = m => { p(j(m)) }

type Bookmark = {
    timestamp: number
    comment: string
    entry: {
        snippet: string
        count: string
        url: string
        title: string
        eid: string
    }
}
type Bookmarks = {
    bookmarks: Bookmark[]
}

const isValidBookmarks = (res: Bookmarks): boolean => {
    return (
        res[0] !== undefined &&
        res[0].entry !== undefined &&
        res[0].url !== undefined
    )
}

(() => {
    const template = `
    `;
    const compiledTemplate = Handlebars.compile(template);

    chrome.runtime.onMessage.addListener((req, sender, cb) => {
        // 'http://b.hatena.ne.jp/Cside/search/json?q=golang',
        return true
    })
})()