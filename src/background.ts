// XXX /runtime は何が違う？
import Handlebars = require('handlebars');
import Axios from 'axios';

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
type Req = { q: string }

// TODO needs test ...
const isValidBookmarks = (res: Bookmarks): boolean => {
    return (
        Array.isArray(res) &&
        res.length == 0 || (
            res[0] !== undefined &&
            res[0].entry !== undefined &&
            res[0].url !== undefined
        )
    )
}

(() => {
    const template = `
    `;
    const compiledTemplate = Handlebars.compile(template);
    const axios = Axios.create({
        withCredentials: true,
        responseType: 'json',
        timeout: 20000,
    })

    chrome.runtime.onMessage.addListener((req: Req, sender, cb) => {
        pj(req)
        p(`http://b.hatena.ne.jp/my/search/json?q=${encodeURIComponent(req.q)}`)
        axios.get(`http://b.hatena.ne.jp/my/search/json?q=${encodeURIComponent(req.q)}`).then(res => {
            const data = res.data as Bookmarks
            cb(isValidBookmarks(data) ? j(data) : j(res))
        }).catch(e => {
            console.error(e)
        })
        return true
    })
})()