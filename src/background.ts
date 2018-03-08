// XXX /runtime は何が違う？
import Handlebars = require('handlebars');
import Axios, { AxiosResponse } from 'axios';
import { Bookmarks, isValidBookmarks } from './types/bookmarks'
import { MyName, isValidMyName } from './types/my_name'
import { p, j, pj } from './utils'

type Req = { q: string }

(() => {
    // TODO
    //  - favicon
    //  - bookmark count
    //  - timestamp
    const template = `
    <h2>はてなブックマークの検索結果 ({{meta.total}}件)</h2>
    {{#each bookmarks}}
        <div>
            <h3><a href="{{entry.url}}">{{entry.title}}</a></h3>
            <p>{{timestamp}} {{comment}}</p>
            <blockquote>
                {{entry.snippet}}
            </blockquote>
        </div>
    {{/each}}
    `;
    const compiledTemplate = Handlebars.compile(template);
    const axios = Axios.create({
        withCredentials: true,
        responseType: 'json',
        timeout: 20000,
    })

    axios.get('http://b.hatena.ne.jp/my.name').then((res: AxiosResponse) => {
        const data = res.data as MyName
        if (!isValidMyName(data))
            throw new Error(`invalid response. data: ${JSON.stringify(data)}`)
        return data.name

    }).then(name => {
        // TODO: cb にどんな型でも入れちゃえる気がする ...
        chrome.runtime.onMessage.addListener((req: Req, sender, cb: (string) => void) => {
            // /my/search でも出来るんだけど、302 redirect に 2 sec くらいかかるので id 指定 ...
            axios.get(`http://b.hatena.ne.jp/${name}/search/json`, { params: { q: req.q, limit: 5 } }).then((res: AxiosResponse) => {
                const data = res.data as Bookmarks
                if (!isValidBookmarks(data))
                    // Promise.reject() だとコンパイルエラーになった ... Why ?
                    throw new Error(`invalid response. data: ${JSON.stringify(data)}`)
                cb(compiledTemplate(data))
            }).catch(e => {
                console.error(e)
                cb(String(e)) // TODO: Error handling
            })
            return true
        })
    }).catch(e => {
        // TODO: Error Handling
        console.error(e)
    });
})()