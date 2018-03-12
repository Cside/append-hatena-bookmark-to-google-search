// XXX /runtime は何が違う？
import Handlebars = require('handlebars');
import Axios, { AxiosResponse, AxiosInstance, AxiosRequestConfig } from 'axios';
import { Bookmarks } from './types/bookmarks'
import { MyName } from './types/my_name'
import { p, j, pj } from './utils/log'
import createAxios from './utils/axios'

type Req = { q: string[] }

(() => {
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

    // setlogger ダサい...
    createAxios().get('http://b.hatena.ne.jp/my.name').then((res: AxiosResponse) => {
        const data = res.data as MyName
        if (!MyName.isValid(data))
            throw new Error(`invalid response.data: ${JSON.stringify(data)}`)
        return data.name

    }).then(name => {
        // TODO: cb にどんな型でも入れちゃえる気がする ...
        // TODO: 検索を実行して速攻で window 閉じたらエラーになるっぽい（接続先の window がなくなってるからかな）
        chrome.runtime.onMessage.addListener((req: Req, sender, cb: (string) => void) => {
            // /my/search でも出来るんだけど、302 redirect に 2 sec くらい持ってかれるので id 指定 ...
            createAxios().get(`http://b.hatena.ne.jp/${name}/search/json`, { params: { q: req.q.join(' '), limit: 5 } }).then((res: AxiosResponse) => {
                const b: Bookmarks | undefined = Bookmarks.fromObject(res.data, e => {
                    if (e) {
                        console.error(e)
                        throw e // TODO...
                    }
                })
                if (!b) {
                    cb('') // TODO ...
                    return
                }
                p(`queries: ${JSON.stringify(b.meta.query.queries)}`)
                cb(compiledTemplate(b))

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