// XXX /runtime は何が違う？
import Handlebars = require('handlebars');
import Axios from 'axios';
import { Bookmarks, isValidBookmarks } from './types/bookmarks'
import { p, j, pj } from './utils'

type Req = { q: string }

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